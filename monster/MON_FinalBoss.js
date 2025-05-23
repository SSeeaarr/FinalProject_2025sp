import Monster from './Monster.js';
import OBJ_Hotdog from '../objects/OBJ_Hotdog.js'; // Add this import

export default class MON_FinalBoss extends Monster {
    constructor(gp) {
        super(gp);

        // Make boss immune to knockback
        this.canBeKnockedBack = false;

        this.name = "Final Boss";
        this.baseSpeed = 100; // Speed in pixels per second
        this.maxLife = 1000;
        this.life = this.maxLife;
        this.noPlayerCollision = false;

        // **Image dimensions**
        this.imageWidth = 200;
        this.imageHeight = 200;

        this.solidArea = {
            x: 40, // Add some padding for hit detection
            y: 40,
            width: this.imageWidth - 80, // Smaller than visual size
            height: this.imageHeight - 80
        };
        this.solidAreaDefaultX = this.solidArea.x;
        this.solidAreaDefaultY = this.solidArea.y;
        
        // Set movement type to chase player
        this.movementType = 'chase';
        
        // Enhanced projectile properties
        this.projectiles = [];
        this.attackPhase = 0; // Current attack pattern
        this.baseAttackPatterns = [
            { name: 'spread', cooldown: 1.2, projectileCount: 8, speed: 180 },
            { name: 'spiral', cooldown: 0.1, burstCount: 36, burstDelay: 0.05, projectileCount: 3, speed: 200 },
            { name: 'targeted', cooldown: 0.7, burstCount: 3, burstDelay: 0.2, projectileCount: 5, speed: 230 },
            { name: 'grid', cooldown: 1.5, columns: 7, rows: 5, speed: 150 }
        ];
        this.attackPatterns = JSON.parse(JSON.stringify(this.baseAttackPatterns));
        this.shootCooldown = 1.0;
        this.shootTimer = 0;
        this.burstCounter = 0;
        this.burstMaxCount = 0;
        this.burstTimer = 0;
        this.burstDelay = 0;
        this.spiralAngle = 0;
        this.patternChangeTimer = 0;
        this.patternChangeDuration = 10; // Change patterns every 10 seconds
        
        // Add a phase tracker
        this.currentPhase = 1; // Phase 1 (full health)
        
        // Visual effects
        this.chargeEffect = false;
        this.chargeTimer = 0;
        this.chargeDuration = 0.5;

        // Animation properties
        this.spriteCounter = 0;
        this.currentFrame = 0;
        this.frames = [];
        this.loadImages();

        // Set custom rewards
        this.exp = 2000;
        this.coins = 500; // Boss drops more coins

        // Death animation properties
        this.dyingDuration = 1.5;
        this.flashCount = 10;
    }

    loadImages() {
        // Load all animation frames (you could add more frames for different boss states)
        this.frames = [
            { img: this.loadFrame('fbtest') },  // Frame 0
        ];

        // Set the initial frame
        this.currentImage = this.frames[0].img;
    }

    loadFrame(frameName) {
        const img = new Image();
        img.src = `./res/monster/${frameName}.png`;
        return img;
    }

