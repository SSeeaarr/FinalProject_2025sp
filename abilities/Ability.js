export default class Ability {
    constructor(gp, player) {
        this.gp = gp;
        this.player = player;
        this.name = "Ability";
        this.cooldown = 2.0; // Default cooldown in seconds
        this.cooldownTimer = 0;
        this.isReady = true;
        this.instances = []; // Array to track all active instances of this ability
        this.damage = 1;
        this.icon = null; // For UI representation
        this.abilityIndex = 0; // Will be set when registered with player
        
        // Load default icon if not specified by derived class
        if (!this.icon) {
            this.icon = new Image();
            this.icon.src = './res/abilities/default_ability.png';
        }

        // Add scaling properties
        this.baseDamage = 1; // Base damage before scaling
        this.strengthScaling = 0.0; // How much ability scales with strength (0.0-1.0)
        this.dexterityScaling = 0.0; // How much ability scales with dexterity (0.0-1.0)
        this.attackScaling = 0.0; // How much ability scales with weapon attack (0.0-1.0)
    }

    update() {
        // Handle cooldown
        if (!this.isReady) {
            this.cooldownTimer -= this.gp.deltaTime;
            if (this.cooldownTimer <= 0) {
                this.isReady = true;
                this.cooldownTimer = 0;
            }
        }

        // Update all active instances
        this.instances = this.instances.filter(instance => {
            instance.update();
            return instance.active;
        });
    }

    activate() {
        // Base implementation, should be overridden
        if (this.isReady) {
            // Start cooldown
            this.isReady = false;
            this.cooldownTimer = this.cooldown;
            return true;
        }
        return false;
    }

    draw(ctx) {
        // Draw all active instances
        this.instances.forEach(instance => {
            instance.draw(ctx);
        });
        
        // Draw cooldown indicator
        this.drawCooldownIndicator(ctx);
        
        // Reset text properties to prevent affecting other UI elements
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = 'white';
        ctx.globalAlpha = 1.0;
    }
    
    drawCooldownIndicator(ctx) {
        const iconSize = 48;
        const padding = 20;
        
        // Get the actual unscaled canvas size
        const actualWidth = this.gp.canvas.width / this.gp.renderScale;
        const actualHeight = this.gp.canvas.height / this.gp.renderScale;
        
        // Calculate position using unscaled dimensions
        const x = actualWidth - iconSize - padding;
        const y = actualHeight - iconSize - padding;
        
        // Draw the ability icon background (with rounded corners)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(x, y, iconSize, iconSize, 8);
        ctx.fill();
        
        // Draw the ability icon
        if (this.icon && this.icon.complete) {
            ctx.drawImage(this.icon, x + 4, y + 4, iconSize - 8, iconSize - 8);
        }
        
        // If on cooldown, draw the cooldown overlay
        if (!this.isReady) {
            // Calculate cooldown percentage
            const cooldownPercentage = this.cooldownTimer / this.cooldown;
            
            // Draw semi-transparent overlay
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            
            // Draw a "pie" shape for the remaining cooldown
            ctx.beginPath();
            ctx.moveTo(x + iconSize/2, y + iconSize/2);
            ctx.arc(
                x + iconSize/2, 
                y + iconSize/2, 
                iconSize/2, 
                -Math.PI/2, // Start at top
                -Math.PI/2 + cooldownPercentage * Math.PI * 2, // Fill based on cooldown
                false
            );
            ctx.closePath();
            ctx.fill();
            
            // Show cooldown time in seconds
            const secondsLeft = Math.ceil(this.cooldownTimer);
            if (secondsLeft > 0) {
                ctx.fillStyle = 'white';
                ctx.font = 'bold 18px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(secondsLeft, x + iconSize/2, y + iconSize/2);
            }
        }
        
        // Add ability hotkey
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`'`, x + iconSize/2, y - 18);
    }

    // Utility method for hit detection
    rectIntersect(r1, r2) {
        return (
            r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r2.height > r2.y
        );
    }

    // New method to calculate scaled damage
    calculateDamage() {
        // Get base stats from player
        const strengthBonus = Math.floor(this.player.strength * this.strengthScaling);
        const dexterityBonus = Math.floor(this.player.dexterity * this.dexterityScaling);
        const attackBonus = Math.floor(this.player.attack * this.attackScaling);
        
        // Calculate total damage with scaling
        const scaledDamage = Math.max(
            this.baseDamage + strengthBonus + dexterityBonus + attackBonus,
            1 // Minimum damage is 1
        );
        
        return scaledDamage;
    }

    // New helper method to create impact effects
    createImpactEffect(x, y, color = 'white') {
        // Create impact particles at the given position
        const particleCount = 8;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 2 + Math.random() * 2;
            
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 5 + Math.random() * 5,
                alpha: 1.0,
                color: color
            });
        }
        
        // Return a function that updates and draws these particles
        return {
            update: (ctx) => {
                for (let i = 0; i < particles.length; i++) {
                    const particle = particles[i];
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.size *= 0.95;
                    particle.alpha *= 0.95;
                    
                    ctx.fillStyle = particle.color;
                    ctx.globalAlpha = particle.alpha;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.globalAlpha = 1.0;
                
                // Return false when all particles are invisible
                return particles.some(p => p.alpha > 0.05);
            }
        };
    }
}