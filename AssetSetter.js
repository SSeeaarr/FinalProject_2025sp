import OBJ_Door from './objects/OBJ_Door.js';
import OBJ_Key from './objects/OBJ_Key.js';
import OBJ_Chest from './objects/OBJ_Chest.js';
import OBJ_Hotdog from './objects/OBJ_Hotdog.js';
import NPC_OldMan from './NPC.js';
import MON_GreenSlime from './monster/MON_GreenSlime.js';
import { mapConnections } from './config/MapConnections.js';

export default class AssetSetter {

    constructor(gp) {
        this.gp = gp;
    }

    setObject() {
        let mapNum = 0;
        let i = 0;

        // Set doors for each map using configuration
        Object.keys(mapConnections).forEach(mapNum => {
            mapConnections[mapNum].doors.forEach(doorConfig => {
                this.gp.obj[mapNum][i] = new OBJ_Door();
                this.gp.obj[mapNum][i].x = doorConfig.x * this.gp.tileSize;
                this.gp.obj[mapNum][i].y = doorConfig.y * this.gp.tileSize;
                this.gp.obj[mapNum][i].destinationMap = doorConfig.destinationMap;
                this.gp.obj[mapNum][i].destinationX = doorConfig.destinationX;
                this.gp.obj[mapNum][i].destinationY = doorConfig.destinationY;
                i++;
            });
        });

        // Reset counter for other objects
        i = Object.keys(mapConnections).reduce(
            (total, map) => total + mapConnections[map].doors.length, 0
        );

        // Set Key
        this.gp.obj[mapNum][i] = new OBJ_Key();
        this.gp.obj[mapNum][i].x = 5 * this.gp.tileSize;   // Convert to pixels
        this.gp.obj[mapNum][i].y = 8 * this.gp.tileSize;   // Convert to pixels
        i++;

        // Set Hotdogs
        this.gp.obj[mapNum][i] = new OBJ_Hotdog();
        this.gp.obj[mapNum][i].x = 20 * this.gp.tileSize;  // Convert to pixels
        this.gp.obj[mapNum][i].y = 18 * this.gp.tileSize;  // Convert to pixels
        i++;

        this.gp.obj[mapNum][i] = new OBJ_Hotdog();
        this.gp.obj[mapNum][i].x = 15 * this.gp.tileSize;  // Convert to pixels
        this.gp.obj[mapNum][i].y = 15 * this.gp.tileSize;  // Convert to pixels
        i++;

        // Set Chest
        this.gp.obj[mapNum][i] = new OBJ_Chest();
        this.gp.obj[mapNum][i].x = 9 * this.gp.tileSize;   // Convert to pixels
        this.gp.obj[mapNum][i].y = 9 * this.gp.tileSize;   // Convert to pixels
        i++;
    }

    setNPC() {
        let mapNum = 0;
        let i = 0;

        this.gp.npc[mapNum][i] = new NPC_OldMan(this.gp);
        // Place NPC in an open area (adjust these coordinates as needed)
        this.gp.npc[mapNum][i].x = 5 * this.gp.tileSize; // Changed from 21
        this.gp.npc[mapNum][i].y = 5 * this.gp.tileSize; // Changed from 21
        i++;
    }

    setMonster() {
        let mapNum = 0;
        let i = 0;

        // Set monsters, similar to Java code
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