    update() {
        // Check if health is 0 or below to trigger death
        if (this.life <= 0 && !this.dying) {
            console.log("Boss health reached 0, starting death sequence");
            this.dying = true;
            this.dyingTimer = 0;
            // Clear projectiles for cleaner death
            this.projectiles = [];
        }

        if (this.dying) {
            this.dyingAnimation(); // Call our own method instead of super
            return;
        }

        if (this.alive) {
            // Handle invincibility
            if (this.invincible) {
                this.invincibleTimer += this.gp.deltaTime;
                if (this.invincibleTimer >= 0.5) {
                    this.invincible = false;
                    this.invincibleTimer = 0;
                }
            }

            // Scale difficulty based on remaining health
            this.updateDifficultyBasedOnHealth();

            // Use parent class movement, but move slower during charge
            if (!this.chargeEffect) {
                super.update();
            } else {
                // Update charge effect
                this.chargeTimer += this.gp.deltaTime;
                if (this.chargeTimer >= this.chargeDuration) {
                    this.chargeEffect = false;
                    this.chargeTimer = 0;
                }
            }

            // Handle pattern changes
            this.patternChangeTimer += this.gp.deltaTime;
            if (this.patternChangeTimer >= this.patternChangeDuration) {
                this.changeAttackPattern();
                this.patternChangeTimer = 0;
            }

            // Handle shooting projectiles based on current attack pattern
            this.shootTimer += this.gp.deltaTime;
            
            // Get current pattern
            const pattern = this.attackPatterns[this.attackPhase];
            
            // Handle different shooting patterns
            if (pattern.name === 'spiral' || pattern.name === 'targeted') {
                // Burst attacks
                if (this.shootTimer >= pattern.cooldown) {
                    this.shootTimer = 0;
                    this.burstCounter = 0;
                    this.burstMaxCount = pattern.burstCount;
                    this.burstDelay = pattern.burstDelay;
                    this.burstTimer = 0;
                    this.chargeEffect = true;
                    this.chargeTimer = 0;
                }
                
                // Handle burst timing
                if (this.burstCounter < this.burstMaxCount) {
                    this.burstTimer += this.gp.deltaTime;
                    if (this.burstTimer >= this.burstDelay) {
                        this.burstTimer = 0;
                        this.burstCounter++;
                        
                        if (pattern.name === 'spiral') {
                            this.shootSpiralProjectiles(pattern);
                            this.spiralAngle += Math.PI / 8;
                        } else if (pattern.name === 'targeted') {
                            this.shootTargetedProjectiles(pattern);
                        }
                    }
                }
            } else {
                // Regular attacks
                if (this.shootTimer >= pattern.cooldown) {
                    this.shootTimer = 0;
                    this.chargeEffect = true;
                    this.chargeTimer = 0;
                    
                    if (pattern.name === 'spread') {
                        this.shootSpreadProjectiles(pattern);
                    } else if (pattern.name === 'grid') {
                        this.shootGridProjectiles(pattern);
                    }
                }
            }

            // Update projectiles
            this.projectiles = this.projectiles.filter(projectile => {
                projectile.update();
                return projectile.active;
            });

            // Update animation frames
            const FRAME_DURATION = 0.1; // Duration for each frame in seconds
            this.spriteCounter += this.gp.deltaTime;
            while (this.spriteCounter >= FRAME_DURATION) {
                this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                this.currentImage = this.frames[this.currentFrame].img;
                this.spriteCounter -= FRAME_DURATION;
            }
        }
    }

    changeAttackPattern() {
        // Choose next pattern
        this.attackPhase = (this.attackPhase + 1) % this.attackPatterns.length;
        this.shootTimer = 0; // Reset shoot timer when changing patterns
        this.burstCounter = 0;
    }
    
    updateDifficultyBasedOnHealth() {
        // Calculate health percentage
        const healthPercentage = this.life / this.maxLife;
        let newPhase = 1;
        
        // Determine which phase we should be in based on health
        if (healthPercentage < 0.33) {
            newPhase = 3;
        } else if (healthPercentage < 0.66) {
            newPhase = 2;
        } else {
            newPhase = 1;
        }
        
        // Only update if phase has changed
        if (newPhase !== this.currentPhase) {
            console.log(`Boss entering phase ${newPhase}!`);
            
            // Reset patterns to base values before applying new multipliers
            this.attackPatterns = JSON.parse(JSON.stringify(this.baseAttackPatterns));
            
            // Apply phase-specific changes
            switch(newPhase) {
                case 3: // Phase 3: Below 33% health - fastest, most aggressive
                    this.baseSpeed = 130;
                    // Increase attack speed for all patterns
                    this.attackPatterns.forEach(pattern => {
                        pattern.speed *= 1.3;       // Faster projectiles
                        pattern.cooldown *= 0.7;    // Faster attacks
                        if (pattern.burstDelay) pattern.burstDelay *= 0.7;
                    });
                    this.patternChangeDuration = 7; // Change patterns more frequently
                    break;
                    
                case 2: // Phase 2: Below 66% health - harder than phase 1
                    this.baseSpeed = 115;
                    // Moderate speed increase
                    this.attackPatterns.forEach(pattern => {
                        pattern.speed *= 1.15;
                        pattern.cooldown *= 0.85;
                        if (pattern.burstDelay) pattern.burstDelay *= 0.85;
                    });
                    this.patternChangeDuration = 8.5;
                    break;
                    
                case 1: // Phase 1: Default difficulty
                    this.baseSpeed = 100;
                    this.patternChangeDuration = 10;
                    break;
            }
            
            // Remember our new phase
            this.currentPhase = newPhase;
            
            // Visual effect for phase transition
            this.showPhaseTransition(newPhase);
            
            // Reset shooting timers to prevent immediate attack burst
            this.shootTimer = 0;
            this.burstCounter = 0;
            this.burstTimer = 0;
        }
    }
    
