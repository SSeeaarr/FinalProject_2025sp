import TileManager from './TileManager.js';
import KeyHandler from './KeyHandler.js';
import CollisionChecker from './CollisionChecker.js';
import AssetSetter from '../config/AssetSetter.js';
import UI from './UI.js';
import EventHandler from './Eventhandler.js';
import Player from './Player.js';
import GameDataService from './GameDataService.js';
import { FireballInstance } from './abilities/Fireball.js';
import { ArrowInstance } from './abilities/TripleShot.js';

import Fireball from './abilities/Fireball.js';
import TripleShot from './abilities/TripleShot.js';
import Dash from './abilities/Dash.js';
import RollTheDice from './abilities/RollTheDice.js';

import OBJ_Hotdog from './objects/OBJ_Hotdog.js';

class GamePanel {
    constructor(canvas) {
        // Basic error checking
        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }
        
        // Store the canvas reference immediately
        this.canvas = canvas;
        
        console.log("Starting game initialization...");
        
        // SCREEN SETTINGS
        this.originalTileSize = 16;
        this.scale = 3;
        this.tileSize = this.originalTileSize * this.scale;
        this.maxScreenCol = 40;
        this.maxScreenRow = 23;
        this.maxMap = 100;
        this.currentMap = 0;

        // Set canvas size based on available screen space
        this.calculateCanvasSize(canvas);
        this.ctx = canvas.getContext('2d');

        // Game States
        this.playState = 1;
        this.pauseState = 2;
        this.dialogueState = 3;
        this.gameOverState = 4;
        this.winState = 5;
        
        // Initialize win screen option selector
        this.winScreenOption = 0; // Default to first option (Return to Title)
        
        // Then set initial state
        this.gameState = this.playState;

        // Initialize components in correct order
        this.keyH = new KeyHandler(this);
        
        // Modify timing properties
        this.FPS = 60;
        this.deltaTime = 0;
        this.lastTime = 0;

        // Make game instance accessible globally for UI interactions
        window.gameInstance = this;
        
        // Initialize other game components
        this.tileM = new TileManager(this);
        this.cChecker = new CollisionChecker(this);
        this.ui = new UI(this);
        this.player = new Player(this, this.keyH);
        this.aSetter = new AssetSetter(this);
        this.eHandler = new EventHandler(this);
        
        // Initialize object arrays
        this.obj = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
        this.npc = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
        this.monster = Array.from({ length: this.maxMap }, () => Array(20).fill(null));
        
        // Initialize the game data service
        this.gameDataService = new GameDataService(this);
        this.playerDataLoaded = false;
        
        // Initialize multiplayer system
        this.multiplayer = null;

        // Initialize effects array
        this.effects = [];
        this.remoteEffects = []; // For remote player ability visuals

        // Initialize ability definitions for remote effect visuals
        this.abilityDefinitions = new Map();
        this.abilityDefinitions.set("Fireball", new Fireball(this, null));
        this.abilityDefinitions.set("TripleShot", new TripleShot(this, null));
        this.abilityDefinitions.set("Dash", new Dash(this, null));
        this.abilityDefinitions.set("Roll the Dice", new RollTheDice(this, null));
        
        // Make OBJ_Hotdog available to other classes through the GamePanel reference
        this.OBJ_Hotdog = OBJ_Hotdog;

