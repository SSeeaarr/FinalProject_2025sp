import Monster from './Monster.js';

export default class MON_Bull extends Monster {
    constructor(gp) {
        super(gp);
        
        this.canBeKnockedBack = false;
        this.name = "Bull";
        this.baseSpeed = 75; // pixels per second
        this.maxLife = 12;
        this.life = this.maxLife;
        this.damage = 6; //idk why but this gets divided by 2 in the game, so it actually does 3 damage technically
        this.scale = 3.0;
        // Set movement type to random with custom timing
        this.movementType = 'chase';
        

        this.spriteCounter = 0;
        this.currentFrame = 0;
        this.totalFrames = 10;
        
        this.frames = [];
        this.loadImages();

        // Invincibility settings
        this.invincibleDuration = 0.5;
        this.invincibleTimer = 0;

        // Dying properties
        this.dyingDuration = 0.5; // Can be customized per monster type
        this.flashCount = 5;

        // Rewards
        this.exp = 2;
        this.coins = 1;

        // Charge attack properties
        this.isCharging = false;
        this.chargeCooldown = 2.0; // seconds between charges
        this.chargeCooldownTimer = 0; // <-- Separate cooldown timer
        this.chargeTimer = 0;
        this.chargeDuration = 0.7; // seconds charging
        this.chargeSpeed = 400; // pixels per second during charge
        this.chargeDirection = { x: 0, y: 0 };

        // Health bar properties
        this.showHealthBar = false;
        this.healthBarTimer = 0;
    }

    loadImages() {
        // Left attack frames (00-04)
        this.leftAttackFrames = [
            { img: this.loadFrame('00') },
            { img: this.loadFrame('01') },
            { img: this.loadFrame('02') },
            { img: this.loadFrame('03') },
            { img: this.loadFrame('04') },
        ];
        // Right attack frames (05-09)
        this.rightAttackFrames = [
            { img: this.loadFrame('05') },
            { img: this.loadFrame('06') },
            { img: this.loadFrame('07') },
            { img: this.loadFrame('08') },
            { img: this.loadFrame('09') },
        ];
        // Default to left frames
        this.frames = this.leftAttackFrames;
        this.currentImage = this.frames[0].img;
    }

    loadFrame(frameName) {
        const img = new Image();
        img.src = `./res/monster/sprite_bull${frameName}.png`;
        return img;
    }

    update() {
        if (this.dying) {
            super.dyingAnimation();
            return;
        }

        if (this.alive) {
            // Handle invincibility
            if (this.invincible) {
                this.invincibleTimer += this.gp.deltaTime;
                if (this.invincibleTimer >= this.invincibleDuration) {
                    this.invincible = false;
                    this.invincibleTimer = 0;
                }
            }

            // Calculate direction to player
            const dx = this.gp.player.x - this.x;
            const dy = this.gp.player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Always face the player (choose frames)
            if (dx < 0) {
                this.frames = this.leftAttackFrames;
            } else {
                this.frames = this.rightAttackFrames;
            }

            // Charging logic
            if (this.isCharging) {
                this.chargeTimer += this.gp.deltaTime;
                // Predict next position
                const nextX = this.x + this.chargeDirection.x * this.chargeSpeed * this.gp.deltaTime;
                const nextY = this.y + this.chargeDirection.y * this.chargeSpeed * this.gp.deltaTime;
                // Check collision
                if (!this.checkCollision(nextX, nextY)) {
                    this.x = nextX;
                    this.y = nextY;
                } else {
                    // Stop charging if hit wall
                    this.isCharging = false;
                    this.chargeTimer = 0;
                    this.chargeCooldownTimer = this.chargeCooldown;
                }

                if (this.chargeTimer >= this.chargeDuration) {
                    this.isCharging = false;
                    this.chargeTimer = 0;
                    this.chargeCooldownTimer = this.chargeCooldown;
                }
            } else {
                // Handle cooldown timer
                if (this.chargeCooldownTimer > 0) {
                    this.chargeCooldownTimer -= this.gp.deltaTime;
                    if (this.chargeCooldownTimer < 0) this.chargeCooldownTimer = 0;
                }
                // If player is close enough and cooldown is over, start charging
                if (distance < 200 && this.chargeCooldownTimer <= 0) {
                    this.isCharging = true;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    this.chargeDirection = len > 0 ? { x: dx / len, y: dy / len } : { x: 0, y: 0 };
                } else if (!this.isCharging) {
                    // Normal chase movement with collision check
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const moveX = len > 0 ? (dx / len) * this.baseSpeed * this.gp.deltaTime : 0;
                    const moveY = len > 0 ? (dy / len) * this.baseSpeed * this.gp.deltaTime : 0;
                    const nextX = this.x + moveX;
                    const nextY = this.y + moveY;
                    if (!this.check) {
                        this.x = nextX;
                        this.y = nextY;
                    }
                }
            }

            // Update animation
            this.spriteCounter += this.gp.deltaTime;
            if (this.spriteCounter > 0.1) {
                this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                this.currentImage = this.frames[this.currentFrame].img;
                this.spriteCounter = 0;
            }

            // Health bar visibility timer
            if (this.showHealthBar) {
                this.healthBarTimer -= this.gp.deltaTime;
                if (this.healthBarTimer <= 0) {
                    this.showHealthBar = false;
                }
            }
        }
    }

