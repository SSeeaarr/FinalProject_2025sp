import { Amplify, API, graphqlOperation } from 'aws-amplify';
import awsExports from './aws-exports';
import { createPlayer, updatePlayer } from './graphql/mutations';
import { onUpdatePlayer } from './graphql/subscriptions';
import { v4 as uuidv4 } from 'uuid';

Amplify.configure(awsExports);

class GamePanel {
  constructor(canvas) {
    this.playerId = uuidv4(); // Unique ID for this player
    this.players = {}; // All players including yourself
    this.otherPlayers = {}; // Other players only

    // Screen settings
    this.originalTileSize = 16;
    this.scale = 3;
    this.tileSize = this.originalTileSize * this.scale;
    this.maxScreenCol = 40;
    this.maxScreenRow = 23;
    this.screenWidth = this.tileSize * this.maxScreenCol;
    this.screenHeight = this.tileSize * this.maxScreenRow;
    this.maxMap = 10;
    this.currentMap = 0;

    // Game states
    this.gameState = null;
    this.playState = 1;
    this.pauseState = 2;
    this.dialogueState = 3;

    this.FPS = 60;

    // Game objects
    this.tileM = new TileManager(this);
    this.keyH = new KeyHandler(this);
    this.cChecker = new CollisionChecker(this);
    this.aSetter = new AssetSetter(this);
    this.ui = new UI(this);
    this.eHandler = new EventHandler(this);
    this.player = new Player(this, this.keyH, this.playerId); // Pass ID to Player
    this.players[this.playerId] = this.player;
    this.obj = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
    this.npc = Array.from({ length: this.maxMap }, () => Array(10).fill(null));
    this.monster = Array.from({ length: this.maxMap }, () => Array(20).fill(null));

    this.canvas = canvas;
    this.canvas.width = this.screenWidth;
    this.canvas.height = this.screenHeight;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;
    document.body.appendChild(this.canvas);

    this.registerPlayer();
    this.subscribeToPlayers();
    this.setupGame();
    this.startGameThread();
  }

  async registerPlayer() {
    const input = {
      id: this.playerId,
      username: `Player-${this.playerId.substring(0, 4)}`,
      positionX: 100,
      positionY: 100,
      health: 100,
    };
    try {
      await API.graphql(graphqlOperation(createPlayer, { input }));
    } catch (error) {
      console.error('Player creation failed:', error);
    }
  }

  subscribeToPlayers() {
    API.graphql(graphqlOperation(onUpdatePlayer)).subscribe({
      next: ({ value: { data } }) => {
        const updated = data.onUpdatePlayer;
        if (updated.id !== this.playerId) {
          this.otherPlayers[updated.id] = updated;
        }
      },
      error: (error) => {
        console.error('Subscription error:', error);
      }
    });
  }

  setupGame() {
    this.aSetter.setObject();
    this.aSetter.setNPC();
    this.aSetter.setMonster();
    this.gameState = this.playState;
  }

  startGameThread() {
    const gameLoop = () => {
      this.update();
      this.render();
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
  }

  update() {
    if (this.gameState === this.playState) {
      this.player.update();

      // Update NPCs
      this.npc[this.currentMap].forEach(npc => npc?.update());

      // Update Monsters
      this.monster[this.currentMap] = this.monster[this.currentMap].map(monster => {
        if (monster && monster.alive && !monster.dying) {
          monster.update();
          return monster;
        }
        return null;
      });
    }

    this.ui.update();
  }

  render() {
    this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.tileM.draw(this.ctx);

    this.obj[this.currentMap].forEach(obj => obj?.draw(this.ctx, this));
    this.npc[this.currentMap].forEach(npc => npc?.draw(this.ctx));
    this.monster[this.currentMap].forEach(monster => monster?.draw(this.ctx));

    // Draw all players
    Object.values(this.otherPlayers).forEach(p => {
      this.drawOtherPlayer(this.ctx, p);
    });

    this.player.draw(this.ctx);
    this.ui.draw(this.ctx);
  }

  drawOtherPlayer(ctx, p) {
    ctx.fillStyle = 'blue';
    ctx.fillRect(p.positionX, p.positionY, 20, 20); // Simple square as other player
    ctx.fillStyle = 'white';
    ctx.fillText(p.username, p.positionX, p.positionY - 5);
  }
}

class Player {
  constructor(gamePanel, keyHandler, id) {
    this.gp = gamePanel;
    this.keyH = keyHandler;
    this.id = id;
    this.x = 100;
    this.y = 100;
    this.health = 100;
  }

  async update() {
    const speed = 4;
    if (this.keyH.upPressed) this.y -= speed;
    if (this.keyH.downPressed) this.y += speed;
    if (this.keyH.leftPressed) this.x -= speed;
    if (this.keyH.rightPressed) this.x += speed;

    const input = {
      id: this.id,
      positionX: this.x,
      positionY: this.y,
      health: this.health,
    };

    try {
      await API.graphql(graphqlOperation(updatePlayer, { input }));
    } catch (err) {
      console.error('Update failed:', err);
    }
  }

  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, 20, 20);
    ctx.fillStyle = 'white';
    ctx.fillText('You', this.x, this.y - 5);
  }
}

// Other game classes (TileManager, KeyHandler, CollisionChecker, etc.) remain the same...

const canvas = document.createElement('canvas');
const game = new GamePanel(canvas);