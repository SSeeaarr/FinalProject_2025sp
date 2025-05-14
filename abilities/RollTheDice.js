import Ability from './Ability.js';

export default class RollTheDice extends Ability {
    constructor(gp, player) {
        super(gp, player);
        this.name = "Roll the Dice";
        this.cooldown = 3.0; // 3 seconds cooldown
        
        // Dice effects scale less with stats due to the random nature
        this.baseDamage = 2;
        this.strengthScaling = 0.3;
        this.dexterityScaling = 0.3;
        
        // Scale effect magnitudes with level
        this.damageBoostAmount = 2 + Math.floor(this.player.level * 0.5); // +0.5 per level
        this.speedBoostMultiplier = 1.5 + (this.player.level * 0.05); // +5% per level
        this.healAmount = 1 + Math.floor(this.player.level * 0.3); // +0.3 per level
        
        // Dice effect properties
        this.effectDuration = 5.0; // Duration of effects in seconds
        this.effectTimer = 0;
        this.currentEffect = 0; // Which effect is currently active
        this.activeEffect = false;
        
        // Visual properties
        this.diceAnimationDuration = 2.0; // Increased from 1.0 to 2.0 seconds for slower animation
        this.diceAnimationTimer = 0;
        this.isRolling = false;
        this.diceResult = 0;
        
        // Load dice images
        this.diceImages = [];
        for (let i = 1; i <= 6; i++) {
            const img = new Image();
            img.src = `./res/abilities/dice${i}.png`;
            this.diceImages.push(img);
        }
        
        // Particle effects
        this.particles = [];
        
        // Add icon
        this.icon = new Image();
        this.icon.src = './res/abilities/dice_icon.png';
    }

    update() {
        super.update();
        
        // Handle dice rolling animation
        if (this.isRolling) {
            this.diceAnimationTimer += this.gp.deltaTime;
            
            // Rapidly change dice result during animation, but less frequently
            if (this.diceAnimationTimer < this.diceAnimationDuration) {
                if (this.gp.deltaTime < 0.1 && Math.random() < 0.3) { // Only 30% chance each frame
                    this.diceResult = Math.floor(Math.random() * 6) + 1;
                }
            } else {
                // Animation finished, apply the effect
                this.isRolling = false;
                this.activeEffect = true;
                this.effectTimer = 0;
                
                // Apply the effect based on final roll
                this.applyDiceEffect(this.diceResult);
                
                // Show message about the effect
                this.showEffectMessage(this.diceResult);
            }
        }
        
        // Update active effect
        if (this.activeEffect) {
            this.effectTimer += this.gp.deltaTime;
            
            // Handle ongoing effects
            this.updateActiveEffect();
            
            // End effect when timer expires
            if (this.effectTimer >= this.effectDuration) {
                this.endEffect();
            }
        }
        
        // Update particles
        this.particles = this.particles.filter(particle => {
            particle.update();
            return particle.active;
        });
    }

    activate() {
        if (super.activate()) { // Checks if ability is ready and starts cooldown
            // Start dice rolling animation
            this.isRolling = true;
            this.diceAnimationTimer = 0;
            
            // Cancel any existing effect
            if (this.activeEffect) {
                this.endEffect();
            }
            
            return true;
        }
        return false;
    }
    
    applyDiceEffect(diceResult) {
        this.currentEffect = diceResult;
        
        // Recalculate effect magnitudes each time based on current player level
        this.damageBoostAmount = 2 + Math.floor(this.player.level * 0.5);
        this.speedBoostMultiplier = 1.5 + (this.player.level * 0.05);
        this.healAmount = 1 + Math.floor(this.player.level * 0.3);
        
        switch(diceResult) {
            case 1: // Heal
                this.player.life = Math.min(this.player.life + this.healAmount, this.player.maxLife);
                this.createHealParticles();
                break;
                
            case 2: // Damage all enemies in radius
                this.damageNearbyEnemies();
                break;
                
            case 3: // Temporary invincibility
                this.player.invincible = true;
                this.createShieldParticles();
                break;
                
            case 4: // Damage boost
                this.player.strength += this.damageBoostAmount;
                this.createPowerParticles();
                break;
                
            case 5: // Speed boost
                this.player.baseSpeed *= this.speedBoostMultiplier;
                this.createSpeedParticles();
                break;
                
            case 6: // Gold bonus
                const goldBonus = Math.floor(Math.random() * 10) + 5; // 5-15 gold
                this.player.coin += goldBonus;
                this.createGoldParticles(goldBonus);
                break;
        }
    }
    
