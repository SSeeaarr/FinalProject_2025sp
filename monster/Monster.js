export default class Monster {
    constructor(gp) {
        this.gp = gp;
        this.x = 0;
        this.y = 0;
        this.speed = 1;
        this.maxLife = 4;
        this.life = this.maxLife;
        this.type = 2; // 2 is monster type
        this.alive = true;
        this.dying = false;
        this.direction = "down";
        this.scale = 1.0; // Default scale (1.0 = original size)
        this.solidArea = {
            x: 3,
            y: 18,
            width: 42,
            height: 30
        };
        this.solidAreaDefaultX = this.solidArea.x;
        this.solidAreaDefaultY = this.solidArea.y;
        this.actionLockCounter = 0;
        this.invincible = false;
        this.invincibleCounter = 0;
        this.dyingCounter = 0;

        // Add health bar properties
        this.showHealthBar = false;
        this.healthBarCounter = 0;
        this.healthBarDuration = 600; // Show health bar for 10 seconds

        this.baseSpeed = 80; // pixels per second (slower than NPC)
        this.moving = true; // Monsters are always moving by default
        this.damage = 1;

        // Add reward properties
        this.exp = 1;       // Default XP reward
        this.coins = 1;     // Default coin reward
        this.dropsLoot = true;  // Flag to control if monster drops rewards

        // Add knockback properties
        this.canBeKnockedBack = true;  // Default value
        this.knockbackDistance = 30;    // Default knockback distance in pixels
        this.knockbackDuration = 0.2;   // Default knockback duration in seconds
        this.knockbackTimer = 0;
        this.isKnockedBack = false;
        this.knockbackDirection = { x: 0, y: 0 };

        // Movement behavior settings
        this.movementType = 'random'; // 'random' or 'chase'
        this.actionLockDuration = 120; // frames until next direction change for random movement

        // Movement properties
        this.directionTimer = 0;
        this.directionChangeInterval = 2; // seconds between direction changes

        // Death animation properties
        this.dyingTimer = 0;
        this.dyingDuration = 0.5; // Default 0.5 second death animation
        this.currentAlpha = 1;
        this.flashCount = 5;
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

    update() {
        if (this.dying) {
            this.dyingAnimation();
            return;
        }

        // Handle knockback movement
        if (this.isKnockedBack) {
            this.knockbackTimer += this.gp.deltaTime;
            
            if (this.knockbackTimer < this.knockbackDuration) {
                // Calculate knockback movement
                const progress = 1 - (this.knockbackTimer / this.knockbackDuration); // Easing
                const knockbackSpeed = this.knockbackDistance * progress;
                
                const moveX = this.knockbackDirection.x * knockbackSpeed * this.gp.deltaTime;
                const moveY = this.knockbackDirection.y * knockbackSpeed * this.gp.deltaTime;

                // Store previous position
                const prevX = this.x;
                const prevY = this.y;

                // Apply knockback movement with collision check
                this.x += moveX;
                this.collisionOn = false;
                this.gp.cChecker.checkTile(this);
                if (this.collisionOn) this.x = prevX;

                this.y += moveY;
                this.collisionOn = false;
                this.gp.cChecker.checkTile(this);
                if (this.collisionOn) this.y = prevY;
            } else {
                this.isKnockedBack = false;
            }
            return; // Skip normal movement while being knocked back
        }

        if (this.invincible) {
            this.invincibleCounter++;
            this.showHealthBar = true;
            this.healthBarCounter = 0;
            if (this.invincibleCounter > 20) {
                this.invincible = false;
                this.invincibleCounter = 0;
            }
        }

        // Update health bar visibility
        if (this.showHealthBar) {
            this.healthBarCounter++;
            if (this.healthBarCounter > this.healthBarDuration) {
                this.showHealthBar = false;
                this.healthBarCounter = 0;
            }
        }

        if (this.alive && !this.dying && !this.isKnockedBack) {
            if (this.movementType === 'chase') {
                this.moveTowardPlayer(this.gp.deltaTime);
            } else {
                this.moveRandomly(this.gp.deltaTime);
            }
        }
    }

    setAction() {
        this.actionLockCounter++;
        if (this.actionLockCounter === 120) {
            const random = Math.floor(Math.random() * 100) + 1;
            if (random <= 25) this.direction = "up";
            else if (random <= 50) this.direction = "down";
            else if (random <= 75) this.direction = "left";
            else this.direction = "right";
            this.actionLockCounter = 0;
        }
    }

    checkCollision() {
        this.collisionOn = false;
        this.gp.cChecker.checkTile(this);
    }

    // Add a method to handle taking damage
    takeDamage(damage) {
        if (!this.invincible && !this.dying) {
            this.life -= damage;
            this.invincible = true;
            this.showHealthBar = true;
            this.healthBarCounter = 0;

            // Apply knockback if the monster can be knocked back
            if (this.canBeKnockedBack) {
                this.applyKnockback();
            }

            if (this.life <= 0) {
                this.dying = true;
                this.dyingCounter = 0;
            }
        }
    }

    applyKnockback() {
        // Get direction from player to monster for knockback
        const dx = this.x - this.gp.player.x;
        const dy = this.y - this.gp.player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalize direction
        if (distance > 0) {
            this.knockbackDirection = {
                x: dx / distance,
                y: dy / distance
            };
            this.isKnockedBack = true;
            this.knockbackTimer = 0;
        }
    }

    moveTowardTarget(targetX, targetY, speed, deltaTime) {
        // Calculate direction vector toward the target
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const moveX = (dx / distance) * speed * deltaTime;
            const moveY = (dy / distance) * speed * deltaTime;

            // Update position with collision checks
            const prevX = this.x;
            const prevY = this.y;

            this.x += moveX;
            this.collisionOn = false;
            this.gp.cChecker.checkTile(this);
            if (this.collisionOn) this.x = prevX;

            this.y += moveY;
            this.collisionOn = false;
            this.gp.cChecker.checkTile(this);
            if (this.collisionOn) this.y = prevY;
        }
    }

    moveTowardPlayer(deltaTime) {
        const actualSpeed = this.baseSpeed * deltaTime;
        const dx = this.gp.player.x - this.x;
        const dy = this.gp.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Changed from this.gp.tileSize to this.gp.tileSize * 0.5
        // This allows the monster to get closer to the player
        if (distance > this.gp.tileSize * 0.5) {
            const moveX = (dx / distance) * actualSpeed;
            const moveY = (dy / distance) * actualSpeed;

            const prevX = this.x;
            const prevY = this.y;

            this.x += moveX;
            this.collisionOn = false;
            this.gp.cChecker.checkTile(this);
            if (this.collisionOn) this.x = prevX;

            this.y += moveY;
            this.collisionOn = false;
            this.gp.cChecker.checkTile(this);
            if (this.collisionOn) this.y = prevY;
        }

        this.checkPlayerCollision();
    }

    moveRandomly(deltaTime) {
        // Update direction change timer
        this.directionTimer += deltaTime;
        
        // Change direction every few seconds
        if (this.directionTimer >= this.directionChangeInterval) {
            const random = Math.floor(Math.random() * 4);
            this.direction = ["up", "down", "left", "right"][random];
            this.directionTimer = 0;
        }

        // Calculate movement distance based on deltaTime
        const moveDistance = this.baseSpeed * deltaTime;
        const prevX = this.x;
        const prevY = this.y;

        // Move in current direction
        switch(this.direction) {
            case "up": this.y -= moveDistance; break;
            case "down": this.y += moveDistance; break;
            case "left": this.x -= moveDistance; break;
            case "right": this.x += moveDistance; break;
        }

        // Check collision and revert if needed
        this.collisionOn = false;
        this.gp.cChecker.checkTile(this);
        if (this.collisionOn) {
            this.x = prevX;
            this.y = prevY;
            this.directionTimer = this.directionChangeInterval; // Force direction change
        }

        // After movement is complete, check for player collision
        this.checkPlayerCollision();
    }

    dyingAnimation() {
        // Increment dying timer using deltaTime
        this.dyingTimer += this.gp.deltaTime;
        
        const flashDuration = this.dyingDuration / this.flashCount;
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

        // Check if animation is complete
        if (this.dyingTimer >= this.dyingDuration) {
            if (this.dropsLoot) {
                this.giveRewards();
            }
            this.dying = false;
            this.alive = false;
        }
    }

    drawHealthBar(ctx) {
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

    // Modify the giveRewards method
    giveRewards() {
        // Add experience to player
        this.gp.player.exp += this.exp;
        this.gp.ui.showMessage(`Gained ${this.exp} EXP!`);
        
        // Check for level up
        if (this.gp.player.exp >= this.gp.player.nextLevelExp) {
            // Level up!
            this.gp.player.level++;
            this.gp.player.exp = 0;
            this.gp.player.nextLevelExp = Math.floor(this.gp.player.nextLevelExp * 1.5);
            
            // Stat increases
            this.gp.player.maxLife += 1;
            this.gp.player.life = this.gp.player.maxLife;
            this.gp.player.strength += 1;
            
            // Show multiple messages for level up
            this.gp.ui.showMessage(`LEVEL UP! You are now level ${this.gp.player.level}!`);
            
            // Add a small delay before showing stat increases so messages don't overlap
            setTimeout(() => {
                this.gp.ui.showMessage(`Max HP increased to ${this.gp.player.maxLife}!`);
            }, 1000);
            
            setTimeout(() => {
                this.gp.ui.showMessage(`Strength increased to ${this.gp.player.strength}!`);
            }, 2000);
        }

        // Add coins to player
        this.gp.player.coin += this.coins;
        this.gp.ui.showMessage(`Found ${this.coins} coins!`);

        // Prevent multiple rewards
        this.dropsLoot = false;
    }

    checkPlayerCollision() {
        if (!this.alive || this.dying) return;
        if (this.damage <= 0) return; // Skip if monster does no damage

        // Create hitboxes for collision detection
        const monsterArea = {
            x: this.x + this.solidArea.x,
            y: this.y + this.solidArea.y,
            width: this.solidArea.width,
            height: this.solidArea.height
        };
        
        const player = this.gp.player;
        const playerArea = {
            x: player.x + player.solidArea.x,
            y: player.y + player.solidArea.y,
            width: player.solidArea.width,
            height: player.solidArea.height
        };
        
        // Check for collision
        if (this.rectIntersect(monsterArea, playerArea)) {
            if (!player.invincible) {
                console.log(`Monster collision detected! Monster: ${this.name}, Damage: ${this.damage}`);
                // Find this monster's index
                const monsterIndex = this.gp.monster[this.gp.currentMap].indexOf(this);
                if (monsterIndex !== -1) {
                    player.contactMonster(monsterIndex);
                }
            }
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