import TileManager from './TileManager.js';
import KeyHandler from './KeyHandler.js';
import CollisionChecker from './CollisionChecker.js';
import AssetSetter from '../config/AssetSetter.js';
import UI from './UI.js';
import EventHandler from './Eventhandler.js';
import Player from './Player.js';
import GameDataService from './GameDataService.js';

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
        // Initialize services and authentication first
        await this.initializeServices();
        
        // Set objects, NPCs, and monsters
        this.aSetter.setObject();
        this.aSetter.setNPC();
        this.aSetter.setMonster();
        
        // Try to load saved game data
        console.log("Initializing game data service...");
        const initialized = await this.gameDataService.initialize();
        
        if (initialized) {
            console.log("Game data initialized successfully, applying to game...");
            // Apply player data to the game
            const applied = this.gameDataService.applyPlayerDataToGame();
            if (applied) {
                this.ui.showMessage("Welcome back! Your progress has been loaded.");
                console.log("Player data applied successfully");
            } else {
                console.error("Failed to apply player data");
                this.player.setCharacterClass("knight");
                this.ui.showMessage("Failed to load saved data. Starting new game...");
            }
        } else {
            console.log("No saved data found, starting new game");
            // If initialization fails, set default class
            this.player.setCharacterClass("knight");
            this.ui.showMessage("Starting new game...");
        }
        
        this.gameState = this.playState;
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
        // Use an arrow function to preserve 'this' context
        const gameLoop = (currentTime) => {
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
            
            this.update();
            this.draw();
            
            requestAnimationFrame(gameLoop);
        };
        
        // Start the loop
        requestAnimationFrame(gameLoop);
    }

    update() {
        if (this.gameState === this.playState) {
            this.player.update();

            // Update NPCs - same as before
            for (let i = 0; i < this.npc[this.currentMap].length; i++) {
                if (this.npc[this.currentMap][i] != null) {
                    this.npc[this.currentMap][i].update();
                }
            }

            // Update monsters and remove dead ones
            for (let i = 0; i < this.monster[this.currentMap].length; i++) {
                if (this.monster[this.currentMap][i] != null) {
                    this.monster[this.currentMap][i].update();
                    
                    // Remove monster if it's no longer alive and not in dying state
                    const monster = this.monster[this.currentMap][i];
                    if (!monster.alive && !monster.dying) {
                        this.monster[this.currentMap][i] = null;
                    }
                }
            }
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

        // Draw UI
        this.ui.draw(this.ctx);
        
        // Restore context if scaled
        if (this.renderScale !== 1) {
            this.ctx.restore();
        }
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
    } catch (error) {
        console.error("Fatal error initializing game:", error);
        document.body.innerHTML += `<div style="color:red; position:absolute; top:10px; left:10px;">
            Error: ${error.message}
        </div>`;
    }
});

export default GamePanel;