        console.log("Game panel initialized successfully");
    }

    calculateCanvasSize(canvas) {
        // Get available screen space (with some margin)
        const availableWidth = window.innerWidth - 40; // 20px margin on each side
        const availableHeight = window.innerHeight - 40; // 20px margin on each side
        
        // Calculate target dimensions based on tiles
        const targetWidth = this.tileSize * this.maxScreenCol;
        const targetHeight = this.tileSize * this.maxScreenRow;
        
        // Calculate scale needed to fit the game in the available space
        const widthRatio = availableWidth / targetWidth;
        const heightRatio = availableHeight / targetHeight;
        
        // Use the smaller ratio to ensure both width and height fit
        const adjustedRatio = Math.min(widthRatio, heightRatio);
        
        if (adjustedRatio < 1) {
            // Only scale down if needed, never scale up
            this.screenWidth = Math.floor(targetWidth * adjustedRatio);
            this.screenHeight = Math.floor(targetHeight * adjustedRatio);
            
            // Keep track of the scaling for rendering
            this.renderScale = adjustedRatio;
        } else {
            // Use original dimensions
            this.screenWidth = targetWidth;
            this.screenHeight = targetHeight;
            this.renderScale = 1;
        }
        
        // Set canvas dimensions
        canvas.width = this.screenWidth;
        canvas.height = this.screenHeight;
        
        console.log(`Canvas sized to: ${this.screenWidth}x${this.screenHeight} (scale: ${this.renderScale})`);
    }

    async setUpGame() {
        // Remember the selected class and name
        const selectedClass = this.player.characterClass;
        const playerName = this.player.name;
        
        // Initialize services and set up game objects
        await this.initializeServices();
        this.aSetter.setObject();
        this.aSetter.setNPC();
        this.aSetter.setMonster();
        
        // Try to load saved game data
        console.log("Initializing game data service...");
        const initialized = await this.gameDataService.initialize();
        
        if (initialized) {
            const applied = this.gameDataService.applyPlayerDataToGame();
            if (applied) {
                this.ui.showMessage("Welcome back! Your progress has been loaded.");
            } else {
                console.log(`No save data found, creating new character: ${playerName} the ${selectedClass}`);
                
                // Apply the selected class and name instead of defaults
                this.player.name = playerName;
                this.player.characterClass = selectedClass;
                
                // Apply class-specific attributes and abilities
                applyClassAttributes(this.player, selectedClass);
                this.player.abilities = []; // Clear abilities array
                this.player.initClassAbility(); // Initialize abilities for this class
                this.player.loadClassSprites(); // Load class-specific sprites
                
                this.ui.showMessage(`Starting new game as a ${selectedClass}...`);
            }
        } else {
            console.log(`No game data service, using selected character: ${playerName} the ${selectedClass}`);
            
            // Apply the selected class and name
            this.player.name = playerName;
            this.player.characterClass = selectedClass;
            
            // Apply class-specific attributes and abilities
            applyClassAttributes(this.player, selectedClass);
            this.player.abilities = []; // Clear abilities array
            this.player.initClassAbility(); // Initialize abilities for this class
            this.player.loadClassSprites(); // Load class-specific sprites
            
            this.ui.showMessage(`Starting new game as a ${selectedClass}...`);
        }
        
        // Apply debug starting map if set
        this.player.applyDebugStartingMap();
        
        this.gameState = this.playState;
        
        // Add explicit console log to see when setup completes
        console.log("Game setup complete, transitioning to play state");
        window.gameLoaded = true;
        window.dispatchEvent(new Event('gameLoaded'));

        this.enableDebugMode();
    }
    
    async initializeServices() {
        // Configure Amplify
        try {
            const Amplify = window.aws_amplify.Amplify;
            Amplify.configure({
                Auth: {
                    region: "us-east-2",
                    userPoolId: "us-east-2_Czl1ZsXp1",
                    userPoolWebClientId: "5oer0age0upepjc0m5loutffso"
                }
            });
            
            // Check if user is authenticated
            const user = await window.aws_amplify.Auth.currentAuthenticatedUser();
            console.log("User is authenticated:", user.username);
        } catch (err) {
            console.warn("User is not authenticated, redirecting to login");
            // Redirect to login page if not authenticated
            window.location.href = "index.html";
        }
    }
    
    // Add a manual save method
    async saveGame() {
        return await this.gameDataService.saveGameStats();
    }

    startGameThread() {
        // Flag to track first frame
        let firstFrame = true;
        
        const gameLoop = (currentTime) => {
            // Log first frame for debugging
            if (firstFrame) {
                console.log("First game frame rendering!");
                firstFrame = false;
            }
            
            // Calculate delta time in seconds
            this.deltaTime = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;
            
            // Cap delta time to prevent huge jumps
            if (this.deltaTime > 0.1) {
                this.deltaTime = 0.1;
            }
            
            // Check if canvas still exists
            if (!this.canvas) {
                console.error("Canvas lost during game loop");
                return; // Don't continue the loop
            }
            
            this.update(currentTime);
            this.draw();
            
            requestAnimationFrame(gameLoop);
        };
        
        // Start the loop
        requestAnimationFrame(gameLoop);
        
        // Set a flag to indicate the game has started
        this.gameStarted = true;
        console.log("Game loop started!");
    }

    update(timestamp) {
        if (this.gameState === this.playState) {
            this.player.update();

            // Update NPCs - same as before
            for (let i = 0; i < this.npc[this.currentMap].length; i++) {
                if (this.npc[this.currentMap][i] != null) {
                    this.npc[this.currentMap][i].update();
                }
            }

            // Update monsters and remove dead ones
            for (let i = this.monster[this.currentMap].length - 1; i >= 0; i--) {
                if (this.monster[this.currentMap][i] != null) {
                    this.monster[this.currentMap][i].update();
                    
                    const monster = this.monster[this.currentMap][i];
                    if (!monster.alive && !monster.dying) {
                        this.monster[this.currentMap].splice(i, 1);
                    }
                }
            }

            // Update effects
            if (this.effects) {
                for (let i = this.effects.length - 1; i >= 0; i--) {
                    if (this.effects[i]) {
                        this.effects[i].update();
                        if (!this.effects[i].active) {
                            this.effects.splice(i, 1);
                        }
                    }
                }
            }

            // Update remote effects
            if (this.remoteEffects) {
                for (let i = this.remoteEffects.length - 1; i >= 0; i--) {
                    if (this.remoteEffects[i]) {
                        this.remoteEffects[i].update(); 
                        if (!this.remoteEffects[i].active) { 
                            this.remoteEffects.splice(i, 1);
                        }
                    }
                }
            }
        }
        
        // Update multiplayer system
        if (this.multiplayer) {
            this.multiplayer.update(timestamp);
        }
    }

    draw() {
        // Make sure canvas dimensions are correct
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        
        // Store these values for ability indicators and other UI elements
        this.screenWidth = canvasWidth;
        this.screenHeight = canvasHeight;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        
        // Apply scaling if necessary
        if (this.renderScale !== 1) {
            this.ctx.save();
            this.ctx.scale(this.renderScale, this.renderScale);
        }
        
        // Draw tiles first
        this.tileM.draw(this.ctx);

        // Draw objects
        for (let i = 0; i < this.obj[this.currentMap].length; i++) {
            if (this.obj[this.currentMap][i] != null) {
                this.obj[this.currentMap][i].draw(this.ctx, this);
            }
        }

        // Draw NPCs
        for (let i = 0; i < this.npc[this.currentMap].length; i++) {
            if (this.npc[this.currentMap][i] != null) {
                this.npc[this.currentMap][i].draw(this.ctx, this);
            }
        }

        // Draw monsters
        for (let i = 0; i < this.monster[this.currentMap].length; i++) {
            if (this.monster[this.currentMap][i] != null) {
                this.monster[this.currentMap][i].draw(this.ctx, this);
            }
        }

        // Draw Player
        this.player.draw(this.ctx);

        // Draw Effects (like explosions from local player)
        if (this.effects) {
            for (let i = 0; i < this.effects.length; i++) {
                if (this.effects[i] && this.effects[i].active) {
                    this.effects[i].draw(this.ctx);
                }
            }
        }

        // Draw Remote Effects (projectiles, ability visuals from other players)
        if (this.remoteEffects) {
            for (let i = 0; i < this.remoteEffects.length; i++) {
                if (this.remoteEffects[i] && this.remoteEffects[i].active) {
                    this.remoteEffects[i].draw(this.ctx);
                }
            }
        }

        // Draw UI
        this.ui.draw(this.ctx);
        
        // Draw other players
        if (this.multiplayer) {
            
            this.multiplayer.otherPlayers.forEach(player => {
                
                this.drawOtherPlayer(player);
                // Draw remote dash trail for this player
                if (player.remoteDashTrail) {
                    player.remoteDashTrail.forEach(particle => {
                        this.ctx.save();
                        this.ctx.globalAlpha = particle.alpha;
                        this.ctx.fillStyle = 'rgba(180, 200, 235, 0.6)'; 
                        const halfSize = particle.size / 2;
                        this.ctx.beginPath();
                        this.ctx.arc(particle.x, particle.y, halfSize, 0, Math.PI * 2);
                        this.ctx.fill();
                        this.ctx.restore();
                    });
                }
            });
        }
        
        // Restore context if scaled
        if (this.renderScale !== 1) {
            this.ctx.restore();
        }
    }
    
    drawOtherPlayer(player) {
        if (player.currentMap !== this.currentMap) {
            return;
        }
        
        // Use visualX and visualY for drawing if available
        const drawX = player.visualX !== undefined ? player.visualX : 
                      player.worldX !== undefined ? player.worldX : player.x;
        const drawY = player.visualY !== undefined ? player.visualY : 
                      player.worldY !== undefined ? player.worldY : player.y;

        const ctx = this.ctx;
        ctx.save();

        // Calculate screen position - these will be adjusted for attacks
        let calculatedScreenX = drawX;
        let calculatedScreenY = drawY;
        let drawWidth = this.tileSize;
        let drawHeight = this.tileSize;

        // Get player color for fallback
        let playerColor;
        switch(player.characterClass) {
            case 'knight': playerColor = '#3366FF'; break;
            case 'mage': playerColor = '#CC33FF'; break;
            case 'archer': playerColor = '#33CC33'; break;
            case 'gambler': playerColor = '#FFCC00'; break;
            default: playerColor = '#FF6666'; break;
        }

        // Determine which sprite to use based on direction and animation frame
        const spriteNumber = player.spriteNum || 1;
        let spriteImage = null;
        
        // Initialize sprite cache if it doesn't exist yet
        if (!this.playerSpriteCache) {
            this.playerSpriteCache = {};
        }
        
        // Class-specific sprite selection with caching
        try {
            const direction = player.direction || 'down';
            const frame = spriteNumber === 1 ? '1' : '2';
            const characterClass = player.characterClass || 'mage';
            
            // Check if player is attacking - handle attack animation
            if (player.attacking) {
                // Create a unique key for this attack sprite
                const attackSpriteKey = `${characterClass}_${direction}_attack_${frame}`;
                
                // Adjust drawing parameters based on direction, similar to Player class
                switch(direction) {
                    case "up":
                        calculatedScreenY -= this.tileSize;
                        drawHeight = this.tileSize * 2;
                        break;
                    case "down":
                        drawHeight = this.tileSize * 2;
                        break;
                    case "left":
                        calculatedScreenX -= this.tileSize;
                        drawWidth = this.tileSize * 2;
                        break;
                    case "right":
                        drawWidth = this.tileSize * 2;
                        break;
                }
                
                // Check if we already have this attack sprite cached
                if (!this.playerSpriteCache[attackSpriteKey]) {
                    // Create and cache the new attack sprite
                    const tempImage = new Image();
                    
                    // Convert direction to the correct sprite filename part
                    let directionInFilename;
                    switch(direction) {
                        case 'up': directionInFilename = 'Back'; break;
                        case 'down': directionInFilename = 'Front'; break;
                        case 'left': directionInFilename = 'Left'; break;
                        case 'right': directionInFilename = 'Right'; break;
                        default: directionInFilename = 'Front';
                    }
                    
                    // Use the appropriate class attack sprite with correct naming convention
                    if (characterClass === 'knight') {
                        tempImage.src = `./res/player/New_Knight_${directionInFilename}_ATK_${frame}.png`;
                    } else if (characterClass === 'gambler') {
                        tempImage.src = `./res/player/New_Gambler_${directionInFilename}_ATK_${frame}.png`;
                    } else if (characterClass === 'archer') {
                        tempImage.src = `./res/player/New_Archer_${directionInFilename}_ATK_${frame}.png`;
                    } else {
                        // Default to mage attack sprites
                        tempImage.src = `./res/player/New_Mage_${directionInFilename}_ATK_${frame}.png`;
                    }
                    
                    // Store in cache
                    this.playerSpriteCache[attackSpriteKey] = tempImage;
                }
                
                // Get the attack sprite from cache
                spriteImage = this.playerSpriteCache[attackSpriteKey];
            } else {
                // Regular movement sprite - use existing code
                // Create a unique key for this sprite
                const spriteKey = `${characterClass}_${direction}_${frame}`;
                
                // Check if we already have this sprite cached
                if (!this.playerSpriteCache[spriteKey]) {
                    // Create and cache the new sprite
                    const tempImage = new Image();
                    
                    // Convert direction to the correct sprite filename part
                    let directionInFilename;
                    switch(direction) {
                        case 'up': directionInFilename = 'Back'; break;
                        case 'down': directionInFilename = 'Front'; break;
                        case 'left': directionInFilename = 'Left'; break;
                        case 'right': directionInFilename = 'Right'; break;
                        default: directionInFilename = 'Front';
                    }
                    
                    // Load the appropriate class sprite with correct naming convention
                    if (characterClass === 'knight') {
                        tempImage.src = `./res/player/New_Knight_${directionInFilename}_${frame}.png`;
                    } else if (characterClass === 'gambler') {
                        tempImage.src = `./res/player/New_Gambler_${directionInFilename}_${frame}.png`;
                    } else if (characterClass === 'archer') {
                        tempImage.src = `./res/player/New_Archer_${directionInFilename}_${frame}.png`;
                    } else {
                        // Default to mage sprites for other classes
                        tempImage.src = `./res/player/New_Mage_${directionInFilename}_${frame}.png`;
                    }
                    
                    // Store in cache
                    this.playerSpriteCache[spriteKey] = tempImage;
                }
                
                // Get the sprite from cache
                spriteImage = this.playerSpriteCache[spriteKey];
            }
            
            // If the image isn't yet loaded, fall back to the colored rectangle
            if (!spriteImage.complete) {
                ctx.fillStyle = playerColor;
                ctx.fillRect(
                    calculatedScreenX,
                    calculatedScreenY,
                    drawWidth,
                    drawHeight
                );
            } else {
                ctx.drawImage(
                    spriteImage,
                    calculatedScreenX,
                    calculatedScreenY,
                    drawWidth,
                    drawHeight
                );
            }
        } catch (e) {
            console.error("Error loading player sprite:", e);
            // Fall back to colored rectangle
            ctx.fillStyle = playerColor;
            ctx.fillRect(
                calculatedScreenX,
                calculatedScreenY,
                this.tileSize,
                this.tileSize
            );
        }

        // Draw player name
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';

        const displayName = player.name || (player.id ? player.id.split('-')[0] : 'Unknown');

        // Calculate original center position based on the tile size, not the expanded attack sprite
        let namePosX, namePosY;

        if (player.attacking) {
            switch(player.direction || 'down') {
                case 'up':
                    // Keep centered on original tile position (not the expanded upward sprite)
                    namePosX = calculatedScreenX + this.tileSize/2;
                    namePosY = calculatedScreenY + this.tileSize - 10; // Position above the original tile
                    break;
                case 'down':
                    // Keep centered on original tile
                    namePosX = calculatedScreenX + this.tileSize/2;
                    namePosY = calculatedScreenY - 10;
                    break;
                case 'left':
                    // Keep centered on original tile (not the expanded leftward sprite)
                    namePosX = calculatedScreenX + this.tileSize + this.tileSize/2;
                    namePosY = calculatedScreenY - 10;
                    break;
                case 'right':
                    // Keep centered on original tile
                    namePosX = calculatedScreenX + this.tileSize/2;
                    namePosY = calculatedScreenY - 10;
                    break;
                default:
                    namePosX = calculatedScreenX + this.tileSize/2;
                    namePosY = calculatedScreenY - 10;
            }
        } else {
            // Standard positioning for non-attacking sprites
            namePosX = calculatedScreenX + this.tileSize/2;
            namePosY = calculatedScreenY - 10;
        }

        // Draw the name text
        ctx.strokeText(
            displayName,
            namePosX,
            namePosY
        );
        ctx.fillText(
            displayName,
            namePosX,
            namePosY
        );

        ctx.restore();
    }
    
    initMultiplayer(playerId, partyId) {
        this.multiplayer = new MultiplayerManager(this, playerId, partyId);
        this.multiplayer.connect();
    }

    enableDebugMode() {
        this.debugMode = false;
        
        // Add key listener to toggle debug mode with 'D' key
        window.addEventListener('keydown', (e) => {
            if (e.key === '0' || e.key === '9') {
                this.debugMode = !this.debugMode;
                console.log("Debug mode:", this.debugMode ? "enabled" : "disabled");
                
                // Remove existing debug overlay if disabling
                if (!this.debugMode) {
                    const existingDebug = document.getElementById('debug-overlay');
                    if (existingDebug) existingDebug.remove();
                }
            }
        });
        
        // Update debug info every second
        setInterval(() => {
            if (!this.debugMode) return;

            // Get or create debug overlay
            let debugDiv = document.getElementById('debug-overlay');
            if (!debugDiv) {
                debugDiv = document.createElement('div');
                debugDiv.id = 'debug-overlay';
                debugDiv.style.position = 'absolute';
                debugDiv.style.top = '10px';
                debugDiv.style.left = '10px';
                debugDiv.style.backgroundColor = 'rgba(0,0,0,0.7)';
                debugDiv.style.color = 'white';
                debugDiv.style.padding = '10px';
                debugDiv.style.fontFamily = 'monospace';
                debugDiv.style.zIndex = '1000';
                document.body.appendChild(debugDiv);
            }
            
            let debugText = `Player: (${this.player.worldX.toFixed(0)},${this.player.worldY.toFixed(0)})<br>`;
            
            if (this.multiplayer) {
                debugText += `Connected: ${this.multiplayer.socket?.readyState === WebSocket.OPEN}<br>`;
                debugText += `Other Players: ${this.multiplayer.otherPlayers.size}<br>`;
                
                // List all other players
                this.multiplayer.otherPlayers.forEach((player, id) => {
                    debugText += `- ${player.name}: (${player.worldX.toFixed(0)},${player.worldY.toFixed(0)})<br>`;
                });
            }
            
            debugDiv.innerHTML = debugText;
        }, 1000);
    }

    resetGame() {
        console.log("Resetting game for New Game+");
        
        // Reset maps and objects
        this.obj = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
        this.npc = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
        this.monster = Array.from({ length: this.maxMap }, () => Array(20).fill(null));
        
        // Clear effects
        this.effects = [];
        this.remoteEffects = [];
        
        // Reset player to starting position and map
        this.player.x = this.player.startingX;
        this.player.y = this.player.startingY;
        this.player.worldX = this.player.x;
        this.player.worldY = this.player.y;
        this.player.direction = "down";
        this.currentMap = 0;
        
        // Repopulate the world
        this.aSetter.setObject();
        this.aSetter.setNPC();
        this.aSetter.setMonster();
        
        console.log("Game reset complete");
    }

    startNewGamePlus() {
        console.log("Starting New Game+");
        
        // Save current player stats and inventory
        const playerLevel = this.player.level;
        const playerExp = this.player.exp;
        const playerCoin = this.player.coin;
        const playerCharacterClass = this.player.characterClass;
        
        // Save player's inventory before reset
        const playerInventory = this.player.inventory ? [...this.player.inventory] : [];
        const playerCurrentWeapon = this.player.currentWeapon;
        const playerCurrentArmor = this.player.currentArmor;
        
        // Check if already in NG+ mode
        if (this.isNewGamePlus) {
            // Increment NG+ level for stacking difficulty
            this.newGamePlusLevel++;
            // Increase enemy scaling - gets progressively harder
            this.enemyScaleFactor = 1.3 + (this.newGamePlusLevel * 0.2); // 1.5, 1.7, 1.9, etc.
            console.log(`Starting NG+${this.newGamePlusLevel} with scaling factor ${this.enemyScaleFactor}`);
        } else {
            // First NG+ cycle
            this.isNewGamePlus = true;
            this.newGamePlusLevel = 1;
            this.enemyScaleFactor = 1.5;
        }
        
        // Now reset and repopulate the game with scaled monsters
        this.resetGame();
        
        // Restore player stats, inventory, etc.
        this.player.level = playerLevel;
        this.player.exp = playerExp;
        this.player.characterClass = playerCharacterClass;
        
        // Give back some currency
        this.player.coin = Math.floor(playerCoin * 0.5); // Let them keep 50% of coins
        
        // IMPORTANT: Restore player's inventory
        if (playerInventory.length > 0) {
            console.log("Restoring player inventory with items:", playerInventory.filter(i => i).length);
            this.player.inventory = playerInventory;
            
            // Restore equipped items if they exist
            if (playerCurrentWeapon) {
                this.player.currentWeapon = playerCurrentWeapon;
                // Make sure attack stat includes weapon bonus
                this.player.attack = this.player.baseAttack + playerCurrentWeapon.attack;
            }
            
            if (playerCurrentArmor) {
                this.player.currentArmor = playerCurrentArmor;
                // Make sure defense stat includes armor bonus
                this.player.defense = this.player.baseDefense + playerCurrentArmor.defense;
            }
        } else {
            // Initialize a fresh inventory if needed
            console.log("No inventory to restore, initializing empty inventory");
            this.player.inventory = Array(this.player.maxInventorySize).fill(null);
        }
        
        // Re-initialize the player's class-specific ability
        this.player.abilities = [];
        this.player.initClassAbility();
        
        // Update message to show current NG+ level
        this.ui.showMessage(`New Game+${this.newGamePlusLevel} Started! Enemies are ${Math.floor((this.enemyScaleFactor-1)*100)}% stronger!`);
        
        // Start the game
        this.gameState = this.playState;
    }
}

