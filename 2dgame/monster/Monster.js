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
    }

    draw(ctx) {
        let image = null;
        switch(this.direction) {
            case "up":
                image = this.spriteNum === 1 ? this.up1 : this.up2;
                break;
            case "down":
                image = this.spriteNum === 1 ? this.down1 : this.down2;
                break;
            case "left":
                image = this.spriteNum === 1 ? this.left1 : this.left2;
                break;
            case "right":
                image = this.spriteNum === 1 ? this.right1 : this.right2;
                break;
        }
        
        if (image && image instanceof Image) {
            // Flash when hit
            if (this.invincible) {
                ctx.globalAlpha = 0.5;
            }
            
            // Fade out when dying
            if (this.dying) {
                ctx.globalAlpha = 1 - (this.dyingCounter / 30);
            }

            ctx.drawImage(image, this.x, this.y, this.gp.tileSize, this.gp.tileSize);
            
            // Reset alpha
            ctx.globalAlpha = 1;
        }

        // Draw health bar if visible
        if (this.showHealthBar) {
            const barWidth = 20;
            const barHeight = 3;
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

        // Reset any changed drawing states
        ctx.globalAlpha = 1;
    }

    update() {
        if (this.dying) {
            this.dyingCounter++;
            if (this.dyingCounter > 30) {
                this.alive = false;
            }
            return;
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

        // Update movement decision
        this.actionLockCounter += this.gp.deltaTime;
        
        if (this.actionLockCounter >= 2) { // Every 2 seconds
            // Choose new random direction
            const random = Math.floor(Math.random() * 4);
            this.direction = ["up", "down", "left", "right"][random];
            this.actionLockCounter = 0;
        }

        // Movement with delta time
        if (this.moving) {
            const moveDistance = this.baseSpeed * this.gp.deltaTime;

            // Reset collision flag
            this.collisionOn = false;
            
            // Check tile collision
            this.gp.cChecker.checkTile(this);
            
            // Store previous position
            const prevX = this.x;
            const prevY = this.y;
            
            // Move if no collision
            if (!this.collisionOn) {
                switch(this.direction) {
                    case "up": this.y -= moveDistance; break;
                    case "down": this.y += moveDistance; break;
                    case "left": this.x -= moveDistance; break;
                    case "right": this.x += moveDistance; break;
                }
            }
            
            // Check collision after moving
            this.collisionOn = false;
            this.gp.cChecker.checkTile(this);
            
            // If collision occurred, revert position and change direction
            if (this.collisionOn) {
                this.x = prevX;
                this.y = prevY;
                
                // Choose new random direction
                let newDirection;
                do {
                    const random = Math.floor(Math.random() * 4);
                    newDirection = ["up", "down", "left", "right"][random];
                } while (newDirection === this.direction);
                this.direction = newDirection;
            }

            // Update animation with delta time
            this.spriteCounter += this.gp.deltaTime;
            if (this.spriteCounter > 0.2) { // Change sprite every 0.2 seconds
                this.spriteNum = this.spriteNum === 1 ? 2 : 1;
                this.spriteCounter = 0;
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

            if (this.life <= 0) {
                this.dying = true;
                this.alive = false;
            }
        }
    }
}