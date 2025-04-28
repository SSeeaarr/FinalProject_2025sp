export default class AssetSetter {
  constructor(gamePanel) {
    this.gp = gamePanel;
  }

  setObject() {
    let mapNum = 0;
    let i = 0;

    this.gp.obj[mapNum][i] = new OBJ_Door();
    this.gp.obj[mapNum][i].x = 21;
    this.gp.obj[mapNum][i].y = 20;
    i++;

    this.gp.obj[mapNum][i] = new OBJ_Key();
    this.gp.obj[mapNum][i].x = 5;
    this.gp.obj[mapNum][i].y = 8;
    i++;

    this.gp.obj[mapNum][i] = new OBJ_Hotdog();
    this.gp.obj[mapNum][i].x = 20;
    this.gp.obj[mapNum][i].y = 18;
    i++;

    this.gp.obj[mapNum][i] = new OBJ_Chest();
    this.gp.obj[mapNum][i].x = 9;
    this.gp.obj[mapNum][i].y = 9;
    i++;

    mapNum++;
    this.gp.obj[mapNum][i] = new OBJ_Door();
    this.gp.obj[mapNum][i].x = 21;
    this.gp.obj[mapNum][i].y = 20;
    i++;
  }

  setNPC() {
    let mapNum = 0;
    let i = 0;

    this.gp.npc[mapNum][i] = new NPC_OldMan(this.gp);
    this.gp.npc[mapNum][i].x = 2 * this.gp.tileSize;
    this.gp.npc[mapNum][i].y = 2 * this.gp.tileSize;
    i++;
  }

  setMonster() {
    let mapNum = 0;
    let i = 0;

    this.gp.monster[mapNum][i] = new MON_GreenSlime(this.gp);
    this.gp.monster[mapNum][i].x = 15 * this.gp.tileSize;
    this.gp.monster[mapNum][i].y = 14 * this.gp.tileSize;
    i++;

    this.gp.monster[mapNum][i] = new MON_GreenSlime(this.gp);
    this.gp.monster[mapNum][i].x = 11 * this.gp.tileSize;
    this.gp.monster[mapNum][i].y = 11 * this.gp.tileSize;
    i++;
  }
}