// Start the game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("DOM loaded, initializing game...");
        const canvas = document.getElementById('gameCanvas');
        
        if (!canvas) {
            console.error("Canvas element not found!");
            return;
        }
        
        console.log("Canvas found, dimensions:", canvas.width, "x", canvas.height);
        const game = new GamePanel(canvas);
        
        // Set up and start the game
        await game.setUpGame();
        game.startGameThread();
        
        // Dispatch event when game is loaded
        window.dispatchEvent(new Event('gameLoaded'));
        
        // Add this where you start the game (likely in Style2.html)
        const gameStartTimeout = setTimeout(() => {
            console.log("Game start timeout triggered - forcing game to start");
            if (window.gameInstance && !window.gameInstance.gameStarted) {
                window.gameInstance.gameStarted = true;
                window.gameInstance.startGameThread();
            }
        }, 10000); // 10 seconds timeout

        // Then in your game initialization success callback:
        window.gameInstance.gameStarted = true;
        clearTimeout(gameStartTimeout);
    } catch (error) {
        console.error("Fatal error initializing game:", error);
        document.body.innerHTML += `<div style="color:red; position:absolute; top:10px; left:10px;">
            Error: ${error.message}
        </div>`;
    }
});

// Force-hide the loading screen after the page loads
window.addEventListener('DOMContentLoaded', () => {
    // Try both possible loading screen IDs
    const loadingElement = document.getElementById('loading') || 
                           document.getElementById('loadingScreen');
    if (loadingElement) {
        console.log("Found loading element, setting up hide listener");
        
        // Hide immediately if game is already loaded
        if (window.gameLoaded) {
            console.log("Game already loaded, hiding loading screen");
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                loadingElement.style.display = 'none';
            }, 500);
        }
        
        // Set up listener for game loaded event
        window.addEventListener('gameLoaded', () => {
            console.log("gameLoaded event received, hiding loading screen");
            loadingElement.style.opacity = '0';
            setTimeout(() => {
                loadingElement.style.display = 'none';
            }, 500);
        });
    } else {
        console.warn("Loading element not found");
    }
});

