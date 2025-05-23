import Ability from './Ability.js';

export class ArrowInstance { // Export class
    constructor(x, y, directionX, directionY, gp, player, damage, speed, lifetime, image) {
        this.x = x;
        this.y = y;
        this.baseSpeed = speed;
        
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        this.directionX = magnitude === 0 ? 0 : directionX / magnitude;
        this.directionY = magnitude === 0 ? 0 : directionY / magnitude;
        
        this.gp = gp;
        this.player = player; // Can be null for remote instances
        this.active = true;
        this.damage = player ? damage : 0; // Damage is 0 for remote visual instances
        this.lifetime = lifetime;
        this.age = 0;
        this.image = image;
        
        this.width = 24;
        this.height = 24;
    }

    update() {
        const moveDistance = this.baseSpeed * this.gp.deltaTime;
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;

        this.age += this.gp.deltaTime;
        if (this.age >= this.lifetime) {
            this.active = false;
            return;
        }

        if (this.player) { // Only player's own arrows check collision
            this.gp.monster[this.gp.currentMap]?.forEach(monster => {
                if (monster && monster.alive && !monster.dying && this.active) { // check this.active
                    const monsterArea = {
                        x: monster.x + monster.solidArea.x,
                        y: monster.y + monster.solidArea.y,
                        width: monster.solidArea.width,
                        height: monster.solidArea.height
                    };
                    const arrowArea = {
                        x: this.x,
                        y: this.y,
                        width: this.width,
                        height: this.height
                    };
                    if (this.rectIntersect(monsterArea, arrowArea)) {
                        if (!monster.invincible) {
                            monster.takeDamage(this.damage);
                            this.active = false; 
                        }
                    }
                }
            });
        }
        if (!this.active) return;

        const maxBoundary = this.gp.tileSize * Math.max(this.gp.maxScreenCol, this.gp.maxScreenRow) * 1.5;
        if (
            this.x < -maxBoundary || this.x > this.gp.tileSize * this.gp.maxScreenCol + maxBoundary ||
            this.y < -maxBoundary || this.y > this.gp.tileSize * this.gp.maxScreenRow + maxBoundary
        ) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            const angle = Math.atan2(this.directionY, this.directionX);
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(angle);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillStyle = 'grey';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    rectIntersect(r1, r2) {
        return (
            r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r2.height > r2.y
        );
    }
}

export default class TripleShot extends Ability {
    constructor(gp, player) {
        super(gp, player);
        this.name = "TripleShot";
        this.cooldown = 4.0; // 4 seconds cooldown
        
        // Setup scaling values (arrows scale mostly with dexterity)
        this.baseDamage = 1; // Base damage before scaling
        this.strengthScaling = 0.6; // 60% of str added to damage
        this.attackScaling = 1.2; // 80% of attack added to damage

        this.damage = 1.5; // Lower damage per arrow
        this.speed = 900; 
        this.lifetime = 4; // Shorter lifetime than fireball
        
        // Burst properties
        this.burstCount = 5; // Total number of bursts
        this.burstDelay = 0.1; // Time between bursts in seconds
        this.burstTimer = 0;
        this.currentBurst = 0;
        this.isBursting = false;
        
        // Load the image
        this.projectileImage = new Image();
        this.projectileImage.src = './res/monster/Projectile.png';
        this.icon = new Image();
        this.icon.src = './res/abilities/tripleshot_icon.png';
    }

    update() {
        super.update();
        
        // Handle burst firing
        if (this.isBursting) {
            this.burstTimer += this.gp.deltaTime;
            
            if (this.burstTimer >= this.burstDelay) {
                // Fire a triple spread
                this.fireTripleArrow();
                
                // Reset burst timer and increment count
                this.burstTimer = 0;
                this.currentBurst++;
                
                // Check if we've fired all bursts
                if (this.currentBurst >= this.burstCount) {
                    this.isBursting = false;
                    this.currentBurst = 0;
                }
            }
        }
    }

    activate() {
        if (super.activate()) { // Checks if ability is ready and starts cooldown
            // Start burst sequence
            this.isBursting = true;
            this.currentBurst = 0;
            this.burstTimer = this.burstDelay; // Immediately fire first salvo
            
            if (this.gp.multiplayer && this.gp.multiplayer.socket && this.gp.multiplayer.socket.readyState === WebSocket.OPEN) {
                this.gp.multiplayer.sendGameAction('abilityUsed', {
                    abilityName: this.name,
                    casterId: this.gp.multiplayer.playerId,
                    direction: this.player.direction 
                });
            }
            
            return true;
        }
        return false;
    }
    
    fireTripleArrow() {
        // Main direction based on player facing
        let mainDirX = 0;
        let mainDirY = 0;
        
        switch(this.player.direction) {
            case "up":
                mainDirY = -1;
                break;
            case "down":
                mainDirY = 1;
                break;
            case "left":
                mainDirX = -1;
                break;
            case "right":
                mainDirX = 1;
                break;
        }
        
        // Calculate position to fire from (center of player)
        const startX = this.player.x + this.gp.tileSize / 2 - 8;
        const startY = this.player.y + this.gp.tileSize / 2 - 8;
        
        // Create three arrows: one straight, one slightly left, one slightly right
        // For horizontal/vertical shots
        if (mainDirX === 0) { // Shooting up or down
            // Center arrow
            this.createArrow(startX, startY, mainDirX, mainDirY);
            // Left arrow
            this.createArrow(startX, startY, -0.2, mainDirY);
            // Right arrow
            this.createArrow(startX, startY, 0.2, mainDirY);
        } else { // Shooting left or right
            // Center arrow
            this.createArrow(startX, startY, mainDirX, mainDirY);
            // Up arrow
            this.createArrow(startX, startY, mainDirX, -0.2);
            // Down arrow
            this.createArrow(startX, startY, mainDirX, 0.2);
        }
    }
    
    createArrow(x, y, dirX, dirY) {
        // Calculate damage based on player stats
        const scaledDamage = this.calculateDamage();
        
        this.instances.push(new ArrowInstance(
            x, y, dirX, dirY, this.gp, this.player,
            scaledDamage, this.speed, this.lifetime, this.projectileImage
        ));
    }

    calculateDamage() {
        return this.baseDamage +
               this.player.dexterity * this.dexterityScaling +
               this.player.strength * this.strengthScaling +
               this.player.attack * this.attackScaling;
    }
}