// Add these imports at the top of the file
import Fireball from './abilities/Fireball.js';
import Dash from './abilities/Dash.js';
import TripleShot from './abilities/TripleShot.js';
import RollTheDice from './abilities/RollTheDice.js';

export default class Player {
    constructor(gp, keyH) {
        this.gp = gp;
        this.keyH = keyH;

        // Initialize solidArea first // (for collision detection [character hitbox])
        this.solidArea = {
            x: 8,
            y: 16,
            width: 32,
            height: 32
        };
        this.solidAreaDefaultX = this.solidArea.x;
        this.solidAreaDefaultY = this.solidArea.y;

        // Attack properties // -------------------------------
        this.attackArea = {
            width: 92,   // (1 tile = 48 pixels)
            height: 92  // 
        };
        this.showHitbox = false; // DEBUG Set this to true to see hitboxes and possibly modify attacks
        this.canAttack = true;
        this.attackCooldown = 0.2;     // Cooldown duration in seconds
        this.attackTimer = 0;          // Track cooldown progress
        this.attackDuration = 0.4;     // Duration of attack animation
        

        // Modify invincibility properties
        this.invincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 1.0; // How long the player is invincible after taking damage

        // Track previous state of attack key to detect key press event
        this.attackKeyPreviouslyPressed = false;

        // Inventory properties
        this.maxInventorySize = 20;  // Define clear inventory limit
        this.inventory = Array(this.maxInventorySize).fill(null); // Changed to track inventory slots
        this.currentWeapon = null;
        this.currentArmor = null;
        this.showInventory = false;  // Toggle for inventory display

        // Add equipment properties
        this.attack = 1;
        this.defense = 1;
        this.currentWeapon = null;
        this.currentArmor = null;

        // Add base stats to track values without equipment
        this.baseAttack = 0;
        this.baseDefense = 0;

        // Add dialogue cooldown property
        this.dialogueCooldown = 0;

        // Add character class property
        this.characterClass = "mage"; // Default class

        // Abilities system
        this.abilities = [];

        // Base stats

        this.setDefaultValues();
        this.getPlayerImages();
        this.getPlayerAttackImages();

        this.baseSpeed = 240; // 240 pixels per second
    }

    setDefaultValues() {
        this.x = 100;
        this.y = 100;
        this.speed = 2; //2
        this.direction = "down";

        // CHARACTER BASE STATS //-------------------------------
        this.maxLife = 6;
        this.life = this.maxLife;
        this.level = 1;
        this.strength = 1;
        this.dexterity = 1;
        this.exp = 0;
        this.nextLevelExp = 5;
        this.coin = 0;
        this.hasKey = 0;

        // Clear inventory
        this.inventory = Array(this.maxInventorySize).fill(null);

        // Character State
        this.invincible = false;
        this.invincibleTimer = 0;
        this.attacking = false;
        this.attackingCounter = 0;
        this.spriteCounter = 0;
        this.spriteNum = 1;
        this.collisionOn = false;
    }

    getPlayerImages() {
        this.up1 = new Image();
        this.up1.src = "./res/player/New_Mage_Back_1.png";
        this.up2 = new Image();
        this.up2.src = "./res/player/New_Mage_Back_2.png";
        this.down1 = new Image();
        this.down1.src = "./res/player/New_Mage_Front_1.png";
        this.down2 = new Image();
        this.down2.src = "./res/player/New_Mage_Front_2.png";
        this.left1 = new Image();
        this.left1.src = "./res/player/New_Mage_Left_1.png";
        this.left2 = new Image();
        this.left2.src = "./res/player/New_Mage_Left_2.png";
        this.right1 = new Image();
        this.right1.src = "./res/player/New_Mage_Right_1.png";
        this.right2 = new Image();
        this.right2.src = "./res/player/New_Mage_Right_2.png";
    }

    getPlayerAttackImages() {
        this.ATKup1 = new Image();
        this.ATKup1.src = "./res/player/New_Mage_Back_ATK_1.png";
        this.ATKup2 = new Image();
        this.ATKup2.src = "./res/player/New_Mage_Back_ATK_2.png";
        this.ATKdown1 = new Image();
        this.ATKdown1.src = "./res/player/New_Mage_Front_ATK_1.png";
        this.ATKdown2 = new Image();
        this.ATKdown2.src = "./res/player/New_Mage_Front_ATK_2.png";
        this.ATKleft1 = new Image();
        this.ATKleft1.src = "./res/player/New_Mage_Left_ATK_1.png";
        this.ATKleft2 = new Image();
        this.ATKleft2.src = "./res/player/New_Mage_Left_ATK_2.png";
        this.ATKright1 = new Image();
        this.ATKright1.src = "./res/player/New_Mage_Right_ATK_1.png";
        this.ATKright2 = new Image();
        this.ATKright2.src = "./res/player/New_Mage_Right_ATK_2.png";
    }

