export default class CollisionChecker {
  constructor(gp) {
    this.gp = gp;
  }

  checkTile(entity) {
    const entityLeftX = entity.x + entity.solidArea.x;
    const entityRightX = entity.x + entity.solidArea.x + entity.solidArea.width;
    const entityTopY = entity.y + entity.solidArea.y;
    const entityBottomY = entity.y + entity.solidArea.y + entity.solidArea.height;

    const entityLeftCol = Math.floor(entityLeftX / this.gp.tileSize);
    const entityRightCol = Math.floor(entityRightX / this.gp.tileSize);
    const entityTopRow = Math.floor(entityTopY / this.gp.tileSize);
    const entityBottomRow = Math.floor(entityBottomY / this.gp.tileSize);

    // Safety checks for array bounds
    if (!this.gp.tileM.mapTileNum[this.gp.currentMap]) {
      console.error(`Map ${this.gp.currentMap} does not exist`);
      return false;
    }

    let tileNum1, tileNum2;

    try {
      // Get the tile numbers with bounds checking
      switch (entity.direction) {
        case "up":
          if (entityTopRow >= 0) {
            tileNum1 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityLeftCol][entityTopRow];
            tileNum2 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityRightCol][entityTopRow];
          }
          break;
        case "down":
          if (entityBottomRow < this.gp.maxScreenRow) {
            tileNum1 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityLeftCol][entityBottomRow];
            tileNum2 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityRightCol][entityBottomRow];
          }
          break;
        case "left":
          if (entityLeftCol >= 0) {
            tileNum1 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityLeftCol][entityTopRow];
            tileNum2 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityLeftCol][entityBottomRow];
          }
          break;
        case "right":
          if (entityRightCol < this.gp.maxScreenCol) {
            tileNum1 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityRightCol][entityTopRow];
            tileNum2 = this.gp.tileM.mapTileNum[this.gp.currentMap][entityRightCol][entityBottomRow];
          }
          break;
      }

      // Check if tiles exist and have collision
      if (this.gp.tileM.tile[tileNum1]?.collision || 
          this.gp.tileM.tile[tileNum2]?.collision) {
        entity.collisionOn = true;
      }
    } catch (error) {
      console.error('Tile collision check error:', error);
      return false;
    }
  }

  checkObject(entity, player) {
    let index = 999;

    for (let i = 0; i < this.gp.obj[this.gp.currentMap].length; i++) {
        const obj = this.gp.obj[this.gp.currentMap][i];
        if (obj != null) {
            // Calculate entity's actual collision area
            const entityArea = {
                x: entity.x + entity.solidArea.x,
                y: entity.y + entity.solidArea.y,
                width: entity.solidArea.width,
                height: entity.solidArea.height
            };

            // Calculate object's actual collision area
            const objectArea = {
                x: obj.x + obj.solidArea.x,
                y: obj.y + obj.solidArea.y,
                width: obj.solidArea.width,
                height: obj.solidArea.height
            };

            if (this._rectIntersect(entityArea, objectArea)) {
                if (obj.collision) {
                    entity.collisionOn = true;
                }
                if (player) {
                    index = i;
                }
            }
        }
    }
    return index;
  }

  checkEntity(entity, target) {
    let index = 999;

    for (let i = 0; i < target[this.gp.currentMap].length; i++) {
      const targetEntity = target[this.gp.currentMap][i];
      if (targetEntity && targetEntity !== entity) {
        // Calculate current positions for collision check
        const entityArea = {
          x: entity.x + entity.solidAreaDefaultX,
          y: entity.y + entity.solidAreaDefaultY,
          width: entity.solidArea.width,
          height: entity.solidArea.height
        };

        const targetArea = {
          x: targetEntity.x + targetEntity.solidAreaDefaultX,
          y: targetEntity.y + targetEntity.solidAreaDefaultY,
          width: targetEntity.solidArea.width,
          height: targetEntity.solidArea.height
        };

        // Simple rectangle intersection check
        if (this._rectIntersect(entityArea, targetArea)) {
          if (targetEntity !== entity) {
            entity.collisionOn = true;
            index = i;
          }
        }
      }
    }

    return index;
  }

  checkPlayer(entity) {
    let contactPlayer = false;

    const entityNext = {
      x: entity.x + entity.solidAreaDefaultX,
      y: entity.y + entity.solidAreaDefaultY,
      width: entity.solidArea.width,
      height: entity.solidArea.height,
    };

    switch (entity.direction) {
      case "up":
        entityNext.y -= entity.speed;
        break;
      case "down":
        entityNext.y += entity.speed;
        break;
      case "left":
        entityNext.x -= entity.speed;
        break;
      case "right":
        entityNext.x += entity.speed;
        break;
    }

    const player = this.gp.player;
    const playerArea = {
      x: player.x + player.solidAreaDefaultX,
      y: player.y + player.solidAreaDefaultY,
      width: player.solidArea.width,
      height: player.solidArea.height,
    };

    if (this._rectIntersect(entityNext, playerArea)) {
      entity.collisionOn = true;
      contactPlayer = true;
    }

    return contactPlayer;
  }

  // Utility method for rectangular intersection
  _rectIntersect(r1, r2) {
    return (
        r1.x < r2.x + r2.width &&
        r1.x + r1.width > r2.x &&
        r1.y < r2.y + r2.height &&
        r1.y + r1.height > r2.y
    );
  }
}