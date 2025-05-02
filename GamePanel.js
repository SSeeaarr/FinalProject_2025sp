class GamePanel {
  constructor(canvas) {
    // SCREEN SETTINGS
    this.originalTileSize = 16; // 16x16 tile which is the industry standard with retro sprites
    this.scale = 3; // The scale we are applying to our tiles
    this.tileSize = this.originalTileSize * this.scale; // Makes it 48x48 tile size which is better for actually seeing the sprites
    this.maxScreenCol = 40; // How many tiles wide
    this.maxScreenRow = 23; // How many tiles tall
    this.screenWidth = this.tileSize * this.maxScreenCol;
    this.screenHeight = this.tileSize * this.maxScreenRow;
    this.maxMap = 10;
    this.currentMap = 0;

    // Game States
    this.gameState = null;
    this.playState = 1;
    this.pauseState = 2;
    this.dialogueState = 3;

    // FPS
    this.FPS = 60;

    // Game Objects
    this.tileM = new TileManager(this);
    this.keyH = new KeyHandler(this);
    this.cChecker = new CollisionChecker(this);
    this.aSetter = new AssetSetter(this);
    this.ui = new UI(this);
    this.eHandler = new EventHandler(this);
    this.player = new Player(this, this.keyH);
    this.obj = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
    this.npc = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
    this.monster = Array.from({ length: this.maxMap }, () => Array(20).fill(null));

    // Canvas Setup
    this.canvas = canvas;
    this.canvas.width = this.screenWidth;
    this.canvas.height = this.screenHeight;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    document.body.appendChild(this.canvas);

    this.setupGame();
    this.startGameThread();
  }

  // This sets up the game
  setupGame() {
    this.aSetter.setObject();
    this.aSetter.setNPC();
    this.aSetter.setMonster();
    this.gameState = this.playState;
  }

  // Starts the game loop
  startGameThread() {
    const gameLoop = () => {
      this.update();
      this.render();
      requestAnimationFrame(gameLoop); // Recursively call game loop for smooth animation
    };
    requestAnimationFrame(gameLoop);
  }

  // Update logic for the game
  update() {
    if (this.gameState === this.playState) {
      this.player.update();

      // Update NPCs
      this.npc[this.currentMap].forEach(npc => {
        if (npc) npc.update();
      });

      // Update Monsters
      this.monster[this.currentMap].forEach(monster => {
        if (monster && monster.alive && !monster.dying) {
          monster.update();
        }
        if (monster && !monster.alive) {
          monster = null;
        }
      });
    }

    if (this.gameState === this.pauseState) {
      // Handle pause state logic if necessary
    }

    // Add UI update
    this.ui.update();
  }

  // Render all game elements to the canvas
  render() {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight); // Clear previous frame
    this.tileM.draw(this.ctx);

    // Draw objects
    this.obj[this.currentMap].forEach(object => {
      if (object) object.draw(this.ctx, this);
    });

    // Draw NPCs
    this.npc[this.currentMap].forEach(npc => {
      if (npc) npc.draw(this.ctx);
    });

    // Draw Monsters
    this.monster[this.currentMap].forEach(monster => {
      if (monster) monster.draw(this.ctx);
    });

    // Draw Player
    this.player.draw(this.ctx);

    // Draw UI
    this.ui.draw(this.ctx);
  }
}

// Game Objects like TileManager, KeyHandler, etc., should be implemented similarly to this example

class TileManager {
  constructor(gamePanel) {
    this.gp = gamePanel;
  }

  draw(ctx) {
    // Draw tiles based on the map and tile data
  }
}

class KeyHandler {
  constructor(gamePanel) {
    this.gp = gamePanel;
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;

    window.addEventListener('keydown', this.keyPressed.bind(this));
    window.addEventListener('keyup', this.keyReleased.bind(this));
  }

  keyPressed(e) {
    if (e.code === 'ArrowUp') {
      this.upPressed = true;
    }
    if (e.code === 'ArrowDown') {
      this.downPressed = true;
    }
    if (e.code === 'ArrowLeft') {
      this.leftPressed = true;
    }
    if (e.code === 'ArrowRight') {
      this.rightPressed = true;
    }
  }

  keyReleased(e) {
    if (e.code === 'ArrowUp') {
      this.upPressed = false;
    }
    if (e.code === 'ArrowDown') {
      this.downPressed = false;
    }
    if (e.code === 'ArrowLeft') {
      this.leftPressed = false;
    }
    if (e.code === 'ArrowRight') {
      this.rightPressed = false;
    }
  }
}

class CollisionChecker {
  constructor(gamePanel) {
    this.gp = gamePanel;
  }

  // Implement collision checking logic here
}

class AssetSetter {
  constructor(gamePanel) {
    this.gp = gamePanel;
  }

  setObject() {
    // Set objects on the map
  }

  setNPC() {
    // Set NPCs on the map
  }

  setMonster() {
    // Set monsters on the map
  }
}

class UI {
  constructor(gamePanel) {
    this.gp = gamePanel;
  }

  draw(ctx) {
    // Draw the UI elements
  }

  update() {
    // Update the UI elements
  }
}

class Player {
  constructor(gamePanel, keyHandler) {
    this.gp = gamePanel;
    this.keyH = keyHandler;
  }

  update() {
    // Update the player's position and actions
  }

  draw(ctx) {
    // Draw the player on the canvas
  }
}

// Instantiate the game panel to start the game
const canvas = document.createElement('canvas');
const game = new GamePanel(canvas);