    getKnightImages() {
        this.up1 = new Image();
        this.up1.src = "./res/player/New_Knight_Back_1.png";
        this.up2 = new Image();
        this.up2.src = "./res/player/New_Knight_Back_2.png";
        this.down1 = new Image();
        this.down1.src = "./res/player/New_Knight_Front_1.png";
        this.down2 = new Image();
        this.down2.src = "./res/player/New_Knight_Front_2.png";
        this.left1 = new Image();
        this.left1.src = "./res/player/New_Knight_Left_1.png";
        this.left2 = new Image();
        this.left2.src = "./res/player/New_Knight_Left_2.png";
        this.right1 = new Image();
        this.right1.src = "./res/player/New_Knight_Right_1.png";
        this.right2 = new Image();
        this.right2.src = "./res/player/New_Knight_Right_2.png";
    }

    getKnightAttackImages() {
        this.ATKup1 = new Image();
        this.ATKup1.src = "./res/player/New_Knight_Back_ATK_1.png";
        this.ATKup2 = new Image();
        this.ATKup2.src = "./res/player/New_Knight_Back_ATK_2.png";
        this.ATKdown1 = new Image();
        this.ATKdown1.src = "./res/player/New_Knight_Front_ATK_1.png";
        this.ATKdown2 = new Image();
        this.ATKdown2.src = "./res/player/New_Knight_Front_ATK_2.png";
        this.ATKleft1 = new Image();
        this.ATKleft1.src = "./res/player/New_Knight_Left_ATK_1.png";
        this.ATKleft2 = new Image();
        this.ATKleft2.src = "./res/player/New_Knight_Left_ATK_2.png";
        this.ATKright1 = new Image();
        this.ATKright1.src = "./res/player/New_Knight_Right_ATK_1.png";
        this.ATKright2 = new Image();
        this.ATKright2.src = "./res/player/New_Knight_Right_ATK_2.png";
    }

