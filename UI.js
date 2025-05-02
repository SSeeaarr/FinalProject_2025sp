export default class UI {
    constructor(gp) {
        this.gp = gp;
        this.fontSize = 32;
        this.fontFamily = 'Arial';
        this.currentDialogue = '';
        this.commandNum = 0;

        // Load heart images directly
        this.heartFull = new Image();
        this.heartHalf = new Image();
        this.heartEmpty = new Image();

        // Point to the res folder for heart images
        this.heartFull.src = './res/objects/FullHeart.png';
        this.heartHalf.src = './res/objects/HalfHeart.png';
        this.heartEmpty.src = './res/objects/EmptyHeart.png';

        // Add inventory cursor properties
        this.inventoryCursorX = 0;
        this.inventoryCursorY = 0;
        this.inventorySlotSelected = 0;
        this.itemDescriptionActive = false;

        // Add message display properties
        this.message = "";
        this.messageCounter = 0;
        this.messageOn = false;
        this.messageDuration = 2; // Show messages for 2 seconds

        // Add message log properties
        this.messageLog = [];
        this.maxLogMessages = 5; // Maximum number of messages to show in log
        this.logDisplayDuration = 8; // How long messages stay in the log (seconds)
        this.logVisible = true; // Whether log is visible (could add toggle)

        // Add message cooldown tracking
        this.messageCooldowns = {
            // Message types that should have cooldowns
            "lockMessage": 0,
            "combatMessage": 0,
            "npcMessage": 0
        };
        this.messageCooldownDuration = 3; // Seconds before the same type of message can appear again

        // Track the last messages of each type to avoid duplicates
        this.lastMessages = {
            "lockMessage": "",
            "combatMessage": "",
            "npcMessage": ""
        };
    }

    draw(ctx) {
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.fillStyle = 'white';

        if (this.gp.gameState === this.gp.playState) {
            this.drawPlayerLife(ctx);
            if (this.gp.player.showInventory) {
                this.drawInventory(ctx);
            }
        } else if (this.gp.gameState === this.gp.pauseState) {
            this.drawPlayerLife(ctx);
            this.drawPauseScreen(ctx);
            if (this.gp.player.showInventory) {
                this.drawInventory(ctx);
            }
        } else if (this.gp.gameState === this.gp.dialogueState) {
            this.drawPlayerLife(ctx);
            this.drawDialogueWindow(ctx);
        } else if (this.gp.gameState === this.gp.gameOverState) {
            this.drawGameOverScreen(ctx);
        }

        // Keep other UI elements (health, inventory, etc.)

        // Always draw message log (filtered by visibility)
        this.drawMessageLog(ctx);
    }

    drawPlayerLife(ctx) {
        let x = this.gp.tileSize / 2;
        let y = this.gp.tileSize / 2;
        
        // Set heart dimensions
        const heartWidth = this.gp.tileSize * 1.2;  
        const heartHeight = this.gp.tileSize * 1.2; 
        const heartSpacing = heartWidth + 10;

        // Draw max life (empty hearts)
        let i = 0;
        while (i < Math.ceil(this.gp.player.maxLife / 2)) {
            ctx.drawImage(this.heartEmpty, x, y, heartWidth, heartHeight);
            i++;
            x += heartSpacing;
        }

        // Reset position for drawing current life
        x = this.gp.tileSize / 2;
        i = 0;

        // Draw full hearts
        let currentLife = this.gp.player.life;
        while (currentLife >= 2) {
            ctx.drawImage(this.heartFull, x, y, heartWidth, heartHeight);
            currentLife -= 2;
            i++;
            x += heartSpacing;
        }

        // Draw half heart if there's a remainder
        if (currentLife === 1) {
            ctx.drawImage(this.heartHalf, x, y, heartWidth, heartHeight);
        }
    }

    drawPauseScreen(ctx) {
        const text = "PAUSED";
        const x = this.getXForCenteredText(ctx, text);
        const y = this.gp.screenHeight / 2;

        ctx.fillText(text, x, y);
    }

    drawDialogueWindow(ctx) {
        // Draw dialogue window
        let x = this.gp.tileSize * 2;
        let y = this.gp.tileSize * 2;
        let width = this.gp.screenWidth - (this.gp.tileSize * 4);
        let height = this.gp.tileSize * 4;

        // Draw window background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x, y, width, height);

        // Draw window border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw text
        ctx.fillStyle = 'white';
        x += this.gp.tileSize;
        y += this.gp.tileSize;
        
        // Split text into lines if it's too long
        const maxWidth = width - (this.gp.tileSize * 2);
        let words = this.currentDialogue.split(' ');
        let line = '';
        let lines = [];

        for (let word of words) {
            let testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxWidth) {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Draw each line
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + (i * 40));
        }
    }

    drawGameOverScreen(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, this.gp.screenWidth, this.gp.screenHeight);

        ctx.fillStyle = "white";
        ctx.font = "96px Arial";
        const text = "Game Over";
        const x = this.getXForCenteredText(ctx, text);
        const y = this.gp.screenHeight / 2;
        ctx.fillText(text, x, y);
    }

    drawSubWindow(ctx, x, y, width, height) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.84)";
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 35);
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(x + 5, y + 5, width - 10, height - 10, 25);
        ctx.stroke();
    }

    getXForCenteredText(ctx, text) {
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        return this.gp.screenWidth / 2 - textWidth / 2;
    }

    drawInventory(ctx) {
        // Increased scale factor
        const scale = 1.2;
        
        // Stats Window (Left Side)
        const statsFrameX = this.gp.tileSize;
        const statsFrameY = this.gp.tileSize;
        const statsFrameWidth = this.gp.tileSize * 7 * scale;
        const statsFrameHeight = this.gp.tileSize * 9 * scale;

        // Draw stats background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(statsFrameX, statsFrameY, statsFrameWidth, statsFrameHeight);
        
        // Draw stats border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(statsFrameX + 5, statsFrameY + 5, statsFrameWidth - 10, statsFrameHeight - 10);

        // Draw stats text with right-aligned values
        ctx.fillStyle = "white";
        ctx.font = `${24 * scale}px Arial`;
        const textX = statsFrameX + 25;
        const valueX = statsFrameX + statsFrameWidth - 40;
        let textY = statsFrameY + 50 * scale;
        const lineHeight = 40 * scale;

        // Helper function to draw stat line with right-aligned value
        const drawStatLine = (label, value) => {
            ctx.textAlign = "left";
            ctx.fillText(label, textX, textY);
            ctx.textAlign = "right";
            ctx.fillText(value, valueX, textY);
            textY += lineHeight;
        };

        // Draw each stat with aligned values
        drawStatLine("Level", this.gp.player.level);
        drawStatLine("Life", `${this.gp.player.life}/${this.gp.player.maxLife}`);
        drawStatLine("Strength", this.gp.player.strength);
        drawStatLine("Dexterity", this.gp.player.dexterity);
        drawStatLine("Exp", this.gp.player.exp);
        drawStatLine("Next Level", this.gp.player.nextLevelExp);
        drawStatLine("Coin", this.gp.player.coin);
        drawStatLine("Attack", `${this.gp.player.attack}`);
        drawStatLine("Defense", `${this.gp.player.defense}`);

        // Reset text alignment
        ctx.textAlign = "left";

        // Inventory Window (Right Side)
        const invFrameX = statsFrameX + statsFrameWidth + this.gp.tileSize/2;
        const invFrameY = statsFrameY;
        const invFrameWidth = this.gp.tileSize * 7 * scale;
        
        // Calculate inventory height based on content
        let invFrameHeight = statsFrameHeight;

        // Draw inventory background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(invFrameX, invFrameY, invFrameWidth, invFrameHeight);
        
        // Draw inventory border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(invFrameX + 5, invFrameY + 5, invFrameWidth - 10, invFrameHeight - 10);

        // Draw inventory slots
        const slotSize = this.gp.tileSize * scale;
        const slotsPerRow = 5; // Changed from 4 to 5
        const startX = invFrameX + 20;
        const startY = invFrameY + 40;

        // Draw items in inventory
        for (let i = 0; i < this.gp.player.maxInventorySize; i++) {
            const x = startX + (i % slotsPerRow) * (slotSize + 10);
            const y = startY + Math.floor(i / slotsPerRow) * (slotSize + 10);
            
            // Draw slot background
            ctx.fillStyle = "rgba(150, 150, 150, 0.3)";
            ctx.fillRect(x, y, slotSize, slotSize);

            // Draw item if slot has one
            if (i < this.gp.player.inventory.length) {
                const item = this.gp.player.inventory[i];
                
                // Highlight equipped items
                if (item === this.gp.player.currentWeapon || item === this.gp.player.currentArmor) {
                    ctx.fillStyle = "rgba(240, 190, 90, 0.5)";
                    ctx.fillRect(x, y, slotSize, slotSize);
                }

                if (item.image && item.image.complete) {
                    ctx.drawImage(item.image, x, y, slotSize, slotSize);
                }
            }

            // Draw cursor on selected slot
            if (i === this.inventorySlotSelected) {
                ctx.strokeStyle = "white";
                ctx.lineWidth = 3;
                ctx.strokeRect(x - 2, y - 2, slotSize + 4, slotSize + 4);
            }
        }

        // Draw item description if an item is selected
        const selectedItem = this.gp.player.inventory[this.inventorySlotSelected];
        if (selectedItem) {
            const descX = invFrameX + 20;
            // Position description below the inventory slots
            const slotRows = Math.ceil(this.gp.player.maxInventorySize / slotsPerRow);
            const slotsHeight = startY + slotRows * (slotSize + 10);
            const descY = slotsHeight + 10;
            const descWidth = invFrameWidth - 40;
            
            // Let the description method handle dynamic sizing
            this.drawItemDescription(ctx, selectedItem, descX, descY, descWidth, 0, scale);
        }
    }

    drawItemDescription(ctx, item, x, y, width, height, scale) {
        // Set up text properties for calculations
        ctx.font = `${16 * scale}px Arial`;
        const maxWidth = width - 30;
        const lineHeight = 22 * scale;
        const padding = 20 * scale;
        
        // Calculate required height based on content
        let totalHeight = padding; // Start with top padding
        
        // Name height
        totalHeight += 30 * scale; 
        
        // Description lines height
        const lines = this.wrapText(ctx, item.description, maxWidth);
        totalHeight += lines.length * lineHeight;
        
        // Add space for stats if equipment
        if (item.type === "equipment") {
            totalHeight += 15 * scale; // Spacing before stats
            totalHeight += lineHeight;  // Stats line
            totalHeight += lineHeight + 5 * scale; // Equip/unequip prompt
        }
        
        totalHeight += padding; // Bottom padding
        
        // Make sure we have a minimum height
        height = Math.max(140 * scale, totalHeight);
        
        // Check if description would go off screen
        const bottomY = y + height;
        if (bottomY > this.gp.screenHeight - 20) {
            // Move description up if it would go off screen
            y = this.gp.screenHeight - height - 20;
        }
        
        // Description background
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        ctx.fillRect(x, y, width, height);
        
        // Description border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, width - 4, height - 4);
        
        // Item name with more padding
        ctx.fillStyle = "white";
        ctx.font = `bold ${20 * scale}px Arial`;
        ctx.textAlign = "left";
        ctx.fillText(item.name, x + 10, y + 30);
        
        // Item description with text wrapping
        ctx.font = `${16 * scale}px Arial`;
        
        // Draw each line of wrapped text with more spacing
        let textY = y + 60;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x + 15, textY);
            textY += lineHeight;
        }
        
        // Item stats if it's equipment - with better spacing
        if (item.type === "equipment") {
            textY += 15 * scale; // More spacing before stats
            
            let statText = "";
            if (item.attack > 0) statText += `Attack: +${item.attack}  `;
            if (item.defense > 0) statText += `Defense: +${item.defense}`;
            ctx.fillText(statText, x + 15, textY);
            
            // Equip/unequip prompt with more spacing
            ctx.fillStyle = "yellow";
            const promptText = (item === this.gp.player.currentWeapon || item === this.gp.player.currentArmor) 
                ? "Press E to unequip" 
                : "Press E to equip";
            ctx.fillText(promptText, x + 15, textY + lineHeight + 5 * scale);
        }
        
        // Special handling for key items
        if (item.type === "key") {
            textY += 15 * scale;
            ctx.fillStyle = "yellow";
            ctx.fillText("Used automatically with doors and chests", x + 15, textY);
        }
    }

    wrapText(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + ' ' + word).width;
            
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        
        lines.push(currentLine);
        return lines;
    }

    showMessage(text, type = 'info') {
        // Check for message cooldowns as before
        const messageType = type === 'lock' ? 'lockMessage' : 
                           (type === 'combat' ? 'combatMessage' : 
                           (type === 'npc' ? 'npcMessage' : 'info'));
        
        // Skip duplicate messages during cooldown
        if (this.messageCooldowns[messageType] !== undefined) {
            if (text === this.lastMessages[messageType] && 
                this.messageCooldowns[messageType] > 0) {
                return;
            }
            
            this.messageCooldowns[messageType] = this.messageCooldownDuration;
            this.lastMessages[messageType] = text;
        }
        
        // Just add to message log
        this.addToMessageLog(text, type);
    }
    
    addToMessageLog(text) {
        // Add new message with timestamp
        this.messageLog.unshift({
            text: text,
            timeRemaining: this.logDisplayDuration
        });
        
        // Trim log to max size
        if (this.messageLog.length > this.maxLogMessages) {
            this.messageLog.pop();
        }
    }

    drawMessage(ctx) {
        // Update message counter
        this.messageCounter += this.gp.deltaTime;
        if (this.messageCounter >= this.messageDuration) {
            this.messageOn = false;
            this.messageCounter = 0;
        }

        // Draw message background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        const textWidth = ctx.measureText(this.message).width + 40;
        const x = this.gp.screenWidth/2 - textWidth/2;
        const y = this.gp.screenHeight - 100;
        ctx.fillRect(x, y, textWidth, 40);
        
        // Draw message text
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(this.message, this.gp.screenWidth/2, y + 25);
        ctx.textAlign = 'left'; // Reset alignment
    }
    
    drawMessageLog(ctx) {
        if (!this.logVisible) return;
        
        // Update message timers and remove expired messages
        this.messageLog = this.messageLog.filter(msg => {
            msg.timeRemaining -= this.gp.deltaTime;
            return msg.timeRemaining > 0;
        });
        
        if (this.messageLog.length > 0) {
            // Draw message log background
            const logWidth = 400;
            const logX = 20;
            const lineHeight = 24;
            const logHeight = this.messageLog.length * lineHeight + 10;
            
            // Position at bottom left, above the popup message area
            const logY = this.gp.screenHeight - logHeight - 120;
            
            // Draw semi-transparent background
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(logX, logY, logWidth, logHeight);
            
            // Draw border
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.strokeRect(logX, logY, logWidth, logHeight);
            
            // Draw messages
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            
            this.messageLog.forEach((msg, index) => {
                // Fade out messages as they get closer to expiring
                const opacity = Math.min(1, msg.timeRemaining / 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                
                const textY = logY + 20 + (index * lineHeight);
                ctx.fillText(msg.text, logX + 10, textY);
            });
        }
    }

    // Add a method to update the UI state, including message cooldowns
    update() {
        // Update message cooldowns
        for (const type in this.messageCooldowns) {
            if (this.messageCooldowns[type] > 0) {
                this.messageCooldowns[type] -= this.gp.deltaTime;
                if (this.messageCooldowns[type] < 0) {
                    this.messageCooldowns[type] = 0;
                }
            }
        }
    }
}