// Update the initializeGame function in game.js
export async function initializeGame(playerName, playerClass, partyMembers = [], partyId = null) {
    console.log('initializeGame called with:', playerName, playerClass, partyMembers, partyId);
    console.log(`Starting game with ${playerName} as a ${playerClass}`);
    console.log(`Party members:`, partyMembers);
    
    // Update loading screen with player name
    const playerNameSpan = document.getElementById('playerNameSpan');
    if (playerNameSpan) {
        playerNameSpan.textContent = playerName;
    }
    
    // Get the canvas
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas element not found!");
        return;
    }
    
    // Create a new game panel instance
    const game = new GamePanel(canvas);
    
    // Set player properties from character selection
    game.player.name = playerName;
    game.player.characterClass = playerClass.toLowerCase();
    
    // Set up and start the game
    await game.setUpGame();
    
    // Initialize multiplayer if in a party
    if (partyId) {
        try {
            // Use the window.aws_amplify.Auth namespace
            const Auth = window.aws_amplify.Auth;
            const currentUser = await Auth.currentAuthenticatedUser();
            game.initMultiplayer(currentUser.username, partyId);
        } catch (error) {
            console.error("Error initializing multiplayer:", error);
            // Continue without multiplayer rather than hanging
            game.ui.showMessage("Multiplayer unavailable", 3000);
        }
    }
    
    // Make sure game starts even if multiplayer fails
    game.startGameThread();
    
    // Add this: explicitly hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Force another redraw
            game.draw();
        }, 1000); // Short delay to ensure game is running
    }
}


