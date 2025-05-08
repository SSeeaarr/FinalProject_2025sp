import Ability from './Ability.js';

export default class Dash extends Ability {
    constructor(gp, player) {
        super(gp, player);
        this.name = "Dash";
        this.cooldown = 3.0; // 3 seconds cooldown
        
        // Setup scaling values (dash damage scales with strength and attack)
        this.baseDamage = 3;
        this.strengthScaling = 0.4; // 40% of strength
        this.attackScaling = 0.3; // 30% of attack
        
        // Dash-specific properties
        this.dashDuration = 0.3; // Duration of dash in seconds
        this.dashTimer = 0;
        this.dashSpeed = 750; // Pixels per second during dash
        this.isDashing = false;
        this.dashDirection = { x: 0, y: 0 };
        this.phasing = false; // Tracks if player is phasing through enemies
        
        // Visual effects
        this.trailEffect = []; // For dash trail particles
        
        // Only keep the icon image for UI
        this.icon = new Image();
        this.icon.src = './res/abilities/dash_icon.png';
    }

    update() {
        super.update();
        
        // Handle active dash
        if (this.isDashing) {
            this.dashTimer += this.gp.deltaTime;
            
            // Apply dash movement
            const moveDistance = this.dashSpeed * this.gp.deltaTime;
            
            // Store the player's original position for collision checks
            const originalX = this.player.x;
            const originalY = this.player.y;
            
            // Update player position without normal collision checks
            this.player.x += this.dashDirection.x * moveDistance;
            this.player.y += this.dashDirection.y * moveDistance;
            
            // Create trail effect
            if (this.gp.deltaTime < 0.1) { // Prevent too many particles on lag
                this.trailEffect.push({
                    x: this.player.x + this.gp.tileSize / 2,
                    y: this.player.y + this.gp.tileSize / 2,
                    alpha: 1.0,
                    size: this.gp.tileSize * 0.8
                });
            }
            
            // Check for enemies to damage but without knockback
            this.checkDashHit();
            
            // We still need to check for wall collisions, but not monster collisions
            this.player.collisionOn = false;
            this.gp.cChecker.checkTile(this.player);
            
            // Check object collision (but not monsters)
            let objIndex = this.gp.cChecker.checkObject(this.player, true);
            if (objIndex !== 999) {
                const obj = this.gp.obj[this.gp.currentMap][objIndex];
                if (obj && obj.collision) {
                    this.player.collisionOn = true;
                }
            }
            
            // If player hits a wall during dash, reset to original position
            if (this.player.collisionOn) {
                this.player.x = originalX;
                this.player.y = originalY;
            }
            
            // End dash if duration is over
            if (this.dashTimer >= this.dashDuration) {
                this.endDash();
            }
        }
        
        // Update trail effect
        this.trailEffect = this.trailEffect.filter(particle => {
            particle.alpha -= this.gp.deltaTime * 3;
            particle.size -= this.gp.deltaTime * 40;
            return particle.alpha > 0;
        });
    }

    activate() {
        if (super.activate() && !this.isDashing) {
            // Set dash direction based on player facing
            switch(this.player.direction) {
                case "up":
                    this.dashDirection = { x: 0, y: -1 };
                    break;
                case "down":
                    this.dashDirection = { x: 0, y: 1 };
                    break;
                case "left":
                    this.dashDirection = { x: -1, y: 0 };
                    break;
                case "right":
                    this.dashDirection = { x: 1, y: 0 };
                    break;
            }
            
            // Start dash
            this.isDashing = true;
            this.phasing = true; // Enable phasing through monsters
            this.dashTimer = 0;
            
            // Make player invulnerable during dash
            this.player.invincible = true;
            
            return true;
        }
        return false;
    }

    endDash() {
        this.isDashing = false;
        this.phasing = false; // Disable phasing
        
        // Only end invincibility from dash if player isn't otherwise invincible
        if (this.player.invincibleTimer < 0.01) {
            this.player.invincible = false;
        }
    }

    checkDashHit() {
        if (!this.isDashing) return;
        
        // Calculate damage based on player stats
        const scaledDamage = this.calculateDamage();
        
        this.gp.monster[this.gp.currentMap]?.forEach(monster => {
            if (monster && monster.alive && !monster.dying && !monster.invincible) {
                const monsterArea = {
                    x: monster.x + monster.solidArea.x,
                    y: monster.y + monster.solidArea.y,
                    width: monster.solidArea.width,
                    height: monster.solidArea.height
                };

                const playerArea = {
                    x: this.player.x + this.player.solidArea.x,
                    y: this.player.y + this.player.solidArea.y,
                    width: this.player.solidArea.width,
                    height: this.player.solidArea.height
                };

                if (this.rectIntersect(monsterArea, playerArea)) {
                    // Damage the monster with scaled damage
                    monster.takeDamage(scaledDamage);
                }
            }
        });
    }

    calculateDamage() {
        return this.baseDamage +
               (this.player.strength * this.strengthScaling) +
               (this.player.attack * this.attackScaling);
    }

    draw(ctx) {
        // Draw ghostly effect when phasing
        if (this.phasing) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'rgba(200, 230, 255, 0.3)';
            ctx.fillRect(this.player.x, this.player.y, this.gp.tileSize, this.gp.tileSize);
            ctx.restore();
        }
        
        // Draw trail effect
        this.trailEffect.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = 'rgba(200, 220, 255, 0.7)';
            
            const halfSize = particle.size / 2;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, halfSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Call parent draw method to display cooldown indicator
        super.draw(ctx);
    }
}