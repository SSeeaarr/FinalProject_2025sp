import OBJ_Door from '../objects/OBJ_Door.js';
import OBJ_Key from '../objects/OBJ_Key.js';
import OBJ_Chest from '../objects/OBJ_Chest.js';
import OBJ_Hotdog from '../objects/OBJ_Hotdog.js';
import OBJ_WoodenStaff from '../objects/OBJ_WoodenStaff.js';  // Add this
import OBJ_LeatherRobe from '../objects/OBJ_LeatherRobe.js';   // Add this
import OBJ_RobeOfElders from '../objects/OBJ_RobeOfElders.js';
import OBJ_StaffOfTrees from '../objects/OBJ_StaffOfTrees.js';
import NPC_OldMan from '../NPC.js';
import MON_GreenSlime from '../monster/MON_GreenSlime.js';
import MON_ShootingSlime from '../monster/MON_ShootingSlime.js';
import { mapConnections } from './MapConnections.js';

export default class AssetSetter {
    constructor(gp) {
        this.gp = gp;
        
        // Define map configurations
        this.mapSetups = {
            "0": {  // First map
                monsters: [
                    { type: "slime", x: 15, y: 14 },
                    { type: "slime", x: 11, y: 11 },
                    { type: "shootingSlime", x: 20, y: 10 }
                ],
                objects: [
                    { type: "key", x: 5, y: 8 },
                    { type: "hotdog", x: 20, y: 18 },
                    { type: "hotdog", x: 15, y: 15 },
                    { type: "chest", x: 9, y: 9 },
                    { type: "woodenStaff", x: 7, y: 7 },    // Add staff
                    { type: "leatherRobe", x: 8, y: 7 },     // Add robe      Scroll down if you're adding more objects :)
                    { type: "robeOfElders", x: 10, y: 7 },
                    { type: "staffOfTrees", x: 12, y: 7 }
                ],
                npcs: [
                    { type: "oldman", x: 5, y: 5 }
                ]
            },
            "1": {  // Second map
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 },
                    
                ]
            }
            // Add more maps as needed
        };
    }

    setObject() {
        // Initialize object arrays for each map
        Object.keys(this.mapSetups).forEach(mapNum => {
            if (!this.gp.obj[mapNum]) {
                this.gp.obj[mapNum] = [];
            }
        });

        // Set doors from mapConnections with separate index per map
        Object.keys(mapConnections).forEach(mapNum => {
            let mapIndex = 0;  // Separate index for each map
            
            mapConnections[mapNum].doors?.forEach(doorConfig => {
                this.gp.obj[mapNum][mapIndex] = new OBJ_Door();
                this.gp.obj[mapNum][mapIndex].x = doorConfig.x * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].y = doorConfig.y * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].destinationMap = doorConfig.destinationMap;
                this.gp.obj[mapNum][mapIndex].destinationX = doorConfig.destinationX;
                this.gp.obj[mapNum][mapIndex].destinationY = doorConfig.destinationY;
                mapIndex++;
            });
        });

        // Set other objects starting after doors
        Object.keys(this.mapSetups).forEach(mapNum => {
            let mapIndex = this.gp.obj[mapNum]?.length || 0;  // Start after doors /////////////////////// IMPORTANT TO SET ITEMS UP HERE TOOO!!!!!
            const setup = this.mapSetups[mapNum];
            
            setup.objects?.forEach(obj => {
                switch(obj.type) {
                    case "key":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Key();
                        break;
                    case "chest":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Chest();
                        break;
                    case "hotdog":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Hotdog();
                        break;
                    case "woodenStaff":                      // Add this case
                        this.gp.obj[mapNum][mapIndex] = new OBJ_WoodenStaff();
                        break;
                    case "leatherRobe":                      // Add this case
                        this.gp.obj[mapNum][mapIndex] = new OBJ_LeatherRobe();
                        break;
                    case "robeOfElders":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_RobeOfElders();
                        break;
                    case "staffOfTrees":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_StaffOfTrees();
                        break;
                }
                if (this.gp.obj[mapNum][mapIndex]) {
                    this.gp.obj[mapNum][mapIndex].x = obj.x * this.gp.tileSize;
                    this.gp.obj[mapNum][mapIndex].y = obj.y * this.gp.tileSize;
                    mapIndex++;
                }
            });
        });
    }

    setNPC() {
        Object.keys(this.mapSetups).forEach(mapNum => {
            let mapIndex = 0;
            const setup = this.mapSetups[mapNum];
            
            setup.npcs?.forEach(npc => {
                if (npc.type === "oldman") {
                    this.gp.npc[mapNum][mapIndex] = new NPC_OldMan(this.gp);
                    this.gp.npc[mapNum][mapIndex].x = npc.x * this.gp.tileSize;
                    this.gp.npc[mapNum][mapIndex].y = npc.y * this.gp.tileSize;
                    mapIndex++;
                }
            });
        });
    }

    setMonster() {
        Object.keys(this.mapSetups).forEach(mapNum => {
            let mapIndex = 0;
            const setup = this.mapSetups[mapNum];
            
            setup.monsters?.forEach(monster => {
                if (monster.type === "slime") {
                    this.gp.monster[mapNum][mapIndex] = new MON_GreenSlime(this.gp);
                } else if (monster.type === "shootingSlime") {
                    this.gp.monster[mapNum][mapIndex] = new MON_ShootingSlime(this.gp);
                }
                if (this.gp.monster[mapNum][mapIndex]) {
                    this.gp.monster[mapNum][mapIndex].x = monster.x * this.gp.tileSize;
                    this.gp.monster[mapNum][mapIndex].y = monster.y * this.gp.tileSize;
                    mapIndex++;
                }
            });
        });
    }
}