function applyClassAttributes(player, playerClass) {
    // Convert to lowercase for case-insensitive comparison
    const classLower = playerClass.toLowerCase();
    
    // This sets different attributes based on class choice
    switch(classLower) {
        case "knight":
            player.maxLife = 8;
            player.life = 8;
            player.strength = 3;
            player.dexterity = 1;
            player.attackRange = 1;
            break;
        case "mage":
            player.maxLife = 4;
            player.life = 4;
            player.strength = 5;
            player.dexterity = 2;
            player.attackRange = 3;
            break;
        case "archer":
            player.maxLife = 5;
            player.life = 5;
            player.strength = 2;
            player.dexterity = 5;
            player.attackRange = 4;
            break;
        case "gambler":
            player.maxLife = 6;
            player.life = 6;
            player.strength = 2;
            player.dexterity = 3;
            player.attackRange = 2;
            player.luck = 5; // Unique stat for Gambler
            break;
        default:
            // Default values
            player.maxLife = 6;
            player.life = 6;
            player.strength = 2;
            player.dexterity = 2;
            player.attackRange = 1;
    }
}

// Add to game.js
class MultiplayerManager {
    constructor(game, playerId, partyId) {
        this.game = game;
        this.playerId = playerId;
        this.partyId = partyId;
        this.socket = null;
        this.otherPlayers = new Map(); // Store other players by ID
        this.SYNC_INTERVAL = 50; // ms between position updates
        this.MONSTER_SYNC_INTERVAL = 200; // Less frequent monster updates to reduce bandwidth
        this.lastSyncTime = 0;
        this.lastMonsterSyncTime = 0;
        this.monsterSyncCounter = 0; // Used to stagger monster updates
        this.syncedMonsters = new Map(); // Track monsters by map and ID
        this.smoothingSpeed = 10.0; // Adjust for desired responsiveness (higher is faster to catch up)
        this.lastSentPlayerData = null; // Store the last state sent
    }
    
    enableTestMode() {
        console.log("Enabling multiplayer test mode with virtual players");
        
        // Create test players at different positions
        const testPlayers = [
            { id: "test-player-1", name: "TestKnight", characterClass: "knight", x: 200, y: 200 },
            { id: "test-player-2", name: "TestMage", characterClass: "mage", x: 300, y: 200 },
            { id: "test-player-3", name: "TestArcher", characterClass: "archer", x: 250, y: 300 }
        ];
        
        // Add all test players
        testPlayers.forEach(testData => {
            const player = {
                id: testData.id,
                name: testData.name,
                characterClass: testData.characterClass,
                x: testData.x,
                y: testData.y,
                worldX: testData.x, // <-- add this
                worldY: testData.y, // <-- add this
                direction: "down",
                lastUpdate: Date.now(),
                spriteNum: 1
            };
            
            this.otherPlayers.set(player.id, player);
        });
        
        console.log("Added test players, count:", this.otherPlayers.size);
        
        // Move test players randomly
        setInterval(() => {
            this.otherPlayers.forEach(player => {
                // Random movement
                const directions = [-1, 0, 1];
                player.x += directions[Math.floor(Math.random() * 3)] * 20;
                player.y += directions[Math.floor(Math.random() * 3)] * 20;
                player.worldX = player.x; // <-- add this
                player.worldY = player.y; // <-- add this
            });
        }, 2000);
    }
    
