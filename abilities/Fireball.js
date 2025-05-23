import Ability from './Ability.js';

export class FireballInstance { // Export class
    constructor(x, y, directionX, directionY, gp, player, damage, speed, lifetime, image) {
        this.x = x;
        this.y = y;
        this.baseSpeed = speed;
        
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        this.directionX = magnitude === 0 ? 0 : directionX / magnitude;
        this.directionY = magnitude === 0 ? 0 : directionY / magnitude;
        
        this.gp = gp;
        this.player = player; // Can be null for remote instances if only visual
        this.active = true;
        this.damage = player ? damage : 0; // Damage is 0 for remote visual instances
        this.lifetime = lifetime;
        this.age = 0;
        this.image = image;
        
        this.width = 48; 
        this.height = 48; 
        
        this.hitboxWidth = this.width * 1.5;
        this.hitboxHeight = this.height * 1.5;
    }

    update() {
        const moveDistance = this.baseSpeed * this.gp.deltaTime;
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;

        this.age += this.gp.deltaTime;
        if (this.age >= this.lifetime) {
            if (this.player) { // Only local player's fireballs create full explosions
                 this.createExplosion(this.x + this.width / 2, this.y + this.height / 2);
            } else {
                // Create a purely visual explosion for remote fireballs
                const parentAbility = this.gp.player.abilities.find(a => a.name === "Fireball");
                if (parentAbility) {
                    const explosionEffect = parentAbility.createExplosionEffect(
                        this.x + this.width / 2, 
                        this.y + this.height / 2,
                        parentAbility.explosionRadius,
                        parentAbility.explosionDuration
                    );
                    // Ensure remoteEffects array exists and add to it
                    if (!this.gp.remoteEffects) this.gp.remoteEffects = [];
                    this.gp.remoteEffects.push(explosionEffect);
                }
            }
            this.active = false;
            return;
        }

        if (this.player) { // Only player's own fireballs check collision and deal damage
            let hasHit = false;
            let hitX = 0;
            let hitY = 0;
            
            this.gp.monster[this.gp.currentMap]?.forEach(monster => {
                if (monster && monster.alive && !monster.dying && !hasHit) {
                    const monsterArea = {
                        x: monster.x + monster.solidArea.x,
                        y: monster.y + monster.solidArea.y,
                        width: monster.solidArea.width,
                        height: monster.solidArea.height
                    };
    
                    const fireballHitbox = {
                        x: this.x - (this.hitboxWidth - this.width) / 2,
                        y: this.y - (this.hitboxHeight - this.height) / 2,
                        width: this.hitboxWidth,
                        height: this.hitboxHeight
                    };
    
                    if (this.rectIntersect(monsterArea, fireballHitbox)) {
                        if (!monster.invincible) {
                            monster.takeDamage(this.damage);
                            hasHit = true;
                            hitX = this.x + this.width / 2;
                            hitY = this.y + this.height / 2;
                        }
                    }
                }
            });
             if (hasHit) {
                this.createExplosion(hitX, hitY);
                this.active = false;
                return;
            }
        }

        const maxBoundary = this.gp.tileSize * Math.max(this.gp.maxScreenCol, this.gp.maxScreenRow) * 1.5;
        if (
            this.x < -maxBoundary || this.x > this.gp.tileSize * this.gp.maxScreenCol + maxBoundary ||
            this.y < -maxBoundary || this.y > this.gp.tileSize * this.gp.maxScreenRow + maxBoundary
        ) {
            this.active = false;
        }
    }