    showPhaseTransition(phase) {
        // Add this to effects array to be rendered by the game (if you have such a system)
        const phaseColors = {
            1: "rgba(100, 255, 100, 0.5)", // Green glow for phase 1
            2: "rgba(255, 255, 100, 0.5)", // Yellow glow for phase 2
            3: "rgba(255, 100, 100, 0.5)"  // Red glow for phase 3
        };
        
        // Create a flash effect
        this.gp.effects.push({
            x: this.x + this.imageWidth / 2,
            y: this.y + this.imageHeight / 2,
            radius: this.imageWidth,
            color: phaseColors[phase],
            maxRadius: this.imageWidth * 2,
            duration: 1.0,
            timer: 0,
            update: function(deltaTime) {
                this.timer += deltaTime;
                this.radius = this.maxRadius * (this.timer / this.duration);
                return this.timer < this.duration; // keep effect while true
            },
            draw: function(ctx) {
                const alpha = 1 - this.timer / this.duration;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        });
        
        // Spawn healing hotdogs when transitioning phases
        this.spawnHealingItems(phase);
        
        // Make the boss briefly invincible during phase change
        this.invincible = true;
        this.invincibleTimer = 0;
    }

    spawnHealingItems(phase) {
        console.log("Attempting to spawn healing items...");
        
        try {
            // Get current map
            const mapId = this.gp.currentMap;
            
            // Determine how many hotdogs to spawn
            const hotdogCount = phase * 2;
            console.log(`Spawning ${hotdogCount} hotdogs for phase ${phase}`);
            
            // Define fixed walkable positions relative to the PLAYER (not the boss)
            // This ensures they're actually accessible to the player
            const playerX = this.gp.player.x;
            const playerY = this.gp.player.y;
            
            // Define safe positions around the player where hotdogs will spawn
            // (distances in pixels from player position)
            const safePositions = [
                { x: -120, y: -120 },  // Top left
                { x: 120, y: -120 },   // Top right
                { x: -120, y: 120 },   // Bottom left
                { x: 120, y: 120 },    // Bottom right
                { x: 0, y: -150 },     // Top
                { x: 0, y: 150 }       // Bottom
            ];
            
            // Use available positions based on count
            const usedPositions = safePositions.slice(0, hotdogCount);
            
            // Spawn hotdogs at predetermined offsets from player (guaranteed to be accessible)
            for (let i = 0; i < usedPositions.length; i++) {
                // Calculate target position near player
                const worldX = playerX + usedPositions[i].x;
                const worldY = playerY + usedPositions[i].y;
                
                // Convert to grid coordinates
                const col = Math.floor(worldX / this.gp.tileSize);
                const row = Math.floor(worldY / this.gp.tileSize);
                
                try {
                    // Create hotdog
                    const hotdog = new OBJ_Hotdog(this.gp);
                    
                    // Set position explicitly
                    hotdog.worldX = col * this.gp.tileSize;
                    hotdog.worldY = row * this.gp.tileSize;
                    hotdog.x = hotdog.worldX;
                    hotdog.y = hotdog.worldY;
                    
                    console.log(`Hotdog placed near player at: worldX=${hotdog.worldX}, worldY=${hotdog.worldY}`);
                    
                    // Ensure object array for map exists
                    if (!this.gp.obj[mapId]) {
                        this.gp.obj[mapId] = [];
                    }
                    
                    // Add to object array
                    this.gp.obj[mapId].push(hotdog);
                } catch (innerError) {
                    console.error(`Error creating hotdog: ${innerError}`);
                }
            }
            
            this.gp.ui.showMessage("Healing items appeared nearby!");
            
        } catch (error) {
            console.error(`Error in spawnHealingItems: ${error.message}`);
        }
    }

    shootSpreadProjectiles(pattern) {
        const angleStep = Math.PI * 2 / pattern.projectileCount;
        const baseAngle = Math.atan2(
            this.gp.player.y - (this.y + this.imageHeight / 2),
            this.gp.player.x - (this.x + this.imageWidth / 2)
        );
    
        for (let i = 0; i < pattern.projectileCount; i++) {
            const angle = baseAngle - (Math.PI / 2) + (i * angleStep);
            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);
    
            const spawnOffsetX = this.imageWidth / 2;
            const spawnOffsetY = this.imageHeight / 2;
    
            this.projectiles.push(
                new Projectile(
                    this.x + spawnOffsetX,
                    this.y + spawnOffsetY,
                    directionX,
                    directionY,
                    this.gp,
                    pattern.speed
                )
            );
        }
    }
    