    connect() {
        try {
            // Add logging for debugging
            console.log(`Connecting to WebSocket with partyId: ${this.partyId}, playerId: ${this.playerId}`);
            
            // Connect to WebSocket API with better error handling
            const wsEndpoint = `wss://auz9edt9p5.execute-api.us-east-2.amazonaws.com/production/?partyId=${this.partyId}&playerId=${this.playerId}`;
            console.log("Connecting to:", wsEndpoint);
            
            this.socket = new WebSocket(wsEndpoint);
            
            // Add a connection timeout
            const connectionTimeout = setTimeout(() => {
                if (this.socket && this.socket.readyState !== WebSocket.OPEN) {
                    console.log("WebSocket connection timeout - continuing without multiplayer");
                    this.game.ui.showMessage("Multiplayer unavailable", 3000);
                }
            }, 5000);
            
            this.socket.onopen = () => {
                clearTimeout(connectionTimeout);
                console.log('WebSocket connected successfully');
                // Send initial position
                this.sendPosition();
            };
            
            this.socket.onmessage = (event) => {
                
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.socket.onclose = (event) => {
                console.log('WebSocket disconnected, code:', event.code, 'reason:', event.reason);
                // Attempt to reconnect after a delay
                setTimeout(() => this.connect(), 3000);
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                // Try to provide more information
                if (this.socket.readyState === WebSocket.CLOSED) {
                    console.error('Connection is closed');
                }
            };
            
            // Add a test mode timeout
            setTimeout(() => {
                if (this.otherPlayers.size === 0) {
                    console.log("No players detected after 5 seconds, enabling test mode");
                    this.enableTestMode(); // Add this line to actually enable test mode
                }
            }, 5000);
        } catch (error) {
            console.error('Error setting up WebSocket:', error);
             
        }
    }
    
    handleMessage(message) {
        if (message.action === 'monsterSync') {
            this.updateMonsters(message);
            return;
        }
        
        if (message.senderId && (message.x !== undefined) && message.action !== 'gameEvent') {
            this.updatePlayerPosition(message);
            return;
        }
        
        if (message.action === 'gameEvent') {
            if (message.senderId === this.playerId && message.actionType !== 'abilityUsed') { // Allow self abilityUsed for local effects if needed, but generally ignore self for pos
                 // For position updates, ignore self. For abilityUsed, it's handled in handleAbilityUsed.
            }

            if (message.actionType === 'abilityUsed') {
                this.handleAbilityUsed(message);
            } else if (message.senderId !== this.playerId) { // Only update position if it's from another player
                this.updatePlayerPosition({
                    senderId: message.senderId,
                    x: message.x,
                    y: message.y,
                    direction: message.direction,
                    characterClass: message.characterClass,
                    name: message.name,
                    currentMap: message.currentMap,
                    spriteNum: message.spriteNum,
                    attacking: message.attacking 
                });
            }
            return;
        }
        
        switch (message.action) {
            case 'playerPosition':
                if (message.senderId !== this.playerId) this.updatePlayerPosition(message);
                break;
            case 'playerJoined':
                this.addPlayer(message);
                break;
            case 'playerLeft':
                this.removePlayer(message);
                break;
        }
    }

    handleAbilityUsed(data) {
        if (data.casterId === this.playerId) return; 

        const caster = this.otherPlayers.get(data.casterId);
        if (!caster || caster.currentMap !== this.game.currentMap) {
            console.log("Remote ability: Caster not found or on different map.", { casterId: data.casterId, abilityName: data.abilityName, casterOnMap: caster?.currentMap, localMap: this.game.currentMap });
            return;
        }

        console.log(`Remote ability: Processing '${data.abilityName}' from ${caster.name || data.casterId}`, data);

        const casterX = caster.visualX !== undefined ? caster.visualX : (caster.worldX !== undefined ? caster.worldX : caster.x);
        const casterY = caster.visualY !== undefined ? caster.visualY : (caster.worldY !== undefined ? caster.worldY : caster.y);

        switch (data.abilityName) {
            case "Fireball":
                { // Added block scope
                    const fireballAbilityDef = this.game.abilityDefinitions.get("Fireball");
                    if (!fireballAbilityDef) {
                        console.error("Remote Fireball: Fireball ability definition not found in GamePanel.abilityDefinitions. Cannot create remote visual.");
                        return;
                    }
                    if (!fireballAbilityDef.projectileImage) {
                        console.error("Remote Fireball: Fireball ability definition found, but projectileImage property is missing.");
                        return;
                    }
                    if (!fireballAbilityDef.projectileImage.complete) {
                        console.warn(`Remote Fireball: Fireball projectile image ('${fireballAbilityDef.projectileImage.src}') not yet loaded. Effect might use fallback or not appear immediately.`);
                    }
                    
                    const remoteFireball = new FireballInstance(
                        data.startX, data.startY, data.dirX, data.dirY,
                        this.game, null, 0, 
                        fireballAbilityDef.speed, fireballAbilityDef.lifetime, fireballAbilityDef.projectileImage
                    );
                    if (!this.game.remoteEffects) this.game.remoteEffects = [];
                    this.game.remoteEffects.push(remoteFireball);
                    console.log("Remote Fireball instance created and added to remoteEffects:", remoteFireball);
                }
                break;
            case "TripleShot":
                { // Added block scope
                    const tripleShotAbilityDef = this.game.abilityDefinitions.get("TripleShot");
                    if (!tripleShotAbilityDef) {
                        console.error("Remote TripleShot: TripleShot ability definition not found in GamePanel.abilityDefinitions. Cannot create remote visual.");
                        return;
                    }
                    if (!tripleShotAbilityDef.projectileImage) {
                        console.error("Remote TripleShot: TripleShot ability definition found, but projectileImage property is missing.");
                        return;
                    }
                    // Image loading warning can remain if useful

                    // Create a remote burst manager effect
                    const remoteBurstEffect = {
                        gp: this.game,
                        caster: caster, // Reference to the remote player object
                        abilityDef: tripleShotAbilityDef,
                        direction: data.direction, // "up", "down", "left", "right"

                        burstCountTotal: tripleShotAbilityDef.burstCount,
                        burstDelay: tripleShotAbilityDef.burstDelay,
                        burstTimer: tripleShotAbilityDef.burstDelay, // Fire first burst almost immediately
                        currentBurstNum: 0,
                        active: true,

                        update: function() {
                            if (!this.active) return;

                            this.burstTimer += this.gp.deltaTime;
                            if (this.burstTimer >= this.burstDelay) {
                                this.fireRemoteTripleArrowVolley();
                                this.burstTimer = 0;
                                this.currentBurstNum++;
                                if (this.currentBurstNum >= this.burstCountTotal) {
                                    this.active = false; // Deactivate after all bursts
                                }
                            }
                        },

                        fireRemoteTripleArrowVolley: function() {
                            if (!this.caster || !this.abilityDef.projectileImage.complete) return;

                            let mainDirX = 0;
                            let mainDirY = 0;
                            switch (this.direction) {
                                case "up": mainDirY = -1; break;
                                case "down": mainDirY = 1; break;
                                case "left": mainDirX = -1; break;
                                case "right": mainDirX = 1; break;
                            }

                            // Use caster's current visual position for each volley
                            const casterCurrentX = this.caster.visualX !== undefined ? this.caster.visualX : this.caster.worldX;
                            const casterCurrentY = this.caster.visualY !== undefined ? this.caster.visualY : this.caster.worldY;

                            // Align with the local TripleShot's starting offset
                            const startX = casterCurrentX + this.gp.tileSize / 2 - 8;
                            const startY = casterCurrentY + this.gp.tileSize / 2 - 8;

                            const createRemoteArrow = (arrowDirX, arrowDirY) => {
                                const remoteArrow = new ArrowInstance(
                                    startX, startY, arrowDirX, arrowDirY,
                                    this.gp, null, 0, // null for player, 0 for damage
                                    this.abilityDef.speed, this.abilityDef.lifetime, this.abilityDef.projectileImage
                                );
                                if (!this.gp.remoteEffects) this.gp.remoteEffects = [];
                                this.gp.remoteEffects.push(remoteArrow);
                            };

                            // Replicate local spread logic
                            if (mainDirX === 0) { // Shooting up or down
                                createRemoteArrow(mainDirX, mainDirY);      // Center
                                createRemoteArrow(-0.2, mainDirY);          // Side 1 (e.g., leftish)
                                createRemoteArrow(0.2, mainDirY);           // Side 2 (e.g., rightish)
                            } else { // Shooting left or right
                                createRemoteArrow(mainDirX, mainDirY);      // Center
                                createRemoteArrow(mainDirX, -0.2);          // Side 1 (e.g., upish)
                                createRemoteArrow(mainDirX, 0.2);           // Side 2 (e.g., downish)
                            }
                        },
                        draw: function(ctx) { /* This effect itself doesn't draw anything */ }
                    };

                    if (!this.game.remoteEffects) this.game.remoteEffects = [];
                    this.game.remoteEffects.push(remoteBurstEffect);
                    console.log(`Remote TripleShot burst sequence initiated for ${caster.name || data.casterId}`);
                }
                break;
            case "Dash":
                // Dash definition isn't strictly needed here as its properties are sent in `data`
                caster.isRemoteDashing = true;
                caster.remoteDashTimer = 0;
                caster.remoteDashDuration = data.duration;
                caster.remoteDashSpeed = data.speed;
                caster.remoteDashDirection = { x: data.dashDirX, y: data.dashDirY };
                caster.remoteDashTrail = [];
                console.log(`Remote Dash initiated for ${caster.name || data.casterId}`);
                break;
            case "Roll the Dice":
                { // Added block scope
                    const rtdAbilityDef = this.game.abilityDefinitions.get("Roll the Dice");
                    if (!rtdAbilityDef) {
                        console.error("Remote RollTheDice: RollTheDice ability definition not found in GamePanel.abilityDefinitions.");
                        return;
                    }
                    if (!rtdAbilityDef.diceImages || !rtdAbilityDef.diceImages[data.diceResult - 1]) {
                        console.error(`Remote RollTheDice: Dice images array or image for result ${data.diceResult} is missing in definition.`);
                        return;
                    }
                    if (!rtdAbilityDef.diceImages[data.diceResult - 1].complete) {
                         console.warn(`Remote RollTheDice: Dice image for result ${data.diceResult} ('${rtdAbilityDef.diceImages[data.diceResult - 1].src}') not yet loaded.`);
                    }

                    this.game.ui.showMessage(`${caster.name || data.casterId} rolled a ${data.diceResult}!`, 3000);
                    const diceEffect = {
                        caster: caster, 
                        gp: this.game, 
                        diceResult: data.diceResult,
                        timer: 0, 
                        duration: rtdAbilityDef.diceAnimationDuration || 2.0, 
                        diceImages: rtdAbilityDef.diceImages, 
                        active: true,
                        update: function() {
                            this.timer += this.gp.deltaTime;
                            if (this.timer >= this.duration) this.active = false;
                        },
                        draw: function(ctx) {
                            if (!this.active || !this.diceImages[this.diceResult - 1] || !this.diceImages[this.diceResult - 1].complete) return;
                            const diceImage = this.diceImages[this.diceResult - 1];
                            const diceSize = this.gp.tileSize; 
                            const drawX = (this.caster.visualX !== undefined ? this.caster.visualX : this.caster.worldX);
                            const drawY = (this.caster.visualY !== undefined ? this.caster.visualY : this.caster.worldY) - diceSize; 
                            const alpha = Math.max(0, 1 - (this.timer / this.duration)); 
                            ctx.globalAlpha = alpha;
                            ctx.drawImage(diceImage, drawX, drawY, diceSize, diceSize);
                            ctx.globalAlpha = 1.0;
                        }
                    };
                    if (!this.game.remoteEffects) this.game.remoteEffects = [];
                    this.game.remoteEffects.push(diceEffect);
                    console.log(`Remote RollTheDice effect created for result ${data.diceResult} and added to remoteEffects.`);
                }
                break;
            default:
                console.warn(`Remote ability: Unknown abilityName '${data.abilityName}' received.`, data);
                break;
        }
    }
    
    updatePlayerPosition(data) {
        if (data.senderId === this.playerId) return; // Ignore your own updates
        
        const { senderId, x, y, direction, characterClass, name, currentMap, spriteNum, attacking } = data;
        
        if (!this.otherPlayers.has(senderId)) {
            // Add new player if we don't have them
            this.addPlayer({ 
                senderId, 
                characterClass: characterClass || 'mage',
                name: name || senderId,
                currentMap: currentMap !== undefined ? currentMap : 0,
                spriteNum: spriteNum || 1,
                attacking: attacking || false
            });
        }
        
        const player = this.otherPlayers.get(senderId);
        
        // Store the target position rather than immediately updating
        player.targetX = x;
        player.targetY = y;
        
        // If this is the first update or the player just teleported, set position directly
        if (player.worldX === undefined || Math.abs(x - player.worldX) > 100 || Math.abs(y - player.worldY) > 100) {
            player.worldX = x;
            player.worldY = y;
            player.visualX = x;
            player.visualY = y;
        }
        
        player.direction = direction;
        player.lastUpdate = Date.now();
        player.characterClass = characterClass || player.characterClass;
        player.name = name || player.name;
        player.currentMap = currentMap !== undefined ? currentMap : player.currentMap;
        player.spriteNum = spriteNum !== undefined ? spriteNum : player.spriteNum;
        player.attacking = attacking !== undefined ? attacking : player.attacking;
        
        // Reset attack state after short delay if attacking is true
        if (player.attacking) {
            // Clear any existing attack timers
            if (player.attackTimer) clearTimeout(player.attackTimer);
            
            // Set timer to reset attack state after 300ms
            player.attackTimer = setTimeout(() => {
                player.attacking = false;
            }, 300);
        }
    }
    
    addPlayer(data) {
        if (data.senderId === this.playerId) return; // Ignore yourself
        const { senderId, characterClass, name, currentMap, spriteNum, attacking } = data;
        // Create a representation of the other player
        const player = {
            id: senderId,
            name: name || senderId.split('-')[0], // Use name or shortened ID
            characterClass: characterClass || 'mage',
            x: 0, // Will be updated by first position message
            y: 0, // Will be updated by first position message
            worldX: 0,
            worldY: 0,
            direction: 'down',
            lastUpdate: Date.now(),
            spriteNum: spriteNum || 1, // For animation
            currentMap: currentMap !== undefined ? currentMap : 0, // Default map
            attacking: attacking || false
        };
        
        this.otherPlayers.set(senderId, player);
        console.log(`Player ${player.name} joined the game on map ${player.currentMap}`);
        if (player.currentMap === this.game.currentMap) { // Only show message if on same map
             this.game.ui.showMessage(`${player.name} joined the game`, 3000);
        }
    }
    
    removePlayer(data) {
        const { senderId } = data;
        const player = this.otherPlayers.get(senderId);
        
        if (player) {
            console.log(`Player ${player.name || senderId} left the game`);
            this.game.ui.showMessage(`${player.name || senderId} left the game`, 3000);
            this.otherPlayers.delete(senderId);
        }
    }
    
    update(timestamp) {
        // Send position updates at regular intervals
        if (timestamp - this.lastSyncTime > this.SYNC_INTERVAL) {
            this.sendPosition();
            this.lastSyncTime = timestamp;
        }
        
        // Send monster updates at a lower frequency
        if (timestamp - this.lastMonsterSyncTime > this.MONSTER_SYNC_INTERVAL) {
            this.sendMonsterSync();
            this.lastMonsterSyncTime = timestamp;
        }
        
        // Apply smooth interpolation to player positions
        this.smoothPlayerPositions();
    }
    
    sendPosition() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
        
        const player = this.game.player;
        const x = player.worldX !== undefined ? player.worldX : player.x;
        const y = player.worldY !== undefined ? player.worldY : player.y;
        
        const currentPlayerData = {
            action: 'gameEvent', // This remains the primary action for the server
            // senderId is added by sendGameAction if we use that, or implicitly by WebSocket connection
            x: Math.round(x), // Round positions to reduce minor floating point diffs
            y: Math.round(y),
            direction: player.direction,
            characterClass: player.characterClass,
            name: player.name,
            currentMap: this.game.currentMap,
            spriteNum: player.spriteNum,
            attacking: player.attacking
        };
        
        // Check if data has changed since last send
        let hasChanged = false;
        if (!this.lastSentPlayerData) {
            hasChanged = true;
        } else {
            // Compare relevant fields
            if ( this.lastSentPlayerData.x !== currentPlayerData.x ||
                 this.lastSentPlayerData.y !== currentPlayerData.y ||
                 this.lastSentPlayerData.direction !== currentPlayerData.direction ||
                 this.lastSentPlayerData.currentMap !== currentPlayerData.currentMap ||
                 this.lastSentPlayerData.spriteNum !== currentPlayerData.spriteNum ||
                 this.lastSentPlayerData.attacking !== currentPlayerData.attacking
                // Name and characterClass are unlikely to change frequently during gameplay,
                // but can be added if needed.
            ) {
                hasChanged = true;
            }
        }
        
        if (hasChanged) {
            this.socket.send(JSON.stringify(currentPlayerData));
            this.lastSentPlayerData = { ...currentPlayerData }; // Store a copy
            // console.log("Sent player data:", currentPlayerData); // Optional: for debugging
        }
    }
    