    update() {
        // Update dialogue cooldown
        if (this.dialogueCooldown > 0) {
            this.dialogueCooldown -= this.gp.deltaTime;
        }

        // Handle invincibility first (run this regardless of inventory state)
        if (this.invincible) {
            this.invincibleTimer += this.gp.deltaTime;
            if (this.invincibleTimer >= this.invincibleDuration) {
                this.invincible = false;
                this.invincibleTimer = 0;
            }
        }

        // Update attack cooldown (run this regardless of inventory state)
        if (!this.canAttack) {
            this.attackTimer -= this.gp.deltaTime;
            if (this.attackTimer <= 0) {
                this.canAttack = true;
                this.attackTimer = 0;
            }
        }

        // Check for monster contact immediately (run this regardless of inventory state)
        let monsterIndex = this.gp.cChecker.checkEntity(this, this.gp.monster);
        if (monsterIndex !== 999 && !this.invincible) {
            this.contactMonster(monsterIndex);
        }
        
        // Don't process movement or attacks if inventory is open
        if (this.showInventory) {
            return;
        }

        // Modify the NPC interaction section in update()
        if (this.keyH.enterPressed) {
            
            // Reset the enterPressed flag immediately to prevent multiple triggers
            this.keyH.enterPressed = false;
            
            // Check if dialogue cooldown has expired
            if (this.dialogueCooldown <= 0) {
                // Use the dedicated NPC interaction check
                const npcIndex = this.gp.cChecker.checkNPCInteraction(this);
                
                if (npcIndex !== 999) {
                    
                    // Force gameState change to dialogue
                    this.gp.gameState = this.gp.dialogueState;
                    
                    // Check if the NPC exists at that index
                    if (this.gp.npc[this.gp.currentMap] && this.gp.npc[this.gp.currentMap][npcIndex]) {
                        
                        this.gp.npc[this.gp.currentMap][npcIndex].speak();
                        
                    } else {
                        console.error("NPC not found at index", npcIndex, "in map", this.gp.currentMap);
                    }
                    
                    // Skip the rest of the update method
                    return;
                }
            }
        }

        
        
        if (this.attacking) {
            this.updateAttacking();
        } 
        else if (this.keyH.attackPressed && this.canAttack && !this.attacking) {
            this.attacking = true;
            this.attackingCounter = 0;
            this.spriteNum = 1; // Reset sprite to first frame
            this.canAttack = false;
            this.attackTimer = this.attackCooldown; // Reset attack timer
            this.hitMonsters = new Set(); // Reset hit monsters for new attack
        }
        else if (this.keyH.upPressed || this.keyH.downPressed || 
            this.keyH.leftPressed || this.keyH.rightPressed) {
            
            // Store original position
            const prevX = this.x;
            const prevY = this.y;
            
            let isMoving = false;
            const moveDistance = this.baseSpeed * this.gp.deltaTime;
            
            // Update Y position
            if (this.keyH.upPressed) {
                this.direction = "up";
                this.y -= moveDistance;
            }
            else if (this.keyH.downPressed) {
                this.direction = "down";
                this.y += moveDistance;
            }
            
            // Check all collisions after Y movement
            this.collisionOn = false;
            this.gp.cChecker.checkTile(this);
            
            // Check NPC collision
            let npcIndex = this.gp.cChecker.checkEntity(this, this.gp.npc);
            if (npcIndex !== 999) {
                this.collisionOn = true;
            }
            
            // Check monster collision
            monsterIndex = this.gp.cChecker.checkEntity(this, this.gp.monster);
            if (monsterIndex !== 999) {
                this.collisionOn = true;
                if (!this.invincible) {
                    this.contactMonster(monsterIndex);
                }
            }

            // Check object collision
            let objIndex = this.gp.cChecker.checkObject(this, true);
        if (objIndex !== 999) {
            const obj = this.gp.obj[this.gp.currentMap][objIndex];
            if (obj) {
                console.log("Player collided with object at index:", objIndex, "Type:", obj.type); // <--- ADD THIS LOG
                if (obj.collision) {
                    this.collisionOn = true;
                }
                this.pickUpObject(objIndex, this.gp.currentMap);
                }
            }

            // Reset position if any collision occurred
            if (this.collisionOn) {
                this.y = prevY;
            }

            // Update X position
            if (this.keyH.leftPressed) {
                this.direction = "left";
                this.x -= moveDistance;
            }
            else if (this.keyH.rightPressed) {
                this.direction = "right";
                this.x += moveDistance;
            }

            // Check all collisions after X movement
            this.collisionOn = false;
            this.gp.cChecker.checkTile(this);
            
            // Check NPC collision again
            npcIndex = this.gp.cChecker.checkEntity(this, this.gp.npc);
            if (npcIndex !== 999) {
                this.collisionOn = true;
            }
            
            // Check monster collision again
            monsterIndex = this.gp.cChecker.checkEntity(this, this.gp.monster);
            if (monsterIndex !== 999) {
                this.collisionOn = true;
                if (!this.invincible) {
                    this.contactMonster(monsterIndex);
                }
            }

            // Check object collision again
            objIndex = this.gp.cChecker.checkObject(this, true);
            if (objIndex !== 999) {
                const obj = this.gp.obj[this.gp.currentMap][objIndex];
                if (obj) {
                    if (obj.collision) {
                        this.collisionOn = true;
                    }
                    this.pickUpObject(objIndex, this.gp.currentMap);  // Call pickUpObject when touching any object
                }
            }

            // Reset position if any collision occurred
            if (this.collisionOn) {
                this.x = prevX;
            }

            isMoving = true;

            // Check for interactions without movement
            npcIndex = this.gp.cChecker.checkEntity(this, this.gp.npc);
            if (npcIndex !== 999) {
                this.interactNPC(npcIndex);
            }
            if (monsterIndex !== 999) {
                this.contactMonster(monsterIndex);
            }

            // Check object collision (for pickups)
            objIndex = this.gp.cChecker.checkObject(this, true);
            if (objIndex !== 999) {
                const obj = this.gp.obj[this.gp.currentMap][objIndex];
                if (obj) {
                    if (obj.collision) {
                        this.collisionOn = true;
                    }
                    this.pickUpObject(objIndex, this.gp.currentMap);  // Call pickUpObject when touching any object
                }
            }

            // Check for monster contact again after movement
            monsterIndex = this.gp.cChecker.checkEntity(this, this.gp.monster);
            if (monsterIndex !== 999 && !this.invincible) {
                this.contactMonster(monsterIndex);
            }

            // Only update animation if moving or attacking
            if (isMoving) {
                this.spriteCounter += this.gp.deltaTime;
                if (this.spriteCounter > 0.3) { // Change sprite every 0.3 seconds
                    this.spriteNum = this.spriteNum === 1 ? 2 : 1;
                    this.spriteCounter = 0;
                }
            } else {
                // Reset to default standing sprite when not moving
                this.spriteNum = 1;
            }
        }

        // Update abilities
        this.abilities.forEach(ability => ability.update());

        // Replace the existing ability activation checks with this:
        // Check for ability activation - now simplified since each class has only one ability
        if (this.abilities.length > 0) {
            // Use a single key (Q) for the class ability
            if (this.keyH.qPressed) {
                this.abilities[0].activate();
            }
        }
    }

