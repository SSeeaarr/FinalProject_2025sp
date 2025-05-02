import Monster from './Monster.js';

export default class MON_ShootingSlime extends Monster {
    constructor(gp) {
        super(gp);

        // Make shooting slime immune to knockback
        this.canBeKnockedBack = false;

        this.name = "Shooting Slime";
        this.baseSpeed = 50; // Speed in pixels per second
        this.maxLife = 6;
        this.life = this.maxLife;
        
        // Set movement type to chase player
        this.movementType = 'chase';
        
        // Projectile properties
        this.projectiles = [];
        this.shootCooldown = 1.5;
        this.shootTimer = 0;
        this.projectileCount = 3;
        this.projectileSpread = Math.PI / 4;

        // Animation properties
        this.spriteCounter = 0;
        this.currentFrame = 0;
        this.frames = [];
        this.loadImages();

        // Set custom rewards
        this.exp = 4;
        this.coins = 3;

        // Death animation properties
        this.dyingDuration = 0.5;
        this.flashCount = 5;
    }

    loadImages() {
        // Load all animation frames
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

        // Set the initial frame
        this.currentImage = this.frames[0].img;
    }

    loadFrame(frameName) {
        const img = new Image();
        img.src = `./res/monster/Slime_${frameName}.png`;
        return img;
    }

    update() {
        if (this.dying) {
            super.dyingAnimation();
            this.projectiles = []; // Clear projectiles when dying
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

            // Use parent class movement
            super.update();

            // Handle shooting projectiles
            this.shootTimer += this.gp.deltaTime;
            if (this.shootTimer >= this.shootCooldown) {
                this.shootProjectile();
                this.shootTimer = 0;
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

    shootProjectile() {
        const angleStep = this.projectileSpread / (this.projectileCount - 1);
        const baseAngle = Math.atan2(
            this.gp.player.y - this.y,
            this.gp.player.x - this.x
        );

        for (let i = 0; i < this.projectileCount; i++) {
            const angle = baseAngle - this.projectileSpread / 2 + i * angleStep;
            // Just pass direction vector components instead of velocities
            const directionX = Math.cos(angle);
            const directionY = Math.sin(angle);

            this.projectiles.push(new Projectile(this.x, this.y, directionX, directionY, this.gp));
        }
    }

    draw(ctx) {
        // Don't draw if completely dead
        if (!this.alive && !this.dying) return;

        // Draw the slime with fade effect when dying
        if (this.currentImage && this.currentImage.complete) {
            if (this.dying) {
                // Fade out gradually during death animation
                ctx.globalAlpha = Math.max(0, 1 - this.dyingCounter);
            }
            
            ctx.drawImage(
                this.currentImage,
                this.x,
                this.y,
                this.gp.tileSize,
                this.gp.tileSize
            );
            
            ctx.globalAlpha = 1.0; // Reset alpha
        }

        // Only draw projectiles if still alive
        if (this.alive) {
            this.projectiles.forEach(projectile => projectile.draw(ctx));
        }

        // Draw health bar if visible and not dying
        if (this.showHealthBar && !this.dying) {
            const barWidth = 40;
            const barHeight = 6;
            const barX = this.x + (this.gp.tileSize - barWidth) / 2;
            const barY = this.y - 10;

            ctx.fillStyle = "darkred";
            ctx.fillRect(barX, barY, barWidth, barHeight);

            const healthWidth = (this.life / this.maxLife) * barWidth;
            ctx.fillStyle = "lime";
            ctx.fillRect(barX, barY, healthWidth, barHeight);
        }
    }
}

class Projectile {
    constructor(x, y, velocityX, velocityY, gp) {
        this.x = x;
        this.y = y;
        this.baseSpeed = 180; // Speed in pixels per second
        // Store normalized direction vector instead of velocity
        const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
        this.directionX = velocityX / magnitude;
        this.directionY = velocityY / magnitude;
        this.gp = gp;
        this.active = true;

        this.image = new Image();
        this.image.src = './res/monster/Projectile.png';

        this.lifetime = 3; // Lifetime in seconds
        this.age = 0; // Time elapsed since creation
    }

    update() {
        // Update position using deltaTime for frame-rate independence
        const moveDistance = this.baseSpeed * this.gp.deltaTime;
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;

        // Rest of the update logic remains the same
        this.age += this.gp.deltaTime;

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
            this.x < 0 || this.x > this.gp.screenWidth ||
            this.y < 0 || this.y > this.gp.screenHeight
        ) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, 16, 16);
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