    shootSpiralProjectiles(pattern) {
        // Spiral pattern rotates projectiles over time
        for (let i = 0; i < pattern.projectileCount; i++) {
            const angle = this.spiralAngle + (i * (Math.PI * 2 / pattern.projectileCount));
            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);
            
            const spawnOffsetX = this.imageWidth / 2;
            const spawnOffsetY = this.imageHeight / 2;
            
            this.projectiles.push(
                new Projectile(
                    this.x + spawnOffsetX,
                    this.y + spawnOffsetY,
                    directionX,
                    directionY,
                    this.gp,
                    pattern.speed
                )
            );
        }
    }
    
    shootTargetedProjectiles(pattern) {
        // Always aim at the player's current position
        const angleStep = Math.PI * 0.1; // Small spread
        const baseAngle = Math.atan2(
            this.gp.player.y - (this.y + this.imageHeight / 2),
            this.gp.player.x - (this.x + this.imageWidth / 2)
        );
        
        for (let i = 0; i < pattern.projectileCount; i++) {
            const spreadOffset = (i - Math.floor(pattern.projectileCount / 2)) * angleStep;
            const angle = baseAngle + spreadOffset;
            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);
            
            const spawnOffsetX = this.imageWidth / 2;
            const spawnOffsetY = this.imageHeight / 2;
            
            this.projectiles.push(
                new Projectile(
                    this.x + spawnOffsetX,
                    this.y + spawnOffsetY,
                    directionX,
                    directionY,
                    this.gp,
                    pattern.speed
                )
            );
        }
    }
    
    shootGridProjectiles(pattern) {
        // Create a grid of projectiles
        const cellWidth = this.gp.screenWidth / (pattern.columns + 1);
        const cellHeight = this.gp.screenHeight / (pattern.rows + 1);
        
        for (let row = 1; row <= pattern.rows; row++) {
            for (let col = 1; col <= pattern.columns; col++) {
                const targetX = col * cellWidth;
                const targetY = row * cellHeight;
                
                const spawnX = this.x + this.imageWidth / 2;
                const spawnY = this.y + this.imageHeight / 2;
                
                const dirX = targetX - spawnX;
                const dirY = targetY - spawnY;
                const magnitude = Math.sqrt(dirX * dirX + dirY * dirY);
                const normalizedDirX = dirX / magnitude;
                const normalizedDirY = dirY / magnitude;
                
                this.projectiles.push(
                    new Projectile(
                        spawnX,
                        spawnY,
                        normalizedDirX,
                        normalizedDirY,
                        this.gp,
                        pattern.speed
                    )
                );
            }
        }
    }

    draw(ctx) {
        // Don't draw if completely dead
        if (!this.alive && !this.dying) return;

        // Draw charge effect if active
        if (this.chargeEffect) {
            ctx.save();
            ctx.globalAlpha = 0.3 + Math.sin(this.chargeTimer * 10) * 0.2;
            ctx.fillStyle = "rgba(255, 50, 50, 0.3)";
            ctx.beginPath();
            ctx.arc(
                this.x + this.imageWidth / 2,
                this.y + this.imageHeight / 2,
                this.imageWidth * 0.6,
                0,
                Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        }

        // Draw the boss with fade effect when dying
        if (this.currentImage && this.currentImage.complete) {
            if (this.dying) {
                // Fade out gradually during death animation
                ctx.globalAlpha = Math.max(0, 1 - this.dyingCounter / this.dyingDuration);
            } else if (this.invincible) {
                // Flash when hit
                ctx.globalAlpha = 0.7 + Math.sin(this.invincibleTimer * 30) * 0.3;
            }
            
            ctx.drawImage(
                this.currentImage,
                this.x,
                this.y,
                this.imageWidth,
                this.imageHeight
            );
            
            ctx.globalAlpha = 1.0; // Reset alpha
        }

        // Only draw projectiles if still alive
        if (this.alive) {
            this.projectiles.forEach(projectile => projectile.draw(ctx));
        }

        // Draw health bar if visible and not dying
        if (this.showHealthBar && !this.dying) {
            // Draw a larger, more prominent health bar for the boss
            const barWidth = this.imageWidth * 0.8;
            const barHeight = 12;
            const barX = this.x + (this.imageWidth - barWidth) / 2;
            const barY = this.y - 25;

            // Background/border
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(barX-2, barY-2, barWidth+4, barHeight+4);
            
            // Health bar background
            ctx.fillStyle = "#600";
            ctx.fillRect(barX, barY, barWidth, barHeight);
            
            // Calculate health percentage
            const healthPercentage = this.life / this.maxLife;
            let barColor;
            
            // Change color based on health
            if (healthPercentage > 0.66) {
                barColor = "#0f0"; // Green for high health
            } else if (healthPercentage > 0.33) {
                barColor = "#ff0"; // Yellow for medium health
            } else {
                barColor = "#f00"; // Red for low health
            }
            
            // Current health
            ctx.fillStyle = barColor;
            ctx.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
            
            // Draw health text
            ctx.fillStyle = "white";
            ctx.font = "bold 10px Arial";
            ctx.textAlign = "center";
            ctx.fillText(
                `${this.life}/${this.maxLife}`,
                barX + barWidth / 2,
                barY + barHeight - 2
            );
        }
    }

    dyingAnimation() {
        
        
        // Increment the dying timer
        this.dyingTimer += this.gp.deltaTime;
        
        // Visual effects during death
        if (this.dyingTimer < this.dyingDuration) {
            // Pulsating effect
            const pulseRate = 15;
            const alpha = 0.7 + Math.sin(this.dyingTimer * pulseRate) * 0.3;
            
            // Spawn particles
            if (Math.random() < 0.3) {
                // Store reference to GamePanel and deltaTime for the effect
                const gamePanel = this.gp;
                
                this.gp.effects.push({
                    x: this.x + Math.random() * this.imageWidth,
                    y: this.y + Math.random() * this.imageHeight,
                    radius: 5 + Math.random() * 10,
                    color: "rgba(255, 50, 50, 0.7)",
                    maxRadius: 20,
                    duration: 0.5,
                    timer: 0,
                    active: true,
                    gp: gamePanel, // Store reference to GamePanel
                    update: function() {
                        // Use the stored gp reference
                        this.timer += this.gp.deltaTime;
                        this.radius = this.maxRadius * (this.timer / this.duration);
                        this.active = this.timer < this.duration;
                        return this.active;
                    },
                    draw: function(ctx) {
                        const alpha = 1 - this.timer / this.duration;
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = this.color;
                        ctx.beginPath();
                        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.globalAlpha = 1.0;
                    }
                });
            }
        }
        
        // Check if animation is complete
        if (this.dyingTimer >= this.dyingDuration) {
            console.log("BOSS DEFEATED! Death animation complete");
            
            // Give rewards
            if (this.dropsLoot) {
                this.giveRewards();
            }
            
            console.log("BOSS DEFEATED! Setting game state to win state");
            console.log("Current game state:", this.gp.gameState);
            console.log("Win state value:", this.gp.winState);
            
            // Set win state manually if it's not defined
            if (typeof this.gp.winState === 'undefined') {
                console.log("Win state not defined! Using value 5");
                this.gp.winState = 5;
            }
            
            // Set game state to win
            this.gp.gameState = this.gp.winState;
            
            console.log("Game state after setting:", this.gp.gameState);
            
            // Complete death sequence
            this.dying = false;
            this.alive = false;
        }
    }
}