    updateAttacking() {
        this.attackingCounter += this.gp.deltaTime;

        // First frame is shorter (0.1 seconds)
        if (this.attackingCounter <= 0.1) {
            this.spriteNum = 1;
        } 
        // Second frame is longer and includes hit check
        else if (this.attackingCounter <= 0.3) {
            this.spriteNum = 2;
            this.checkAttackHit();
        } 
        // End attack animation
        else if (this.attackingCounter > this.attackDuration) {
            this.attacking = false;
            this.attackingCounter = 0;
            this.hitMonsters = new Set();
            this.spriteNum = 1;
            
            // Start cooldown
            this.attackTimer = this.attackCooldown;
        }
    }

    checkAttackHit() {
        if (!this.hitMonsters) {
            this.hitMonsters = new Set();
        }

        let attackWidth = this.attackArea.width;
        let attackHeight = this.attackArea.height;
        let attackX = this.x;
        let attackY = this.y;

        // Swap dimensions for horizontal attacks
        if (this.direction === "left" || this.direction === "right") {
            attackWidth = this.attackArea.height;
            attackHeight = this.attackArea.width;
        }

        // Center the attack area based on direction
        switch(this.direction) {
            case "up":
                attackX = this.x + (this.gp.tileSize - attackWidth) / 2;
                attackY = this.y - attackHeight;
                break;
            case "down":
                attackX = this.x + (this.gp.tileSize - attackWidth) / 2;
                attackY = this.y + this.gp.tileSize;
                break;
            case "left":
                attackX = this.x - attackWidth;
                attackY = this.y + (this.gp.tileSize - attackHeight) / 2;
                break;
            case "right":
                attackX = this.x + this.gp.tileSize;
                attackY = this.y + (this.gp.tileSize - attackHeight) / 2;
                break;
        }

        const attackArea = {
            x: attackX,
            y: attackY,
            width: attackWidth,
            height: attackHeight
        };

        // Check each monster for hits
        this.gp.monster[this.gp.currentMap]?.forEach(monster => {
            if (monster && monster.alive && !monster.dying && !this.hitMonsters.has(monster)) {
                const monsterArea = {
                    x: monster.x + monster.solidArea.x,
                    y: monster.y + monster.solidArea.y,
                    width: monster.solidArea.width,
                    height: monster.solidArea.height
                };

                if (this.rectIntersect(attackArea, monsterArea)) {
                    this.damageMonster(monster);
                    this.hitMonsters.add(monster); // Track that this monster was hit
                }
            }
        });
    }