    dyingAnimation() {
        // Increment dying timer using deltaTime
        this.dyingTimer += this.gp.deltaTime;
        
        const flashCount = 5;
        const totalDuration = 1.0; // Total dying animation duration in seconds
        const flashDuration = totalDuration / flashCount; // Duration of each flash in seconds

        // Calculate which flash cycle we're in based on deltaTime
        const currentFlash = Math.floor(this.dyingTimer / flashDuration);
        
        // Set visibility based on current flash cycle
        this.currentAlpha = currentFlash % 2 === 0 ? 1 : 0;

        // Continue animation frames during death
        const FRAME_DURATION = 0.19;
        this.spriteCounter += this.gp.deltaTime;
        while (this.spriteCounter >= FRAME_DURATION) {
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
            this.currentImage = this.frames[this.currentFrame].img;
            this.spriteCounter -= FRAME_DURATION;
        }

        // Check if animation is complete (after specified duration)
        if (this.dyingTimer >= totalDuration) {
            if (this.dropsLoot) {
                this.giveRewards();
            }
            this.dying = false;
            this.alive = false;
        }
    }

    draw(ctx) {
        if (this.currentImage && this.currentImage.complete) {
            // Set transparency based on state
            if (this.invincible && !this.dying) {
                ctx.globalAlpha = 0.5; // Half transparency during invincibility
            } else if (this.dying) {
                ctx.globalAlpha = this.currentAlpha; // Use death animation alpha
            } else {
                ctx.globalAlpha = 1.0; // Full visibility normally
            }

            // Calculate scaled dimensions
            const scaledWidth = this.gp.tileSize * this.scale;
            const scaledHeight = this.gp.tileSize * this.scale;
            
            // Adjust position to keep the monster centered
            const offsetX = (scaledWidth - this.gp.tileSize) / 2;
            const offsetY = (scaledHeight - this.gp.tileSize) / 2;

            // Draw the current frame with scale applied
            ctx.drawImage(
                this.currentImage,
                this.x - offsetX,
                this.y - offsetY,
                scaledWidth,
                scaledHeight
            );

            // Reset transparency
            ctx.globalAlpha = 1.0;

            // Draw health bar if needed and not dying
            if (this.showHealthBar && !this.dying && this.alive) {
                this.drawHealthBar(ctx);
            }
        }
    }

    drawHealthBar(ctx) {
        const barWidth = 40;
        const barHeight = 6;

        // Calculate scaled dimensions and offsets (same as draw)
        const scaledWidth = this.gp.tileSize * this.scale;
        const offsetX = (scaledWidth - this.gp.tileSize) / 2;
        const drawX = this.x - offsetX;

        // Position the health bar centered above the Bull
        const barX = drawX + (scaledWidth - barWidth) / 2;
        const barY = this.y - 18; // 18 pixels above the Bull's y (adjust as needed)

        // Draw background bar
        ctx.fillStyle = "darkred";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Draw health amount
        const healthWidth = (this.life / this.maxLife) * barWidth;
        ctx.fillStyle = "lime";
        ctx.fillRect(barX, barY, healthWidth, barHeight);
    }

    takeDamage(amount) {
        if (!this.invincible) {
            this.life -= amount;
            this.invincible = true;

            // Show health bar and reset timer
            this.showHealthBar = true;
            this.healthBarTimer = 1.0; // show for 1 second

            if (this.life <= 0) {
                this.dying = true;
            }
        }
    }


}