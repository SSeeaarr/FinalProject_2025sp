import Monster from './Monster.js';

export default class MON_Bull extends Monster {
    constructor(gp) {
        super(gp);
        
        this.canBeKnockedBack = false;
        this.name = "Bull";
        this.baseSpeed = 150; // pixels per second
        this.maxLife = 2;
        this.life = this.maxLife;
        this.damage = 10;
        this.scale = 10.0;
        
        // Set movement type to random with custom timing
        this.movementType = 'chase';
        this.directionChangeInterval = 1.5; // Change direction every 1.5 seconds
        
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
    }

    loadImages() {
        // Load all frames in sequence
        this.frames = [
            { img: this.loadFrame('00') },  // Frame 0
            { img: this.loadFrame('01') },       // Frame 1
            { img: this.loadFrame('02') },       // Frame 2
            { img: this.loadFrame('03') },       // Frame 3
            { img: this.loadFrame('04') },          // Frame 4
            { img: this.loadFrame('05') },          // Frame 5
            { img: this.loadFrame('06') },          // Frame 6
            { img: this.loadFrame('07') },          // Frame 7
            { img: this.loadFrame('08') },          // Frame 8
            { img: this.loadFrame('09') },       // Frame 9
        ];

        // Set initial frame
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

            // Call parent class update for movement
            super.update();

            // Update animation
            this.spriteCounter += this.gp.deltaTime;
            if (this.spriteCounter > 0.1) {
                this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                this.currentImage = this.frames[this.currentFrame].img;
                this.spriteCounter = 0;
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

            // Draw the current frame
            ctx.drawImage(
                this.currentImage,
                this.x,
                this.y,
                this.gp.tileSize,
                this.gp.tileSize
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
        const barX = this.x + (this.gp.tileSize - barWidth) / 2;
        const barY = this.y - 10;

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
            
            if (this.life <= 0) {
                this.dying = true;
            }
        }
    }


}