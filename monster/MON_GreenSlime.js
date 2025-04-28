import Monster from './Monster.js';

export default class MON_GreenSlime extends Monster {
    constructor(gp) {
        super(gp);
        
        this.name = "Green Slime";
        this.speed = 1;
        this.maxLife = 4;
        this.life = this.maxLife;
        
        this.spriteCounter = 0;
        this.currentFrame = 0;
        this.totalFrames = 12; // Total number of unique frames
        
        // Animation sequence array
        this.frames = [];
        this.loadImages();

        // Add invincibility animation settings
        this.invincibleDuration = 0.5; // Invincibility duration in seconds
        this.invincibleTimer = 0;

        // Add fleeing properties
        this.isFleeing = false;
        this.fleeSpeed = 1; // Faster than normal speed when fleeing
        this.fleeDuration = 2; // Flee duration in seconds
        this.fleeTimer = 0;

        // Add dying properties
        this.dyingDuration = 2; // Total dying animation duration in seconds
        this.dyingTimer = 0;
    }

    loadImages() {
        // Load all frames in sequence
        this.frames = [
            { img: this.loadFrame('Start_End') },  // Frame 0
            { img: this.loadFrame('2_12') },       // Frame 1
            { img: this.loadFrame('3_11') },       // Frame 2
            { img: this.loadFrame('4_10') },       // Frame 3
            { img: this.loadFrame('5') },          // Frame 4
            { img: this.loadFrame('6') },          // Frame 5
            { img: this.loadFrame('7') },          // Frame 6
            { img: this.loadFrame('8') },          // Frame 7
            { img: this.loadFrame('9') },          // Frame 8
            { img: this.loadFrame('4_10') },       // Frame 9
            { img: this.loadFrame('3_11') },       // Frame 10
            { img: this.loadFrame('2_12') },       // Frame 11
            { img: this.loadFrame('Start_End') }   // Frame 12
        ];

        // Set initial frame
        this.currentImage = this.frames[0].img;
    }

    loadFrame(frameName) {
        const img = new Image();
        img.src = `./res/monster/Slime_${frameName}.png`;
        return img;
    }

    update() {
        // Call parent class update for basic monster behavior
        super.update();

        // Store original position for collision checking
        const prevX = this.x;
        const prevY = this.y;

        // Handle invincibility and fleeing
        if (this.invincible) {
            this.invincibleTimer += this.gp.deltaTime;
            
            // Move away from player while invincible
            if (this.isFleeing) {
                // Update flee timer
                this.fleeTimer += this.gp.deltaTime;
                if (this.fleeTimer >= this.fleeDuration) {
                    this.isFleeing = false;
                    this.fleeTimer = 0;
                }

                // Calculate direction away from player
                const dx = this.x - this.gp.player.x;
                const dy = this.y - this.gp.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance > 0) {
                    // Normalize and apply flee speed
                    const moveX = (dx / distance) * this.fleeSpeed;
                    const moveY = (dy / distance) * this.fleeSpeed;
                    
                    // Try to move away with collision checks
                    this.x += moveX;
                    // Check collisions after X movement
                    if (this.gp.cChecker.checkTile(this) || 
                        this.gp.cChecker.checkEntity(this, this.gp.monster) !== 999 ||
                        this.gp.cChecker.checkEntity(this, this.gp.npc) !== 999) {
                        this.x = prevX;
                    }

                    this.y += moveY;
                    // Check collisions after Y movement
                    if (this.gp.cChecker.checkTile(this) || 
                        this.gp.cChecker.checkEntity(this, this.gp.monster) !== 999 ||
                        this.gp.cChecker.checkEntity(this, this.gp.npc) !== 999) {
                        this.y = prevY;
                    }
                }
            }

            // Check if invincibility is over
            if (this.invincibleTimer >= this.invincibleDuration) {
                this.invincible = false;
                this.invincibleTimer = 0;
                this.isFleeing = false;
            }
        }

        // Only update animation if not dying
        if (!this.dying) {
            // Store previous position
            const prevX = this.x;
            const prevY = this.y;

            // Update position
            this.spriteCounter += this.gp.deltaTime;
            if (this.spriteCounter > 0.19) {
                this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                this.currentImage = this.frames[this.currentFrame].img;
                this.spriteCounter = 0;

                // Check collisions with other entities
                if (this.gp.cChecker.checkEntity(this, this.gp.monster) !== 999 ||
                    this.gp.cChecker.checkEntity(this, this.gp.npc) !== 999) {
                    // Revert position if collision occurs
                    this.x = prevX;
                    this.y = prevY;
                }
            }
        } else {
            this.dyingAnimation();
        }
    }

    dyingAnimation() {
        this.dyingTimer += this.gp.deltaTime;
        const flashCount = 5;
        const flashDuration = this.dyingDuration / flashCount;

        // Calculate which flash cycle we're in
        const currentFlash = Math.floor(this.dyingTimer / flashDuration);
        
        // Set visibility based on current flash cycle
        this.currentAlpha = currentFlash % 2 === 0 ? 1 : 0;

        // Check if animation is complete (after 5 flashes)
        if (currentFlash >= flashCount) {
            this.currentAlpha = 1; // Ensure visible for final state
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
            this.isFleeing = true;
            this.fleeTimer = 0;
            
            if (this.life <= 0) {
                this.dying = true;
            }
        }
    }
}