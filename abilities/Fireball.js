import Ability from './Ability.js';

export default class Fireball extends Ability {
    constructor(gp, player) {
        super(gp, player);
        this.name = "Fireball";
        this.cooldown = 2.0; // 2 seconds cooldown
        
        // Setup scaling values (fireballs scale primarily with strength)
        this.baseDamage = 2; // Base damage before scaling
        this.strengthScaling = 0.6; // 60% of strength added to damage
        this.attackScaling = 0.2; // 10% of attack added to damage
        
        this.speed = 800; // Increase from 500 to 800 for faster fireballs
        this.lifetime = 6; // How long each fireball lives in seconds
        
        // Load the image
        this.projectileImage = new Image();
        this.projectileImage.src = './res/monster/Projectile.png';
        this.icon = new Image();
        this.icon.src = './res/abilities/fireball_icon.png';
    }

    activate() {
        if (super.activate()) { // Checks if ability is ready and starts cooldown
            // Calculate direction based on player facing
            let dirX = 0;
            let dirY = 0;
            
            switch(this.player.direction) {
                case "up":
                    dirY = -1;
                    break;
                case "down":
                    dirY = 1;
                    break;
                case "left":
                    dirX = -1;
                    break;
                case "right":
                    dirX = 1;
                    break;
            }
            
            // Calculate starting position (center of player)
            const startX = this.player.x + this.gp.tileSize / 2 - 8;
            const startY = this.player.y + this.gp.tileSize / 2 - 8;
            
            // Calculate damage based on player stats
            const scaledDamage = this.calculateDamage();
            
            // Create new fireball instance with scaled damage
            this.instances.push(new FireballInstance(
                startX, 
                startY, 
                dirX, 
                dirY, 
                this.gp, 
                this.player,
                scaledDamage, // Use scaled damage
                this.speed,
                this.lifetime,
                this.projectileImage
            ));
            
            return true;
        }
        return false;
    }

    calculateDamage() {
        return this.baseDamage +
               (this.player.strength * this.strengthScaling) +
               (this.player.attack * this.attackScaling);
    }
}

class FireballInstance {
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
        
        this.width = 48;
        this.height = 48;
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

                const fireballArea = {
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height
                };

                if (this.rectIntersect(monsterArea, fireballArea)) {
                    if (!monster.invincible) {
                        monster.takeDamage(this.damage);
                        
                        // Create impact effect
                        const impactX = this.x + this.width / 2;
                        const impactY = this.y + this.height / 2;
                        
                        
                        
                        // Add effect to ability instance
                        if (this.player.abilities[0] && typeof this.player.abilities[0].createImpactEffect === 'function') {
                            const effect = this.player.abilities[0].createImpactEffect(
                                impactX, 
                                impactY, 
                                'rgba(255, 100, 0, 0.7)'
                            );
                            if (effect && typeof effect.update === 'function') {
                                // Store the effect somewhere it can be updated
                                if (!this.player.gp.effects) this.player.gp.effects = [];
                                this.player.gp.effects.push(effect);
                            }
                        }
                        
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
        // Draw fire trail particles
        const particleCount = 5; // Increased from 3 to 5 for better effect
        for (let i = 0; i < particleCount; i++) {
            const particleSize = Math.random() * 10 + 5;
            
            // This is the key change - calculate better trail positions
            // Create particles along a line behind the fireball
            const trailLength = 30; // How far behind the fireball the trail extends
            const randomOffset = 10; // How much random spread
            
            // Calculate a position behind the fireball based on its direction
            const distanceBehind = Math.random() * trailLength;
            const offsetX = -this.directionX * distanceBehind + (Math.random() - 0.5) * randomOffset;
            const offsetY = -this.directionY * distanceBehind + (Math.random() - 0.5) * randomOffset;
            
            // Center position of the fireball
            const centerX = this.x + this.width/2;
            const centerY = this.y + this.height/2;
            
            ctx.beginPath();
            ctx.arc(
                centerX + offsetX, 
                centerY + offsetY, 
                particleSize, 
                0, 
                Math.PI * 2
            );
            
            // Create gradient for fire effect
            const gradient = ctx.createRadialGradient(
                centerX + offsetX, 
                centerY + offsetY, 
                0,
                centerX + offsetX, 
                centerY + offsetY, 
                particleSize
            );
            gradient.addColorStop(0, 'rgba(255, 255, 100, 0.8)');
            gradient.addColorStop(0.6, 'rgba(255, 100, 0, 0.6)');
            gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Draw the actual fireball
        if (this.image.complete) {
            // Add glow effect
            ctx.save();
            ctx.shadowColor = 'rgba(255, 100, 0, 0.8)';
            ctx.shadowBlur = 15;
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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