    updateActiveEffect() {
        // For effects that need continuous updates
        switch(this.currentEffect) {
            case 3: // Keep invincibility active
                this.player.invincibleTimer = 0; // Prevent invincibility from expiring
                if (this.gp.deltaTime < 0.1 && Math.random() < 0.2) {
                    this.createShieldParticles();
                }
                break;
                
            case 5: // Speed particles
                if (this.gp.deltaTime < 0.1 && Math.random() < 0.2) {
                    this.createSpeedParticles();
                }
                break;
        }
    }
    
    endEffect() {
        this.activeEffect = false;
        
        // Undo effect changes
        switch(this.currentEffect) {
            case 3: // End invincibility
                this.player.invincible = false;
                break;
                
            case 4: // End damage boost
                this.player.strength -= this.damageBoostAmount;
                break;
                
            case 5: // End speed boost
                this.player.baseSpeed /= this.speedBoostMultiplier;
                break;
        }
        
        this.currentEffect = 0;
    }
    
    showEffectMessage(diceResult) {
        switch(diceResult) {
            case 1:
                this.gp.ui.showMessage("Lucky! You gained health!");
                break;
            case 2:
                this.gp.ui.showMessage("Boom! Area damage!");
                break;
            case 3:
                this.gp.ui.showMessage("Invincibility shield activated!");
                break;
            case 4:
                this.gp.ui.showMessage("Strength enhanced!");
                break;
            case 5:
                this.gp.ui.showMessage("Speed boosted!");
                break;
            case 6:
                this.gp.ui.showMessage("Jackpot! Gold bonus!");
                break;
        }
    }
    
    damageNearbyEnemies() {
        // Damage radius (in pixels)
        const radius = this.gp.tileSize * 4;
        
        // Player center position
        const playerCenterX = this.player.x + this.gp.tileSize / 2;
        const playerCenterY = this.player.y + this.gp.tileSize / 2;
        
        // Calculate damage based on player stats
        const scaledDamage = this.calculateDamage();
        
        // Check each monster
        this.gp.monster[this.gp.currentMap]?.forEach(monster => {
            if (monster && monster.alive && !monster.dying) {
                // Monster center position
                const monsterCenterX = monster.x + this.gp.tileSize / 2;
                const monsterCenterY = monster.y + this.gp.tileSize / 2;
                
                // Calculate distance
                const dx = monsterCenterX - playerCenterX;
                const dy = monsterCenterY - playerCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // If within radius, damage monster with scaled damage
                if (distance <= radius) {
                    monster.takeDamage(scaledDamage);
                }
            }
        });
        
        // Create explosion particles
        this.createExplosionParticles(radius);
    }
    
    calculateDamage() {
        return this.baseDamage + (this.player.strength * this.strengthScaling) + (this.player.dexterity * this.dexterityScaling);
    }
    
