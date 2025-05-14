export default class NPC_OldMan {
    constructor(gp) {
        this.gp = gp;
        
        // Position and movement
        this.x = 0;
        this.y = 0;
        this.speed = 1;
        this.baseSpeed = 120; // pixels per second
        this.direction = "down";
        this.moving = false;
        this.actionLockCounter = 0;
        
        // Collision - properly sized and positioned
        this.solidArea = {
            x: 8,      // Small offset from left edge
            y: 16,     // Positioned closer to feet
            width: 16, // Narrower than full sprite
            height: 16 // Shorter, focused on lower body
        };
        this.solidAreaDefaultX = this.solidArea.x;
        this.solidAreaDefaultY = this.solidArea.y;
        this.collision = true; // Keep collision enabled
        
        // Character attributes
        this.name = "Old Man";
        this.dialogues = [];
        this.dialogueIndex = 0;
        
        // Animation
        this.spriteCounter = 0;
        this.spriteNum = 1;
        
        this.getImages();
        this.setDialogues();
    }

    getImages() {
        // Load actual NPC images
        this.up1 = new Image();
        this.up1.src = "./res/npc/Oldman_Back_1.png";
        this.up2 = new Image();
        this.up2.src = "./res/npc/Oldman_Back_2.png";
        this.down1 = new Image();
        this.down1.src = "./res/npc/Oldman_Front_1.png";
        this.down2 = new Image();
        this.down2.src = "./res/npc/Oldman_Front_2.png";
        this.left1 = new Image();
        this.left1.src = "./res/npc/Oldman_Left_1.png";
        this.left2 = new Image();
        this.left2.src = "./res/npc/Oldman_Left_2.png";
        this.right1 = new Image();
        this.right1.src = "./res/npc/Oldman_Right_1.png";
        this.right2 = new Image();
        this.right2.src = "./res/npc/Oldman_Right_2.png";
    }

    setDialogues() {
        this.dialogues = [
            "Hello, young adventurer!",
            "This is a dangerous world...",
            "Be careful out there!",
            "Press ENTER to continue..."
        ];
    }

    speak() {
        if (this.dialogues.length > 0) {
            this.gp.ui.currentDialogue = this.dialogues[this.dialogueIndex];
            
            this.dialogueIndex++;
            
            // If we've reached the end of dialogues, reset and return true to indicate completion
            if (this.dialogueIndex >= this.dialogues.length) {
                this.dialogueIndex = 0;
                this.gp.gameState = this.gp.playState;
                return true; // Dialogue ended
            }
        }
        return false; // Dialogue continuing
    }

    update() {
        // Update movement decision
        this.actionLockCounter += this.gp.deltaTime;
        
        if (this.actionLockCounter >= 2) { // Every 2 seconds
            // 20% chance to start moving if stopped, or stop if moving
            if (Math.random() < 0.2) {
                this.moving = !this.moving;
            }
            
            // If moving, choose a new random direction
            if (this.moving) {
                const random = Math.floor(Math.random() * 4);
                this.direction = ["up", "down", "left", "right"][random];
            }
            
            this.actionLockCounter = 0;
        }

        // Only move if in moving state
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

            // Update animation
            this.spriteCounter += this.gp.deltaTime;
            if (this.spriteCounter > 0.2) { // Change sprite every 0.2 seconds
                this.spriteNum = this.spriteNum === 1 ? 2 : 1;
                this.spriteCounter = 0;
            }
        }
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

        if (image && image.complete) {
            ctx.drawImage(image, this.x, this.y, this.gp.tileSize, this.gp.tileSize);
        }
    }
}