    damageMonster(monster) {
        if (!monster.invincible) {
            // Calculate damage based on player's strength AND attack stat
            const baseDamage = this.strength;
            const weaponDamage = this.attack;
            const totalDamage = Math.max(baseDamage + weaponDamage, 1);
            
            console.log(`Dealing ${totalDamage} damage to ${monster.name} (Base: ${baseDamage}, Weapon: ${weaponDamage})`);
            
            // Call monster's takeDamage method
            monster.takeDamage(totalDamage);
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

    contactMonster(index) {
        if (index !== 999 && !this.invincible) {
            // Get the monster that hit the player
            const monster = this.gp.monster[this.gp.currentMap][index];
            
            // Calculate damage with defense reduction
            const incomingDamage = monster.damage; // Default damage is 1
            const defenseReduction = Math.min(this.defense * 0.5, 0.9); // Defense reduces damage by up to 90%
            const finalDamage = Math.max(Math.ceil(incomingDamage * (1 - defenseReduction)), 1); // At least 1 damage
            
            // Apply damage
            this.life -= finalDamage;
            
            // Show damage message
            if (finalDamage > 0) {
                this.gp.ui.showMessage(`Took ${finalDamage} damage!`);
            }
            
            // Start invincibility period
            this.invincible = true;
            this.invincibleTimer = 0;

            // Game over if life reaches 0
            if (this.life <= 0) {
                this.gp.gameState = this.gp.gameOverState;
            }
        }
    }

    pickUpObject(index, mapNum) {
        if (index !== 999) {
            const obj = this.gp.obj[mapNum][index];
            if (!obj) return;
            
            // Get object name
            const objName = obj.name;
            
            // Handle different object types
            switch(obj.type) {
            case "o": // Handle keys with type "o"
                if (this.addToInventory(obj)) {
                    this.gp.obj[mapNum][index] = null;
                    this.gp.ui.showMessage(`Got a ${objName}!`, "loot");
                } else {
                    this.gp.ui.showMessage("Inventory full!");
                }
                break;

            case "p":
                if (obj.requiredKey) {
                    const requiredKeyName = `${obj.requiredKey} Key`;
                    console.log("Blue Door requires key name:", requiredKeyName); // <----- LOGGING

                    console.log("Player inventory contents:"); // <----- LOGGING
                    this.inventory.forEach(item => console.log(item ? item.name : null)); // <----- LOGGING

                    const hasRequiredKey = this.inventory.some(item => {
                        const match = item && item.name === requiredKeyName;
                        console.log(`Checking item: ${item ? item.name : null}, Matches required key: ${match}`); // <----- LOGGING
                        return match;
                    });
                    console.log("Does player have required key:", hasRequiredKey); // <----- LOGGING

                    if (hasRequiredKey) {
                        const keyIndex = this.inventory.findIndex(item => item && item.name === requiredKeyName);
                        console.log("Index of key to remove:", keyIndex); // <----- LOGGING
                        if (keyIndex > -1) {
                            this.inventory.splice(keyIndex, 1);
                            this.gp.obj[mapNum][index] = null;
                            this.gp.ui.showMessage(`You opened the ${objName} with the ${obj.requiredKey} key!`);
                            console.log("Blue Door opened!"); // <----- LOGGING
                        } else {
                            console.error("Error: Key index not found after hasRequiredKey was true."); // <----- LOGGING
                        }
                    } else if (!obj.messageShown) {
                        this.gp.ui.showMessage(`This ${objName} is locked. You need a ${obj.requiredKey} key!`, "lock");
                        obj.messageShown = true;
                        setTimeout(() => {
                            if (this.gp.obj[mapNum] && this.gp.obj[mapNum][index]) {
                                this.gp.obj[mapNum][index].messageShown = false;
                            }
                        }, 2000);
                    }
                }
                break;
                case "chest":
                // Keep your existing chest logic
                if (this.removeKeyFromInventory()) {
                    const coinsFound = Math.floor(Math.random() * 8) + 3;
                    this.coin += coinsFound;
                    this.gp.ui.showMessage(`You opened the chest and found ${coinsFound} coins!`, "loot");
                    this.gp.obj[mapNum][index] = null;
                } else {
                    this.gp.ui.showMessage("You need a key to open this chest!", "lock");
                }
                break;
                
                case "teleporter":
                    if (obj.destinationMap != null) {
                        console.log("Teleporter triggered!"); // <--- ADD THIS LOG
                        console.log("Destination Map:", obj.destinationMap, "X:", obj.destinationX, "Y:", obj.destinationY); // <--- ADD THIS LOG
                        console.log("Current Player X:", this.x, "Y:", this.y, "Current Map:", this.gp.currentMap); // <--- ADD THIS LOG
                        this.gp.currentMap = obj.destinationMap;
                        this.x = obj.destinationX * this.gp.tileSize;
                        this.y = obj.destinationY * this.gp.tileSize;
                        console.log("New Player X:", this.x, "Y:", this.y, "New Map:", this.gp.currentMap); // <--- ADD THIS LOG
                        this.gp.ui.showMessage("Teleported to a new area!");
                    }
                    break;

                case "door":
                case "arrow":
                    if (obj.destinationMap != null) {
                        this.gp.currentMap = obj.destinationMap;
                        this.x = obj.destinationX * this.gp.tileSize;
                        this.y = obj.destinationY * this.gp.tileSize;
                        this.gp.ui.showMessage("Teleported to a new area!");
                        
                        // Request monster sync after map change
                        if (this.gp.multiplayer) {
                            // Small delay to ensure map has loaded
                            setTimeout(() => {
                                this.gp.multiplayer.requestFullMonsterSync();
                            }, 100);
                        }
                    }
                    break;

                case "health":
                    if (this.life < this.maxLife) {
                        this.life = Math.min(this.life + obj.healValue, this.maxLife);
                        this.gp.obj[mapNum][index] = null;
                        this.gp.ui.showMessage(`You ate the ${objName} and recovered health!`);
                    } else {
                        if (!obj.messageShown) {
                            this.gp.ui.showMessage("Your health is already full!");
                            obj.messageShown = true;
                            setTimeout(() => {
                                if (this.gp.obj[mapNum] && this.gp.obj[mapNum][index]) {
                                    this.gp.obj[mapNum][index].messageShown = false;
                                }
                            }, 2000);
                        }
                    }
                    break;

                case "equipment":
                    if (this.addToInventory(obj)) {
                        this.gp.obj[mapNum][index] = null;
                        this.gp.ui.showMessage(`Got ${objName}!`);
                    } else {
                        this.gp.ui.showMessage("Inventory full!");
                    }
                    break;

                case "consumable":
                    if (this.addToInventory(obj)) {
                        this.gp.obj[mapNum][index] = null;
                        this.gp.ui.showMessage(`Got ${objName}!`);
                    } else {
                        this.gp.ui.showMessage("Inventory full!");
                    }
                    break;
            }
        }
    }

    interactObject(obj) {
        if (obj) {
            console.log("Interacting with object:", obj.name, "Type:", obj.type);
            if (obj.type && obj.type.includes("Door")) {
                console.log("It's a door!");
                if (obj.requiredKey) {
                    console.log("This door requires a:", obj.requiredKey, "key.");
                    const hasRequiredKey = this.inventory.some(item => item && item.color === obj.requiredKey);
                    console.log("Player inventory:", this.inventory.map(item => item ? `${item.name} (${item.color})` : null));
                    console.log("Does player have the required key?", hasRequiredKey);
                    if (hasRequiredKey) {
                        console.log("Player has the key!");
                        const keyIndex = this.inventory.findIndex(item => item && item.color === obj.requiredKey);
                        if (keyIndex > -1) {
                            const removedKey = this.inventory.splice(keyIndex, 1);
                            console.log("Removed key from inventory:", removedKey[0]?.name, removedKey[0]?.color);
                        }
                        this.gp.obj[this.gp.currentMap][this.gp.cChecker.currentObjectIndex] = null;
                        console.log("Door at index", this.gp.cChecker.currentObjectIndex, "in map", this.gp.currentMap, "set to null.");
                        this.gp.ui.showMessage(`You opened the ${obj.name} with the ${obj.requiredKey} key!`);
                    } else {
                        this.gp.ui.showMessage(`This ${obj.name} is locked. You need a ${obj.requiredKey} key!`, "lock");
                    }
                } else {
                    // If the door doesn't require a key
                    if (obj.destinationMap != null) {
                        this.gp.currentMap = obj.destinationMap;
                        this.x = obj.destinationX * this.gp.tileSize;
                        this.y = obj.destinationY * this.gp.tileSize;
                        this.gp.ui.showMessage("Teleported to a new area!");
                    }
                }
            }
        }
    }

    removeKeyFromInventory() {
        for (let i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].type === "key") {
                this.inventory.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    interactNPC(index) {
        // This method should now be very simple
        if (index !== 999 && this.keyH.enterPressed) {
            this.keyH.enterPressed = false;
            this.gp.gameState = this.gp.dialogueState;
            this.gp.npc[this.gp.currentMap][index].speak();
        }
    }

    draw(ctx) {
        let image = null;
        let drawX = this.x;
        let drawY = this.y;
        let drawWidth = this.gp.tileSize;
        let drawHeight = this.gp.tileSize;

        switch(this.direction) {
            case "up":
                if (this.attacking) {
                    drawY -= this.gp.tileSize;
                    drawHeight = this.gp.tileSize * 2;
                    image = this.spriteNum === 1 ? this.ATKup1 : this.ATKup2;
                } else {
                    image = this.spriteNum === 1 ? this.up1 : this.up2;
                }
                break;
            case "down":
                if (this.attacking) {
                    drawHeight = this.gp.tileSize * 2;
                    image = this.spriteNum === 1 ? this.ATKdown1 : this.ATKdown2;
                } else {
                    image = this.spriteNum === 1 ? this.down1 : this.down2;
                }
                break;
            case "left":
                if (this.attacking) {
                    drawX -= this.gp.tileSize;
                    drawWidth = this.gp.tileSize * 2;
                    image = this.spriteNum === 1 ? this.ATKleft1 : this.ATKleft2;
                } else {
                    image = this.spriteNum === 1 ? this.left1 : this.left2;
                }
                break;
            case "right":
                if (this.attacking) {
                    drawWidth = this.gp.tileSize * 2;
                    image = this.spriteNum === 1 ? this.ATKright1 : this.ATKright2;
                } else {
                    image = this.spriteNum === 1 ? this.right1 : this.right2;
                }
                break;
        }

        // Draw the player image
        if (image && image.complete) {
            if (this.invincible) {
                ctx.globalAlpha = 0.3;
            }
            ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
            ctx.globalAlpha = 1.0;
        }

        // Draw debug hitboxes AFTER the player sprite
        if (this.showHitbox) {
            // Make sure we're drawing on top of everything
            ctx.globalCompositeOperation = 'source-over';
            
            // Collision box (red)
            ctx.beginPath();
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                this.x + this.solidArea.x,
                this.y + this.solidArea.y,
                this.solidArea.width,
                this.solidArea.height
            );

            // Attack area (blue) when attacking
            if (this.attacking) {
                ctx.beginPath();
                ctx.strokeStyle = '#0000FF';
                
                let attackWidth = this.attackArea.width;
                let attackHeight = this.attackArea.height;
                let attackX = this.x;
                let attackY = this.y;

                // Swap width/height based on direction
                if (this.direction === "left" || this.direction === "right") {
                    attackWidth = this.attackArea.height;
                    attackHeight = this.attackArea.width;
                }

                // Center the attack area based on direction
                switch(this.direction) {
                    case "up":
                        attackX = this.x + (this.gp.tileSize - attackWidth) / 2;
                        attackY = this.y - attackHeight;
                        break;
                    case "down":
                        attackX = this.x + (this.gp.tileSize - attackWidth) / 2;
                        attackY = this.y + this.gp.tileSize;
                        break;
                    case "left":
                        attackX = this.x - attackWidth;
                        attackY = this.y + (this.gp.tileSize - attackHeight) / 2;
                        break;
                    case "right":
                        attackX = this.x + this.gp.tileSize;
                        attackY = this.y + (this.gp.tileSize - attackHeight) / 2;
                        break;
                }

                ctx.strokeRect(
                    attackX,
                    attackY,
                    attackWidth,
                    attackHeight
                );
            }
        }

        // Draw abilities
        this.abilities.forEach(ability => ability.draw(ctx));
    }

     addToInventory(item) {
        const emptySlot = this.getEmptySlot();
        if (emptySlot !== -1) {
            this.inventory[emptySlot] = item;
            console.log("Added to inventory at slot:", emptySlot, item); // Keep this for debugging
            return true;
        }
        console.log("Inventory full, cannot add:", item); // Keep this for debugging
        return false;
    }

    equipItem(item) {
        if (item.type === "equipment") {
            if (item.equipType === "weapon") {
                // If the item is already equipped, unequip it
                if (this.currentWeapon === item) {
                    this.attack -= item.attack;
                    this.currentWeapon = null;
                    this.gp.ui.showMessage(`Unequipped ${item.name}`);
                    return true;
                }
                // Otherwise equip the new weapon
                else {
                    // Unequip current weapon if one exists
                    if (this.currentWeapon) {
                        this.attack -= this.currentWeapon.attack;
                    }
                    // Equip new weapon
                    this.currentWeapon = item;
                    this.attack += item.attack;
                    this.gp.ui.showMessage(`Equipped ${item.name}`);
                }
            } else if (item.equipType === "armor") {
                // If the item is already equipped, unequip it
                if (this.currentArmor === item) {
                    this.defense -= item.defense;
                    this.currentArmor = null;
                    this.gp.ui.showMessage(`Unequipped ${item.name}`);
                    return true;
                }
                // Otherwise equip the new armor
                else {
                    // Unequip current armor if one exists
                    if (this.currentArmor) {
                        this.defense -= this.currentArmor.defense;
                    }
                    // Equip new armor
                    this.currentArmor = item;
                    this.defense += item.defense;
                    this.gp.ui.showMessage(`Equipped ${item.name}`);
                }
            }
            return true;
        }
        return false;
    }

    registerAbility(ability) {
        ability.abilityIndex = this.abilities.length;
        this.abilities.push(ability);
    }

    knockBack(directionX, directionY, strength) {
        const knockbackDistance = strength;
        this.x += directionX * knockbackDistance;
        this.y += directionY * knockbackDistance;
    }

    levelUp() {
        this.level++;
        
        // Increase stats
        this.strength += 1;
        this.dexterity += 1;
        this.maxLife += 2;
        this.life = this.maxLife; // Restore health on level up
        
        // Show level up message
        this.gp.ui.showMessage("Level Up! You reached level " + this.level);
        
        // Optional: Add visual effects for level up
        this.createLevelUpEffect();
        
        // Update stats in DynamoDB
        if (this.gp.gameDataService) {
            this.gp.gameDataService.updatePlayerProgress(
                this.level,
                this.strength,
                this.dexterity,
                this.exp,
                this.characterClass
            ).catch(err => console.error("Error updating level progress:", err));
        }
    }

    // Add this optional method for level up effects
    createLevelUpEffect() {
        // Create some particles or visual effects
        for (let i = 0; i < 20; i++) {
            // If you have a particle system, create gold/yellow particles
            // around the player to indicate level up
            const offsetX = Math.random() * this.gp.tileSize - this.gp.tileSize/2;
            const offsetY = Math.random() * this.gp.tileSize - this.gp.tileSize/2;
            
            // If you have a UI message system that can show floating text:
            this.gp.ui.addFloatingText("Level Up!", this.x + offsetX, this.y + offsetY, "gold");
        }
    }

    setCharacterClass(className) {
        const oldClass = this.characterClass;
        this.characterClass = className.toLowerCase();
        
        // Only apply default attributes if this is the first time setting the class
        // or if changing from one class to another
        if (!oldClass || oldClass !== this.characterClass) {
            // Reset and apply new class attributes here
            // ...class-specific settings...
        }
        
        return this.characterClass;
    }

    applyClassStats(className) {
        switch(className) {
            case "knight":
                // Knights have more health and defense
                this.maxLife = Math.max(this.maxLife, 8);
                this.defense = Math.max(this.defense, 7);
                break;
            case "mage":
                // Mages have more attack and special ability damage
                this.attack = Math.max(this.attack, 8);
                this.magicPower = Math.max(this.magicPower || 0, 10);
                break;
            case "archer":
                // Archers have more dexterity and attack
                this.dexterity = Math.max(this.dexterity, 8);
                this.attack = Math.max(this.attack, 7);
                break;
            case "gambler":
                // Rogues have more dexterity and speed
                this.dexterity = Math.max(this.dexterity, 10);
                this.speed = Math.max(this.speed, 7);
                break;
        }
        
        console.log(`Applied stats for class ${className}:`, {
            maxLife: this.maxLife,
            attack: this.attack,
            defense: this.defense,
            dexterity: this.dexterity
        });
    }

    loadClassSprites() {
        try {
            // First load the default mage sprites as fallback
            this.getPlayerImages();
            this.getPlayerAttackImages();
            
            // Then try to load class-specific sprites
            switch(this.characterClass) {
                case "knight":
                    this.getKnightImages();
                    this.getKnightAttackImages();
                    break;
                case "archer":
                    this.getArcherImages();
                    this.getArcherAttackImages(); 
                    break;
                case "gambler":
                    this.getGamblerImages();
                    this.getGamblerAttackImages();
                    break;
                case "mage":
                    // Already loaded default mage sprites
                    break;
            }
        } catch(e) {
            console.warn(`Failed to load sprites for ${this.characterClass} class, using mage sprites instead.`, e);
            // Ensure mage sprites are loaded as fallback
            this.getPlayerImages();
            this.getPlayerAttackImages();
        }
    }

    initClassAbility() {
        this.abilities = [];
        
        // Clear existing abilities and create new ones based on character class
        switch (this.characterClass) {
            case "knight":
                const dash = new Dash(this.gp, this);
                this.abilities.push(dash);
                break;
            case "mage":
                const fireball = new Fireball(this.gp, this);
                this.abilities.push(fireball);
                break;
            case "archer":
                const tripleShot = new TripleShot(this.gp, this);
                this.abilities.push(tripleShot);
                break;
            case "gambler":
                const rollTheDice = new RollTheDice(this.gp, this);
                this.abilities.push(rollTheDice);
                break;
            default:
                console.warn(`No special ability defined for class: ${this.characterClass}`);
        }
        
        // Set ability indices for proper UI positioning
        this.abilities.forEach((ability, index) => {
            ability.abilityIndex = index;
            console.log(`Set ability ${ability.name} index to ${index}`);
        });
    }

    setClassStats() {
        // Adjust base stats based on class
        switch(this.characterClass) {
            case "knight":
                this.strength = 3;
                this.dexterity = 1;
                this.maxLife = 8;
                break;
            case "archer":
                this.strength = 1;
                this.dexterity = 3;
                this.maxLife = 5;
                break;
            case "gambler":
                this.strength = 2;
                this.dexterity = 2;
                this.maxLife = 6;
                break;
            case "mage":
            default:
                this.strength = 2;
                this.dexterity = 1;
                this.maxLife = 6;
                break;
        }
        
        // Reset current life to max
        this.life = this.maxLife;
    }

    checkMonsterCollision(direction) {
        // Get the monster collision status
        const monsterIndex = this.gp.cChecker.checkEntity(this, this.gp.monster[this.gp.currentMap]);
        
        if (monsterIndex !== 999) {
            const monster = this.gp.monster[this.gp.currentMap][monsterIndex];
            
            // Only take damage if monster is alive and not in dying state
            if (monster && monster.alive && !monster.dying) {
                // Your existing damage-taking logic
                this.takeDamage(monster.attack);
                this.invincible = true;
                // ... etc
            }
        }
    }

    getEmptySlot() {
        if (!this.inventory) {
            this.inventory = Array(this.maxInventorySize).fill(null);
        }
        for (let i = 0; i < this.maxInventorySize; i++) {
            if (this.inventory[i] === null) {
                return i; // Return the first empty slot index
            }
        }
        return -1; // No empty slot found
    }

    pickUpItem(item) {
        const emptySlot = this.getEmptySlot();
        
        if (emptySlot !== -1) {
            this.inventory[emptySlot] = item;
            this.gp.ui.showMessage(`Got ${item.name}!`);
            return true;
        } else {
            // Debug logging
            console.log("Inventory check when full:", {
                maxSize: this.maxInventorySize,
                currentItems: this.inventory.filter(i => i !== null).length,
                inventoryContents: this.inventory.map(i => i ? i.name || "Unknown" : null)
            });
            
            this.gp.ui.showMessage("Inventory full!");
            return false;
        }
    }
}