    createExplosion(x, y) {
        const parent = this.player ? this.player.abilities.find(a => a.name === "Fireball") : 
                       this.gp.player.abilities.find(a => a.name === "Fireball"); 
        if (!parent) return;
        
        const explosion = parent.createExplosionEffect(x, y, parent.explosionRadius, parent.explosionDuration);
        if (!this.gp.effects) this.gp.effects = [];
        this.gp.effects.push(explosion);
        
        if (this.player) { // Only deal damage if it's the local player's fireball
            const aoeRadius = parent.explosionRadius;
            const aoeDamageMultiplier = parent.explosionDamageMultiplier;
            const aoeDamage = this.damage * aoeDamageMultiplier;
            
            this.gp.monster[this.gp.currentMap]?.forEach(monster => {
                 if (monster && monster.alive && !monster.dying && !monster.invincible) {
                    const monsterCenterX = monster.x + monster.solidArea.x + monster.solidArea.width / 2;
                    const monsterCenterY = monster.y + monster.solidArea.y + monster.solidArea.height / 2;
                    const dx = monsterCenterX - x;
                    const dy = monsterCenterY - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= aoeRadius) {
                        monster.takeDamage(aoeDamage);
                        if (monster.canBeKnockedBack) {
                            const knockbackDirection = { x: dx / distance, y: dy / distance };
                            monster.knockBack(knockbackDirection, 100, 0.3);
                        }
                    }
                }
            });
        }
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            ctx.fillStyle = 'orange';
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

export default class Fireball extends Ability {
    constructor(gp, player) {
        super(gp, player);
        this.name = "Fireball";
        this.cooldown = 2.0; // 2 seconds cooldown
        
        // Setup scaling values (fireballs scale primarily with strength)
        this.baseDamage = 2; // Base damage before scaling
        this.strengthScaling = 0.6; // 60% of strength added to damage
        this.attackScaling = 0.5; // 50% of attack added to damage
        
        this.speed = 800; // Increase from 500 to 800 for faster fireballs
        this.lifetime = 1; // How long each fireball lives in seconds
        
        // Explosion configuration
        this.explosionRadius = 100; // Radius of explosion AoE in pixels
        this.explosionDuration = 0.5; // Duration of explosion effect in seconds
        this.explosionDamageMultiplier = 0.6; // AoE damage is 60% of direct hit
        
        // Load the image
        this.projectileImage = new Image();
        this.projectileImage.src = './res/objects/fireball.png';
        this.icon = new Image();
        this.icon.src = './res/abilities/fireball_icon.png';
    }

    activate() {
        if (super.activate()) { 
            let dirX = 0;
            let dirY = 0;
            switch(this.player.direction) {
                case "up": dirY = -1; break;
                case "down": dirY = 1; break;
                case "left": dirX = -1; break;
                case "right": dirX = 1; break;
            }
            // Player's center X: this.player.x + this.gp.tileSize / 2
            // Player's center Y: this.player.y + this.gp.tileSize / 2
            // Fireball width/height is 48 (from FireballInstance constructor)
            // To center the fireball, subtract half of its dimensions from the player's center
            const fireballWidth = 48; 
            const fireballHeight = 48;
            const startX = (this.player.x + this.gp.tileSize / 2) - (fireballWidth / 2);
            const startY = (this.player.y + this.gp.tileSize / 2) - (fireballHeight / 2);
            
            const scaledDamage = this.calculateDamage();
            this.instances.push(new FireballInstance(
                startX, startY, dirX, dirY, 
                this.gp, this.player, scaledDamage, 
                this.speed, this.lifetime, this.projectileImage
            ));

            if (this.gp.multiplayer && this.gp.multiplayer.socket && this.gp.multiplayer.socket.readyState === WebSocket.OPEN) {
                this.gp.multiplayer.sendGameAction('abilityUsed', {
                    abilityName: this.name,
                    casterId: this.gp.multiplayer.playerId,
                    startX: startX,
                    startY: startY,
                    dirX: dirX,
                    dirY: dirY,
                });
            }
            return true;
        }
        return false;
    }

    calculateDamage() {
        return this.baseDamage +
               (this.player.strength * this.strengthScaling) +
               (this.player.attack * this.attackScaling);
    }

