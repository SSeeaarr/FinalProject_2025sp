import Ability from './Ability.js';

export default class TripleShot extends Ability {
    constructor(gp, player) {
        super(gp, player);
        this.name = "TripleShot";
        this.cooldown = 4.0; // 4 seconds cooldown
        
        // Setup scaling values (arrows scale mostly with dexterity)
        this.baseDamage = 1; // Base damage before scaling
        this.dexterityScaling = 0.5; // 50% of dexterity added to damage
        this.attackScaling = 0.2; // 20% of attack added to damage

        this.damage = 1; // Lower damage per arrow
        this.speed = 900; // Increase from 600 to 900 for faster arrows
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
               this.player.attack * this.attackScaling;
    }
}

class ArrowInstance {
    constructor(x, y, directionX, directionY, gp, player, damage, speed, lifetime, image) {
        this.x = x;
        this.y = y;
        this.baseSpeed = speed;
        
        // Store normalized direction vector
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        this.directionX = directionX / magnitude;
        this.directionY = directionY / magnitude;
        
        this.gp = gp;
        this.player = player;
        this.active = true;
        this.damage = damage;
        this.lifetime = lifetime;
        this.age = 0;
        this.image = image;
        
        this.width = 24;
        this.height = 24;
    }

    update() {
        // Update position using deltaTime for frame-rate independence
        const moveDistance = this.baseSpeed * this.gp.deltaTime;
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;

        // Track lifetime
        this.age += this.gp.deltaTime;
        if (this.age >= this.lifetime) {
            this.active = false;
            return;
        }

        // Check collision with monsters
        this.gp.monster[this.gp.currentMap]?.forEach(monster => {
            if (monster && monster.alive && !monster.dying) {
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
                        this.active = false; // Arrow is consumed on hit
                    }
                }
            }
        });

        // Deactivate if out of bounds
        const maxBoundary = this.gp.tileSize * Math.max(this.gp.maxScreenCol, this.gp.maxScreenRow) * 1.5;
        if (
            this.x < -maxBoundary || this.x > this.gp.tileSize * this.gp.maxScreenCol + maxBoundary ||
            this.y < -maxBoundary || this.y > this.gp.tileSize * this.gp.maxScreenRow + maxBoundary
        ) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (this.image.complete) {
            // Calculate rotation angle based on direction
            const angle = Math.atan2(this.directionY, this.directionX);
            
            // Center of the arrow
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            
            // Draw arrow trail effect
            const trailCount = 3;
            ctx.save();
            for (let i = 0; i < trailCount; i++) {
                // Calculate how far behind the arrow this trail segment should be
                const trailDistance = (i + 1) * 12; // Increased from 8 to 12 for more spacing
                
                // Position trail directly behind the arrow based on its direction
                const trailX = centerX - (this.directionX * trailDistance);
                const trailY = centerY - (this.directionY * trailDistance);
                
                // Fade and shrink trails as they get further from the arrow
                const trailAlpha = 0.4 - (i * 0.1); // Start more visible (0.4 instead of 0.3)
                const trailScale = 0.9 - (i * 0.2); // Start larger (0.9 instead of 0.8)
                
                // Draw the trail segment
                ctx.globalAlpha = trailAlpha;
                ctx.save();
                ctx.translate(trailX, trailY);
                ctx.rotate(angle);
                ctx.drawImage(
                    this.image, 
                    -this.width / 2 * trailScale, 
                    -this.height / 2 * trailScale, 
                    this.width * trailScale, 
                    this.height * trailScale
                );
                ctx.restore();
            }
            ctx.restore();
            
            // Draw the main arrow
            ctx.save();
            // Add a subtle glow
            ctx.shadowColor = 'rgba(0, 200, 255, 0.6)';
            ctx.shadowBlur = 10;
            
            ctx.translate(centerX, centerY);
            ctx.rotate(angle);
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            ctx.restore();
        }
    }

    rectIntersect(r1, r2) {
        return (
            r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r1.height > r2.y
        );
    }
}