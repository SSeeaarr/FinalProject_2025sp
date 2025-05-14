export default class EventHandler {
  constructor(gp) {
    this.gp = gp;

    this.previousEventX = 0;
    this.previousEventY = 0;
    this.canTouchEvent = true;

    // Initialize 3D eventRect array
    this.eventRect = Array.from({ length: gp.maxMap }, () =>
      Array.from({ length: gp.maxScreenCol }, () =>
        Array.from({ length: gp.maxScreenRow }, () => {
          const rect = {
            x: 23,
            y: 23,
            width: 2,
            height: 2,
            eventRectDefaultX: 23,
            eventRectDefaultY: 23,
            eventDone: false,
          };
          return rect;
        })
      )
    );
  }

  checkEvent() {
    const xDistance = Math.abs(this.gp.player.x - this.previousEventX);
    const yDistance = Math.abs(this.gp.player.y - this.previousEventY);
    const distance = Math.max(xDistance, yDistance);

    if (distance > this.gp.tileSize) {
      this.canTouchEvent = true;
    }

    if (this.canTouchEvent) {
      if (this.hit(0, 10, 10, "any")) {
        this.damagePit(10, 10, this.gp.dialogueState);
      } else if (this.hit(0, 21, 19, "down")) {
        this.healingPool(21, 19, this.gp.dialogueState);
      } else if (this.hit(0, 20, 18, "any")) {
        this.teleport(20, 18, this.gp.dialogueState);
      } else if (this.hit(0, 2, 2, "any")) {
        this.teleportMap(1, 2, 2);
      } else if (this.hit(1, 2, 2, "any")) {
        this.teleportMap(0, 2, 2);
      }
    }
  }

  hit(map, col, row, reqDirection) {
    let hit = false;

    if (map === this.gp.currentMap) {
      const playerArea = {
        x: this.gp.player.x + this.gp.player.solidArea.x,
        y: this.gp.player.y + this.gp.player.solidArea.y,
        width: this.gp.player.solidArea.width,
        height: this.gp.player.solidArea.height,
      };

      const ev = this.eventRect[map][col][row];
      const eventArea = {
        x: col * this.gp.tileSize + ev.x,
        y: row * this.gp.tileSize + ev.y,
        width: ev.width,
        height: ev.height,
      };

      if (this.rectIntersect(playerArea, eventArea) && !ev.eventDone) {
        if (
          this.gp.player.direction === reqDirection ||
          reqDirection === "any"
        ) {
          hit = true;
          this.previousEventX = this.gp.player.x;
          this.previousEventY = this.gp.player.y;
        }
      }
    }

    return hit;
  }

  damagePit(col, row, gameState) {
    this.gp.gameState = gameState;
    this.gp.ui.currentDialogue = "You got smacked bucko";
    this.gp.player.life -= 1;
    this.canTouchEvent = false;
  }

  healingPool(col, row, gameState) {
    if (this.gp.keyH.enterPressed) {
      this.gp.gameState = gameState;
      this.gp.ui.currentDialogue =
        "You drank disgusting pig water\nbut you healed anyway. Congrats!";
      this.gp.player.life = this.gp.player.maxLife;
    }
  }

  teleport(col, row, gameState) {
    this.gp.gameState = gameState;
    this.gp.ui.currentDialogue = "WHOOSH!";
    this.gp.player.x = this.gp.tileSize * 2;
    this.gp.player.y = this.gp.tileSize * 2;
  }

  teleportMap(map, col, row) {
    this.gp.currentMap = map;
    this.gp.player.x = this.gp.tileSize * col;
    this.gp.player.y = this.gp.tileSize * row;
    this.previousEventX = this.gp.player.x;
    this.previousEventY = this.gp.player.y;
    this.canTouchEvent = false;
  }

  rectIntersect(r1, r2) {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  }
}