    createExplosionEffect(x, y, radius, duration) {
        return new FireballExplosion(x, y, radius, duration, this.gp);
    }
}

class FireballExplosion {
    constructor(x, y, radius, duration, gp) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.maxRadius = radius;
        this.duration = duration;
        this.age = 0;
        this.active = true;
        this.gp = gp;
        
        // Particles for the explosion
        this.particles = [];
        
        // Create explosion particles using the gambler's style
        this.createExplosionParticles(radius);
    }
    
    createExplosionParticles(radius) {
        // Drastically reduce particle count for performance
        const particleCount = 15; // Reduced from 60
        
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius * 0.9; // Spread them out a bit more relative to radius
            
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;
            
            const colors = ['orange', 'red', 'yellow']; // Simplified colors
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push(new FireParticle(x, y, color, this.gp, this.duration * (Math.random() * 0.5 + 0.7))); // Particles can live a bit relative to explosion
        }
        
        // Removed the loop for large central particles to save performance
    }
    
    update() {
        this.age += this.gp.deltaTime;
        
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.active;
        });
        
        if (this.age >= this.duration) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        const progress = this.age / this.duration;
        const currentRadius = this.maxRadius * progress; // Simple linear expansion
        const opacity = 1.0 - progress * progress; // Fade out faster
        
        // Simplified initial flash (optional, can be removed if still slow)
        if (progress < 0.2) {
            ctx.save();
            ctx.globalAlpha = 0.4 * (0.2 - progress) / 0.2;
            ctx.fillStyle = 'rgba(255, 255, 180, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, currentRadius * 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        // Main explosion body (Simplified)
        ctx.beginPath();
        ctx.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
            this.x, this.y, currentRadius * 0.1,
            this.x, this.y, currentRadius
        );
        gradient.addColorStop(0, `rgba(255, 200, 50, ${opacity * 0.9})`);
        gradient.addColorStop(0.7, `rgba(255, 100, 0, ${opacity * 0.7})`);
        gradient.addColorStop(1, `rgba(200, 0, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw all particles (they don't have individual shadows anymore)
        this.particles.forEach(particle => {
            particle.draw(ctx);
        });
    }
}

class FireParticle {
    constructor(x, y, color, gp, lifetime) { // Changed duration to lifetime for clarity
        this.x = x;
        this.y = y;
        this.color = color;
        this.gp = gp;
        
        this.size = Math.random() * 12 + 6; // Slightly smaller max size
        
        this.speedX = (Math.random() - 0.5) * 6; 
        this.speedY = (Math.random() - 0.5) * 6; 
        
        this.speedY -= Math.random() * 0.5; // Less upward drift
        
        this.gravity = -0.05; // Weaker gravity
        
        this.active = true;
        this.lifetime = lifetime; 
        this.age = 0;
    }
    
    update() {
        this.x += this.speedX * (this.gp.deltaTime * 60); // Scale speed with deltaTime assuming 60fps base
        this.y += this.speedY * (this.gp.deltaTime * 60);
        
        this.speedY += this.gravity * (this.gp.deltaTime * 60);
        
        this.size *= (1 - (0.5 * this.gp.deltaTime)); // Shrink slower, more consistently
        
        this.age += this.gp.deltaTime;
        if (this.age >= this.lifetime || this.size < 1) { // Increased min size for removal
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        
        const opacity = Math.max(0, 1 - (this.age / this.lifetime));
        
        switch(this.color) {
            case 'red':
                ctx.fillStyle = `rgba(220, 50, 0, ${opacity * 0.8})`;
                break;
            case 'yellow':
                ctx.fillStyle = `rgba(255, 225, 50, ${opacity})`;
                break;
            case 'orange':
            default:
                ctx.fillStyle = `rgba(255, 125, 0, ${opacity * 0.9})`;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.size), 0, Math.PI * 2); // Ensure size isn't negative
        ctx.fill();
        
        ctx.restore();
    }
}