    sendMonsterSync() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
        
        // Only sync monsters from the current map
        const currentMap = this.game.currentMap;
        const monsters = this.game.monster[currentMap];
        
        // Only sync a few monsters per update to reduce bandwidth
        // Use a rotating counter to cycle through all monsters over time
        const maxMonstersPerSync = 5;
        const monsterCount = monsters.length;
        const startIndex = this.monsterSyncCounter % monsterCount;
        
        const monsterData = [];
        let syncCount = 0;
        
        // Collect data for a subset of monsters
        for (let i = 0; i < monsterCount && syncCount < maxMonstersPerSync; i++) {
            const index = (startIndex + i) % monsterCount;
            const monster = monsters[index];
            
            if (monster !== null) {
                monsterData.push({
                    index: index, // Store array index for identification
                    worldX: monster.worldX,
                    worldY: monster.worldY,
                    life: monster.life,
                    maxLife: monster.maxLife,
                    alive: monster.alive,
                    dying: monster.dying,
                    name: monster.name,
                    direction: monster.direction
                });
                syncCount++;
            }
        }
        
        // Increment counter for next sync
        this.monsterSyncCounter += maxMonstersPerSync;
        
        // Only send if we have monster data
        if (monsterData.length > 0) {
            this.socket.send(JSON.stringify({
                action: 'monsterSync',
                mapId: currentMap,
                monsters: monsterData
            }));
        }
    }
    
    updateMonsters(data) {
        if (data.senderId === this.playerId) return; // Ignore your own updates
        
        // Only update monsters if we're on the same map
        if (data.mapId !== this.game.currentMap) return;
        
        // Process each monster in the received data
        data.monsters.forEach(monsterData => {
            const index = monsterData.index;
            const monster = this.game.monster[data.mapId][index];
            
            // Skip if monster doesn't exist on this client
            if (!monster) return;
            
            // Don't update locally controlled monsters
            if (this.isMonsterControlledLocally(monster)) return;
            
            // Update the monster with remote data
            monster.worldX = monsterData.worldX;
            monster.worldY = monsterData.worldY;
            monster.life = monsterData.life;
            monster.maxLife = monsterData.maxLife;
            
            // Handle monster death state changes
            if (monster.alive && !monsterData.alive) {
                // Monster just died - trigger death animation
                monster.alive = false;
                monster.dying = true;
                monster.dyingCounter = 0;
                
                // Optionally show death message
                this.game.ui.showMessage(`${monster.name} was defeated by another player!`);
            } else {
                // Update alive and dying states
                monster.alive = monsterData.alive;
                monster.dying = monsterData.dying;
            }
            
            // Update animation state and direction
            monster.direction = monsterData.direction;
            
            // If you have sprite animations, sync those too
            if (monsterData.spriteNum !== undefined) {
                monster.spriteNum = monsterData.spriteNum;
            }
        });
    }
    
    // Request full monster sync when joining a new map
    requestFullMonsterSync() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
        
        this.socket.send(JSON.stringify({
            action: 'requestMonsterSync',
            mapId: this.game.currentMap
        }));
    }
    
    isMonsterControlledLocally(monster) {
        // Simple authority model:
        // The closest player controls the monster
        // Find distance to this player
        const player = this.game.player;
        const localDistance = Math.hypot(
            monster.worldX - player.worldX,
            monster.worldY - player.worldY
        );
        
        // Find closest remote player
        let closestRemoteDistance = Infinity;
        this.otherPlayers.forEach(otherPlayer => {
            if (otherPlayer.currentMap === this.game.currentMap) {
                const distance = Math.hypot(
                    monster.worldX - otherPlayer.worldX,
                    monster.worldY - otherPlayer.worldY
                );
                closestRemoteDistance = Math.min(closestRemoteDistance, distance);
            }
        });
        
        // If local player is closest, they control the monster
        return localDistance <= closestRemoteDistance;
    }
    
    sendGameAction(actionType, actionData) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
        
        this.socket.send(JSON.stringify({
            action: 'gameEvent', // Ensure this is the primary action for routing on the server/lambda
            senderId: this.playerId, // Add senderId here
            actionType, // This is our custom sub-action type like 'abilityUsed'
            ...actionData
        }));
    }
    
    smoothPlayerPositions() {
        const lerpAmount = Math.min(1.0, this.smoothingSpeed * this.game.deltaTime); // Time-based factor

        this.otherPlayers.forEach(player => {
            if (player.isRemoteDashing) {
                player.remoteDashTimer += this.game.deltaTime;
                const moveDistance = player.remoteDashSpeed * this.game.deltaTime;
                
                // Update targetX/Y based on dash, visualX/Y will interpolate towards it
                if (player.targetX === undefined) player.targetX = player.worldX;
                if (player.targetY === undefined) player.targetY = player.worldY;

                player.targetX += player.remoteDashDirection.x * moveDistance;
                player.targetY += player.remoteDashDirection.y * moveDistance;
                
                if (this.game.deltaTime < 0.1) {
                    const currentVisualX = player.visualX !== undefined ? player.visualX : player.worldX;
                    const currentVisualY = player.visualY !== undefined ? player.visualY : player.worldY;
                    player.remoteDashTrail.push({
                        x: currentVisualX + this.game.tileSize / 2,
                        y: currentVisualY + this.game.tileSize / 2,
                        alpha: 1.0, size: this.game.tileSize * 0.6
                    });
                }
                if (player.remoteDashTimer >= player.remoteDashDuration) {
                    player.isRemoteDashing = false;
                }
            }

            if (player.remoteDashTrail) {
                player.remoteDashTrail = player.remoteDashTrail.filter(particle => {
                    particle.alpha -= this.game.deltaTime * 3; 
                    particle.size -= this.game.deltaTime * 30; 
                    return particle.alpha > 0 && particle.size > 1;
                });
            }

            if (player.targetX === undefined || player.targetY === undefined) return;
            if (player.visualX === undefined) player.visualX = player.worldX;
            if (player.visualY === undefined) player.visualY = player.worldY;
            
            player.visualX += (player.targetX - player.visualX) * lerpAmount;
            player.visualY += (player.targetY - player.visualY) * lerpAmount;
            
            // Only update worldX/Y if not dashing, to let dash control target
            if (!player.isRemoteDashing) {
                 player.worldX = player.visualX;
                 player.worldY = player.visualY;
            } else { // If dashing, worldX/Y should also follow the dash target more closely for logic
                 player.worldX = player.targetX;
                 player.worldY = player.targetY;
            }
        });
    }
    
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Add this where you handle the "Start Game" button click
startGameBtn.addEventListener('click', () => {
    // Existing validation code...
    
    // Hide character selection
    document.getElementById('characterSelect').style.display = 'none';
    
    // Show game container
    document.getElementById('gameContainer').style.display = 'block';
    
    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.remove('hidden');
    }
    
    // Initialize the game...
});

// Add this at the very end of your game.js file
// Force hide loading screen after 8 seconds no matter what
setTimeout(() => {
    console.log("Forcing all loading elements to hide");
    
    // Hide all possible loading elements
    ['loading', 'loadingScreen', 'loadingMessage'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
            }, 500);
        }
    });
    
    // Ensure canvas is visible
    const canvas = document.getElementById('gameCanvas');
    if (canvas) {
        canvas.style.display = 'block';
        canvas.style.visibility = 'visible';
        canvas.style.opacity = '1';
        canvas.style.zIndex = '5'; // Ensure it's above any remaining elements
    }
}, 8000);

export default GamePanel;