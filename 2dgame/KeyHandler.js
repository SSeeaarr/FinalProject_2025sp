export default class KeyHandler {
  constructor(gamePanel) {
    this.gp = gamePanel;

    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.enterPressed = false;

    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);

    window.addEventListener('keydown', this.keyDownHandler);
    window.addEventListener('keyup', this.keyUpHandler);
  }

  keyDownHandler(e) {
    const code = e.key.toLowerCase();
    

    if (this.gp.gameState === this.gp.playState) {
      switch(code) {
        case 'w':
        case 'arrowup':
          this.upPressed = true;
          break;
        case 's':
        case 'arrowdown':
          this.downPressed = true;
          break;
        case 'a':
        case 'arrowleft':
          this.leftPressed = true;
          break;
        case 'd':
        case 'arrowright':
          this.rightPressed = true;
          break;
        case 'enter':
          this.enterPressed = true;
          if (!this.gp.player.attacking) {
            this.gp.player.attacking = true;
          }
          // Check for nearby interactive elements
          let interacted = false;

          // Check NPCs
          this.gp.npc[this.gp.currentMap]?.forEach(npc => {
            if (npc && this.isNearby(this.gp.player, npc)) {
              npc.speak();
              interacted = true;
            }
          });

          // Check Objects
          this.gp.obj[this.gp.currentMap]?.forEach(obj => {
            if (obj && this.isNearby(this.gp.player, obj)) {
              // Handle object interaction
              interacted = true;
            }
          });

          // If nothing to interact with, attack
          if (!interacted && this.gp.player) {
            this.gp.player.attacking = true;
          }
          break;
        case 'p':
          this.gp.gameState = this.gp.pauseState;
          break;
      }
    }
    else if (this.gp.gameState === this.gp.pauseState) {
      if (code === 'p') this.gp.gameState = this.gp.playState;
    }
    else if (this.gp.gameState === this.gp.dialogueState) {
      if (code === 'enter') {
        this.gp.gameState = this.gp.playState;
      }
    }
  }

  keyUpHandler(e) {
    const code = e.key.toLowerCase();
    

    switch(code) {
      case 'w':
      case 'arrowup':
        this.upPressed = false;
        break;
      case 's':
      case 'arrowdown':
        this.downPressed = false;
        break;
      case 'a':
      case 'arrowleft':
        this.leftPressed = false;
        break;
      case 'd':
      case 'arrowright':
        this.rightPressed = false;
        break;
      case 'enter':
        this.enterPressed = false;
        break;
    }
  }

  // Add helper method to check if entities are near each other
  isNearby(entity1, entity2) {
    const range = this.gp.tileSize * 1.5; // Interaction range of 1 tile
    const deltaX = Math.abs((entity1.x + entity1.solidArea.x) - (entity2.x + entity2.solidArea.x));
    const deltaY = Math.abs((entity1.y + entity1.solidArea.y) - (entity2.y + entity2.solidArea.y));
    return deltaX < range && deltaY < range;
  }

  destroy() {
    window.removeEventListener('keydown', this.keyDownHandler);
    window.removeEventListener('keyup', this.keyUpHandler);
  }
}