    // Particle creation methods
    createHealParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(
                this.player.x + this.gp.tileSize/2, 
                this.player.y + this.gp.tileSize/2,
                'green', this.gp
            ));
        }
    }
    
    createShieldParticles() {
        for (let i = 0; i < 3; i++) {
            this.particles.push(new Particle(
                this.player.x + Math.random() * this.gp.tileSize, 
                this.player.y + Math.random() * this.gp.tileSize,
                'cyan', this.gp
            ));
        }
    }
    
    createPowerParticles() {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(
                this.player.x + this.gp.tileSize/2, 
                this.player.y + this.gp.tileSize/2,
                'red', this.gp
            ));
        }
    }
    
    createSpeedParticles() {
        this.particles.push(new Particle(
            this.player.x + Math.random() * this.gp.tileSize, 
            this.player.y + this.gp.tileSize,
            'yellow', this.gp
        ));
    }
    
    createGoldParticles(amount) {
        for (let i = 0; i < amount; i++) {
            this.particles.push(new Particle(
                this.player.x + this.gp.tileSize/2, 
                this.player.y + this.gp.tileSize/2,
                'gold', this.gp
            ));
        }
    }
    
    createExplosionParticles(radius) {
        const centerX = this.player.x + this.gp.tileSize/2;
        const centerY = this.player.y + this.gp.tileSize/2;
        
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            this.particles.push(new Particle(x, y, 'orange', this.gp));
        }
    }

    draw(ctx) {
        // Draw dice during rolling animation - positioned to avoid ability icons
        if (this.isRolling) {
            const diceImage = this.diceImages[this.diceResult - 1];
            if (diceImage && diceImage.complete) {
                const diceSize = 64;
                const padding = 20; // Padding from screen edge
                const abilityIconsWidth = (this.abilities?.length || 4) * 42; // Estimate space taken by ability icons
                
                // Position in bottom right, shifted left to avoid ability indicators
                const bottomRightX = this.gp.screenWidth - diceSize - padding - abilityIconsWidth;
                const bottomRightY = this.gp.screenHeight - diceSize - padding;
                
                ctx.drawImage(diceImage, bottomRightX, bottomRightY, diceSize, diceSize);
            }
        }
        
        // Draw active effect indicator above player
        if (this.activeEffect) {
            const effectSize = 24;
            if (this.diceImages[this.currentEffect - 1]?.complete) {
                ctx.drawImage(
                    this.diceImages[this.currentEffect - 1], 
                    this.player.x, 
                    this.player.y - effectSize - 5, 
                    effectSize, 
                    effectSize
                );
            }
        }
        
        // Draw particles
        this.particles.forEach(particle => {
            particle.draw(ctx);
        });
        
        // The base class will draw the cooldown indicator
        super.draw(ctx);
    }
}

class Particle {
    constructor(x, y, color, gp) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.gp = gp;
        this.size = Math.random() * 10 + 5;
        this.speedX = (Math.random() - 0.5) * 2;
        this.speedY = (Math.random() - 0.5) * 2;
        this.gravity = 0.1;
        this.active = true;
        this.lifetime = Math.random() * 0.5 + 0.3; // 0.3 - 0.8 seconds
        this.age = 0;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        this.speedY += this.gravity;
        this.size *= 0.95;
        
        this.age += this.gp.deltaTime;
        if (this.age >= this.lifetime || this.size < 0.5) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        // Set color based on particle type
        switch(this.color) {
            case 'green':
                ctx.fillStyle = `rgba(0, 255, 0, ${1 - this.age/this.lifetime})`;
                break;
            case 'cyan':
                ctx.fillStyle = `rgba(0, 255, 255, ${1 - this.age/this.lifetime})`;
                break;
            case 'red':
                ctx.fillStyle = `rgba(255, 0, 0, ${1 - this.age/this.lifetime})`;
                break;
            case 'yellow':
                ctx.fillStyle = `rgba(255, 255, 0, ${1 - this.age/this.lifetime})`;
                break;
            case 'gold':
                ctx.fillStyle = `rgba(255, 215, 0, ${1 - this.age/this.lifetime})`;
                break;
            case 'orange':
                ctx.fillStyle = `rgba(255, 165, 0, ${1 - this.age/this.lifetime})`;
                break;
            default:
                ctx.fillStyle = `rgba(255, 255, 255, ${1 - this.age/this.lifetime})`;
        }
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}