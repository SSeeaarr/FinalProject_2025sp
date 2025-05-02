export default class KeyHandler {
    constructor(gp) {
        this.gp = gp;
        
        // Make sure this flag exists
        this.enterPressed = false;
        
        // Other key properties
        this.upPressed = false;
        this.downPressed = false;
        this.leftPressed = false;
        this.rightPressed = false;
        this.attackPressed = false;
        
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
    }

    onKeyDown(e) {
        // Different handling based on game state
        if (this.gp.gameState === this.gp.playState) {
            // If inventory is open, use movement keys for navigation
            if (this.gp.player.showInventory) {
                this.handleInventoryInput(e, true);
            } else {
                // Normal gameplay controls
                this.handleGameplayInput(e, true);
            }

            // Global keys that work regardless of inventory state
            this.handleGlobalInput(e, true);
        } 
        else if (this.gp.gameState === this.gp.dialogueState) {
            this.handleDialogueInput(e, true);
        }
        // Add this block to handle keys in pause state
        else if (this.gp.gameState === this.gp.pauseState) {
            // While paused, only allow pause toggle
            if (e.code === 'KeyP') {
                this.gp.gameState = this.gp.playState;
            }
            
            // No inventory toggling in pause state
            // Remove the 'KeyC' handling here
        }
    }

    onKeyUp(e) {
        if (this.gp.gameState === this.gp.playState) {
            // Always process key releases to prevent stuck keys
            this.handleGameplayInput(e, false);
            
            // Note: We're no longer checking if the inventory is open here
            // This ensures key releases are registered even when in the inventory
        }
    }

    // Handle inventory-specific input
    handleInventoryInput(e, pressed) {
        if (pressed) {
            const slotsPerRow = 5; // Using 5 columns
            
            switch(e.code) {
                case 'KeyW':
                case 'ArrowUp':
                    if (this.gp.ui.inventorySlotSelected >= slotsPerRow) {
                        this.gp.ui.inventorySlotSelected -= slotsPerRow;
                    }
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    if (this.gp.ui.inventorySlotSelected + slotsPerRow < this.gp.player.maxInventorySize) {
                        this.gp.ui.inventorySlotSelected += slotsPerRow;
                    }
                    break;
                case 'KeyA':
                case 'ArrowLeft':
                    if (this.gp.ui.inventorySlotSelected % slotsPerRow > 0) {
                        this.gp.ui.inventorySlotSelected--;
                    }
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    // Changed condition to use maxInventorySize instead of inventory.length
                    if (this.gp.ui.inventorySlotSelected % slotsPerRow < slotsPerRow - 1 && 
                        this.gp.ui.inventorySlotSelected < this.gp.player.maxInventorySize - 1) {
                        this.gp.ui.inventorySlotSelected++;
                    }
                    break;
                case 'KeyE':
                    const selectedItem = this.gp.player.inventory[this.gp.ui.inventorySlotSelected];
                    if (selectedItem && selectedItem.type === "equipment") {
                        this.gp.player.equipItem(selectedItem);
                    }
                    break;
            }
        }
    }

    // Handle regular gameplay input
    handleGameplayInput(e, pressed) {
        switch(e.code) {
            case 'KeyW':
            case 'ArrowUp':
                this.upPressed = pressed;
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.downPressed = pressed;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                this.leftPressed = pressed;
                break;
            case 'KeyD':
            case 'ArrowRight':
                this.rightPressed = pressed;
                break;
            case 'Enter':  
                this.enterPressed = pressed;
                this.attackPressed = pressed;
                break;
        }
    }

    // Handle input that works regardless of inventory state
    handleGlobalInput(e, pressed) {
        if (pressed) {
            switch(e.code) {
                case 'KeyC':
                    // Toggle inventory
                    const wasInventoryOpen = this.gp.player.showInventory;
                    this.gp.player.showInventory = !wasInventoryOpen;
                    this.gp.ui.itemDescriptionActive = false; // Reset description state
                    
                    // Reset all key states when toggling inventory
                    if (wasInventoryOpen) {
                        // Reset movement keys when closing inventory
                        this.upPressed = false;
                        this.downPressed = false;
                        this.leftPressed = false;
                        this.rightPressed = false;
                        this.attackPressed = false;
                        this.interactPressed = false;
                    }
                    break;
                case 'KeyP':
                    // Toggle pause
                    if (this.gp.gameState === this.gp.playState) {
                        // Close inventory when pausing
                        if (this.gp.player.showInventory) {
                            this.gp.player.showInventory = false;
                        }
                        this.gp.gameState = this.gp.pauseState;
                    } else if (this.gp.gameState === this.gp.pauseState) {
                        this.gp.gameState = this.gp.playState;
                    }
                    break;
                case 'Escape':
                    // Exit inventory if open
                    if (this.gp.player.showInventory) {
                        this.gp.player.showInventory = false;
                        // Reset all key states when closing inventory
                        this.upPressed = false;
                        this.downPressed = false;
                        this.leftPressed = false;
                        this.rightPressed = false;
                        this.attackPressed = false;
                        this.interactPressed = false;
                    }
                    break;
            }
        }
    }

    handleDialogueInput(e, pressed) {
        
        if (pressed && (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter')) {
            
            
            // Find currently active NPC in current map
            let activeNPC = null;
            this.gp.npc[this.gp.currentMap].forEach(npc => {
                if (npc && npc.dialogues && npc.dialogues.length > 0) {
                    activeNPC = npc;
                }
            });
            
            if (activeNPC) {
                // Call speak() to advance dialogue or close it
                const dialogueEnded = activeNPC.speak();
                
                // If dialogue ended (last message was shown), reset movement keys
                if (dialogueEnded) {
                    // Reset all movement key states to prevent continued movement
                    this.upPressed = false;
                    this.downPressed = false;
                    this.leftPressed = false;
                    this.rightPressed = false;
                    this.attackPressed = false;
                    this.enterPressed = false;
                    
                    // Set dialogue cooldown to prevent immediate re-triggering
                    this.gp.player.dialogueCooldown = 1.0; // 1 second cooldown
                }
            } else {
                // If no active NPC found, just exit dialogue state
                this.gp.gameState = this.gp.playState;
                
                // Reset all movement key states
                this.upPressed = false;
                this.downPressed = false;
                this.leftPressed = false;
                this.rightPressed = false;
                this.attackPressed = false;
                this.enterPressed = false;
            }
        }
    }
}
