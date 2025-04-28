export default class Player {
    constructor(gp, keyH) {
        this.gp = gp;
        this.keyH = keyH;

        // Initialize solidArea first
        this.solidArea = {
            x: 8,
            y: 16,
            width: 32,
            height: 32
        };
        this.solidAreaDefaultX = this.solidArea.x;
        this.solidAreaDefaultY = this.solidArea.y;

        // Attack area
        this.attackArea = {
            width: 48,  // In pixels
            height: 48  // 
        };

        // Modify invincibility properties
        this.invincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 1.0; // How long the player is invincible after taking damage

        this.setDefaultValues();
        this.getPlayerImages();
        this.getPlayerAttackImages();

        this.baseSpeed = 240; // Increase from 120 to 240 pixels per second

        // Add new attack cooldown properties
        this.canAttack = true;
        this.attackCooldown = 1.0; // Cooldown duration in seconds
    }

    setDefaultValues() {
        this.x = 100;
        this.y = 100;
        this.speed = 2;
        this.direction = "down";

        // Character Status
        this.maxLife = 6;
        this.life = this.maxLife;
        this.level = 1;
        this.strength = 1;
        this.dexterity = 1;
        this.exp = 0;
        this.nextLevelExp = 5;
        this.coin = 0;
        this.hasKey = 0;

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

    update() {
        // Handle invincibility first
        if (this.invincible) {
            this.invincibleTimer += this.gp.deltaTime;
            if (this.invincibleTimer >= this.invincibleDuration) {
                this.invincible = false;
                this.invincibleTimer = 0;
            }
        }

        // Check for monster contact immediately, before any movement
        let monsterIndex = this.gp.cChecker.checkEntity(this, this.gp.monster);
        if (monsterIndex !== 999 && !this.invincible) {
            this.contactMonster(monsterIndex);
        }

        // Rest of the update logic...
        if (this.attacking) {
            this.updateAttacking();
        } 
        else if (this.keyH.enterPressed && this.canAttack) {
            this.attacking = true;
            this.attackingCounter = 0;
            this.spriteNum = 1; // Reset sprite to first frame
            this.canAttack = false;
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
                    if (obj.collision) {
                        this.collisionOn = true;
                    }
                    this.pickUpObject(objIndex);  // Call pickUpObject when touching any object
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
                    this.pickUpObject(objIndex);  // Call pickUpObject when touching any object
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
                    this.pickUpObject(objIndex);  // Call pickUpObject when touching any object
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
    }

    updateAttacking() {
        this.attackingCounter += this.gp.deltaTime;
        const attackDuration = 0.4; // Total duration in seconds

        // First frame is shorter (0.1 seconds)
        if (this.attackingCounter <= 0.1) {
            this.spriteNum = 1;
        } 
        // Second frame is longer (0.4 seconds) and includes the hit check
        else if (this.attackingCounter <= 0.3) {
            this.spriteNum = 2;
            this.checkAttackHit();
        } 
        // End attack animation
        else if (this.attackingCounter > attackDuration) {
            this.attacking = false;
            this.attackingCounter = 0;
            this.hitMonsters = new Set();
            this.spriteNum = 1; // Reset to first frame

            setTimeout(() => {
                this.canAttack = true;
            }, 200);
        }
    }

    checkAttackHit() {
        // Track which monsters were hit in this attack
        if (!this.hitMonsters) {
            this.hitMonsters = new Set();
        }

        // Get attack area based on direction
        const attackArea = {
            x: this.x + this.solidArea.x,
            y: this.y + this.solidArea.y,
            width: this.attackArea.width,
            height: this.attackArea.height
        };

        // Adjust attack area based on direction with larger offsets
        switch(this.direction) {
            case "up":
                attackArea.y -= attackArea.height + 8;  // Added offset
                break;
            case "down":
                attackArea.y += this.solidArea.height + 8;  // Added offset
                break;
            case "left":
                attackArea.x -= attackArea.width + 8;  // Added offset
                break;
            case "right":
                attackArea.x += this.solidArea.width + 8;  // Added offset
                break;
        }

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
            // Calculate damage based on player's strength
            const damage = Math.max(this.strength, 1);
            monster.life -= damage;
            monster.invincible = true;
            
            // Check if monster dies
            if (monster.life <= 0) {
                monster.dying = true;
                monster.alive = false;
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

    contactMonster(index) {
        if (index !== 999 && !this.invincible) {
            // Take damage
            this.life -= 1;
            
            // Start invincibility period
            this.invincible = true;
            this.invincibleTimer = 0;

            // Game over if life reaches 0
            if (this.life <= 0) {
                this.gp.gameState = this.gp.gameOverState;
            }
        }
    }

    pickUpObject(index) {
        if (index !== 999) {
            const obj = this.gp.obj[this.gp.currentMap][index];
            
            if (!obj) return;

            

            switch(obj.name.toLowerCase()) {
                case 'key':
                    this.hasKey++;
                    this.gp.obj[this.gp.currentMap][index] = null;
                    
                    break;

                case 'chest':
                    if (this.hasKey > 0 && obj.collision) {
                        this.hasKey--;
                        this.gp.obj[this.gp.currentMap][index] = null;
                        
                    } else if (this.hasKey === 0) {
                        
                    }
                    break;

                case 'door':
                    if (obj.destinationMap !== null) {
                        // Change to destination map
                        this.gp.currentMap = obj.destinationMap;
                        // Set player position to door's destination coordinates
                        this.x = obj.destinationX * this.gp.tileSize;
                        this.y = obj.destinationY * this.gp.tileSize;
                        console.log(`Teleported to map ${obj.destinationMap} at position (${obj.destinationX}, ${obj.destinationY})`);
                    }
                    break;

                case 'hotdog':
                    if (this.life < this.maxLife) {
                        this.life++;
                        this.gp.obj[this.gp.currentMap][index] = null;
                    }
                    break;
            }
        }
    }

    interactNPC(index) {
        if (index !== 999) {
            if (this.keyH.enterPressed) {
                this.gp.gameState = this.gp.dialogueState;
                this.gp.npc[this.gp.currentMap][index].speak();
            }
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
    }
}