class Projectile {
    constructor(x, y, velocityX, velocityY, gp, speed = 180) {
        this.x = x;
        this.y = y;
        this.baseSpeed = speed; // Speed in pixels per second (configurable)
        
        // Store normalized direction vector
        const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        this.directionX = velocityX / magnitude;
        this.directionY = velocityY / magnitude;
        this.gp = gp;
        this.active = true;

        this.image = new Image();
        this.image.src = './res/monster/Projectile.png';

        this.lifetime = 8; // Lifetime in seconds
        this.age = 0; // Time elapsed since creation
        
        // Add trail particles for visual effect
        this.trail = [];
        this.trailTimer = 0;
        this.trailInterval = 0.03;
        this.trailMaxParticles = 10;
    }

    update() {
        // Update position using deltaTime for frame-rate independence
        const moveDistance = this.baseSpeed * this.gp.deltaTime;
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;

        // Update age and trail
        this.age += this.gp.deltaTime;
        this.updateTrail();

        if (this.age >= this.lifetime) {
            this.active = false;
            return;
        }

        // Check collision with player
        const player = this.gp.player;
        const playerArea = {
            x: player.x + player.solidArea.x,
            y: player.y + player.solidArea.y,
            width: player.solidArea.width,
            height: player.solidArea.height,
        };

        const projectileArea = {
            x: this.x,
            y: this.y,
            width: 16,
            height: 16,
        };

        if (this.rectIntersect(playerArea, projectileArea)) {
            if (!player.invincible) {
                // Calculate damage with defense reduction
                const incomingDamage = 1; // Default projectile damage
                const defenseReduction = Math.min(player.defense * 0.5, 0.9);
                const finalDamage = Math.max(Math.ceil(incomingDamage * (1 - defenseReduction)), 1);
                
                player.life -= finalDamage;
                player.invincible = true;

                if (player.life <= 0) {
                    this.gp.gameState = this.gp.gameOverState;
                }
            }
            this.active = false;
        }

        // Deactivate if out of bounds
        if (
            this.x < 0 || this.x > (this.gp.screenWidth * 1.5) ||
            this.y < 0 || this.y > (this.gp.screenHeight * 1.5)
        ) {
            this.active = false;
        }
    }
    
    updateTrail() {
        // Update existing trail particles
        for (let i = this.trail.length - 1; i >= 0; i--) {
            const particle = this.trail[i];
            particle.age += this.gp.deltaTime;
            
            if (particle.age >= particle.lifetime) {
                this.trail.splice(i, 1);
            }
        }
        
        // Add new trail particle
        this.trailTimer += this.gp.deltaTime;
        if (this.trailTimer >= this.trailInterval) {
            this.trailTimer = 0;
            
            if (this.trail.length < this.trailMaxParticles) {
                this.trail.push({
                    x: this.x + 8,
                    y: this.y + 8,
                    radius: 8,
                    age: 0,
                    lifetime: 0.3,
                    color: 'rgba(255, 50, 50, 0.7)'
                });
            }
        }
    }

    draw(ctx) {
        // Draw trail first (behind projectile)
        this.drawTrail(ctx);
        
        // Draw the projectile image
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, 16, 16);
        }
    }
    
    drawTrail(ctx) {
        for (const particle of this.trail) {
            const opacity = 1 - (particle.age / particle.lifetime);
            const radius = particle.radius * (1 - (particle.age / particle.lifetime) * 0.5);
            
            ctx.globalAlpha = opacity;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
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