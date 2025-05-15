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
import OBJ_Tree from '../objects/OBJ_Tree.js';
import OBJ_SnowTree from '../objects/OBJ_SnowTree.js';
import { TILE_TYPES } from '../TileTypes.js';
import OBJ_RedDoor from '../objects/OBJ_RedDoor.js';
import OBJ_BlueDoor from '../objects/OBJ_BlueDoor.js';
import OBJ_GreenDoor from '../objects/OBJ_GreenDoor.js';
import OBJ_PurpleDoor from '../objects/OBJ_PurpleDoor.js';
import OBJ_BlueKey from '../objects/OBJ_BlueKey.js';
import OBJ_GreenKey from '../objects/OBJ_GreenKey.js';
import OBJ_PurpleKey from '../objects/OBJ_PurpleKey.js';
import OBJ_RedKey from '../objects/OBJ_RedKey.js';
import UP_Arrow from '../objects/UP_Arrow.js';
import DOWN_Arrow from '../objects/DOWN_Arrow.js';
import RIGHT_Arrow from '../objects/RIGHT_Arrow.js';
import LEFT_Arrow from '../objects/LEFT_Arrow.js';
import MON_FinalBoss from '../monster/MON_FinalBoss.js';
import MON_Troll from '../monster/MON_Troll.js';
import MON_Spider from '../monster/MON_Spider.js';
import OBJ_DeadTree from '../objects/OBJ_DeadTree.js';
import MON_Bull from '../monster/MON_Bull.js';
import MON_BlueSlime from '../monster/MON_BlueSlime.js';
import MON_BlueShootingSlime from '../monster/MON_BlueShootingSlime.js';
import MON_Boss from '../monster/MON_Boss.js';
import OBJ_GreenRing from '../objects/OBJ_GreenRing.js';
import OBJ_GreenNecklace from '../objects/OBJ_GreenNecklace.js';
import OBJ_BlueRing from '../objects/OBJ_BlueRing.js';
import OBJ_BlueNecklace from '../objects/OBJ_BlueNecklace.js';
import OBJ_YellowRing from '../objects/OBJ_YellowRing.js';
import OBJ_YellowNecklace from '../objects/OBJ_YellowNecklace.js';
import MON_Crab from '../monster/MON_Crab.js';

export default class AssetSetter {
    constructor(gp) {
        this.gp = gp;
        
        // Define map configurations
        this.mapSetups = {
            "0": {  // First map
                monsters: [
                    //{ type: "bull", x: 20, y: 5 },
                    //{ type: "bslime", x: 20, y: 6 },
                    //{ type: "blueshootingSlime", x: 29, y: 8 },
                    //{ type: "boss", x: 20, y: 6 },
                ],
                trees: [
                    { x: 14, y: 5 },
                    { x: 13, y: 1 }, 
                    { x: 12, y: 1 }, 
                    { x: 13, y: 2 }, 
                    { x: 37, y: 7 }, 
                    { x: 36, y: 8 }, 
                    { x: 34, y: 7 },
                    { x: 28, y: 8 }, 
                    { x: 14, y: 1 }, 
                    { x: 1, y: 12 }, 
                    { x: 2, y: 13 }, 
                    { x: 1, y: 14 },
                    { x: 10, y: 19 }, 
                    { x: 11, y: 19 }, // Individual tree
                    { range: { startX: 25, endX: 30, startY: 6, endY: 16 } },
                    { range: { startX: 1, endX: 9, startY: 15, endY: 19 } }, // Second batch of trees
                    { x: 14, y: 5 }, // Individual tree
                    { range: { startX: 15, endX: 37, startY: 1, endY: 4 } }, // Batch of trees
                ],
                objects: [
                ],
            },  
            "1": {  
                monsters: [
                ],
                trees: [
                    { range: { startX: 12, endX: 16, startY: 3, endY: 7 } },
                    { range: { startX: 24, endX: 38, startY: 2, endY: 7 } },
                ],
                objects: [
                    { type: "door", x: 7, y: 6 },
                    { type: "door", x: 20, y: 9 },
                    { type: "greenring", x: 22, y: 3 },
                ],
                npcs: [
                    { type: "oldman", x: 20, y: 12 },
                ]
            },  
            "2": {  // Third map
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 20, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 }
                ],

                trees: [
                    
                    { range: { startX: 1, endX: 4, startY: 1, endY: 3, count: 15 } },
                    { range: { startX: 35, endX: 38, startY: 6, endY: 11, count: 15 } },
                    { range: { startX: 1, endX: 6, startY: 11, endY: 21, count: 15 } },
                    { range: { startX: 7, endX: 17, startY: 16, endY: 21, count: 15 } },
                    { range: { startX: 25, endX: 38, startY: 16, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 20, y: 6},
                ]
            },
            "3": {  
                monsters: [
                    { type: "shootingSlime", x: 29, y: 8 },
                    { type: "shootingSlime", x: 15, y: 18 },
                    { type: "shootingSlime", x: 10, y: 2 },
                    { type: "shootingSlime", x: 4, y: 10 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "shootingSlime", x: 14, y: 12 },
                ],
                trees: [
                ],
                objects: [
                    { type: "greennecklace", x: 2, y: 2 },
                ]
            },  
            "4": {  // HAS KEYS!!
                monsters: [
                    { type: "slime", x: 7, y: 6 },
                    { type: "slime", x: 22, y: 10 },
                    { type: "slime", x: 22, y: 12 },
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 14, y: 20 },
                ],
                trees: [
                    { range: { startX: 1, endX: 1, startY: 1, endY: 8, count: 15 } },
                    { range: { startX: 2, endX: 3, startY: 5, endY: 8, count: 15 } },
                    { range: { startX: 4, endX: 5, startY: 6, endY: 8, count: 15 } },
                    { range: { startX: 5, endX: 27, startY: 1, endY: 2, count: 15 } },
                    { range: { startX: 24, endX: 27, startY: 3, endY: 21, count: 15 } },
                    { range: { startX: 21, endX: 23, startY: 3, endY: 5, count: 15 } },
                    { range: { startX: 1, endX: 8, startY: 14, endY: 21, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 20, y: 14},
                    { type: "hotdog", x: 20, y: 15},
                    { type: "hotdog", x: 20, y: 16},
                    { type: "hotdog", x: 20, y: 17},
                ]
            },  
            "5": {  
                monsters: [
                    { type: "slime", x: 28, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    { range: { startX: 1, endX: 8, startY: 1, endY: 9, count: 15 } },
                    { range: { startX: 9, endX: 17, startY: 1, endY: 4, count: 15 } },
                    { range: { startX: 27, endX: 38, startY: 1, endY: 4, count: 15 } },
                    { range: { startX: 19, endX: 25, startY: 6, endY: 7, count: 15 } },
                    { range: { startX: 1, endX: 5, startY: 17, endY: 21, count: 15 } },
                    { range: { startX: 34, endX: 38, startY: 18, endY: 21, count: 15 } }
                ],
                objects: [
                ]
            },  
            "6": {  
                monsters: [
                    { type: "bull", x: 5, y: 5 },
                    { type: "bull", x: 10, y: 10 },
                    { type: "bull", x: 23, y: 5 },
                    { type: "bull", x: 5, y: 11 },
                    { type: "bull", x: 17, y: 17 },
                    { type: "bull", x: 11, y: 20 },
                    { type: "bull", x: 5, y: 17 },
                ],
                snowTree: [
                    { range: { startX: 1, endX: 6, startY: 18, endY: 21, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 20, y: 12},
                    { type: "hotdog", x: 20, y: 13},
                    { type: "hotdog", x: 21, y: 12},
                    { type: "hotdog", x: 21, y: 13},
                    { type: "hotdog", x: 22, y: 12},
                    { type: "hotdog", x: 22, y: 13},
                ]
            },  
            "7": {  
                monsters: [
                    { type: "troll", x: 38, y: 2 },
                    { type: "troll", x: 38, y: 3 },
                    { type: "troll", x: 38, y: 4 },
                    { type: "troll", x: 38, y: 5 },
                    { type: "troll", x: 38, y: 6 },
                    { type: "troll", x: 38, y: 15 },
                    { type: "troll", x: 38, y: 16 },
                    { type: "troll", x: 38, y: 17 },
                    { type: "troll", x: 38, y: 18 },
                    { type: "troll", x: 38, y: 19 },
                    { type: "troll", x: 38, y: 20 },
                ],
                trees: [
                    { snowRange: { startX: 1, endX: 6, startY: 15, endY: 21, count: 15 } },
                    { snowRange: { startX: 1, endX: 4, startY: 1, endY: 10, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12},
                    { type: "hotdog", x: 22, y: 13},
                    { type: "hotdog", x: 22, y: 11},
                    { type: "bluenecklace", x: 38, y: 1},

                ]
            },  
            "8": {  
                monsters: [
                    { type: "shootingSlime", x: 20, y: 5 },
                    { type: "shootingSlime", x: 13, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "shootingSlime", x: 21, y: 5 },
                    { type: "shootingSlime", x: 14, y: 11 },
                    { type: "shootingSlime", x: 35, y: 12 }
                ],
                trees: [
                    
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                ]
            },  
            "9": {  
                monsters: [
                    { type: "bslime", x: 20, y: 6 },
                    { type: "blueshootingSlime", x: 29, y: 8 },
                ],
                trees: [
                    { snowRange: { startX: 1, endX: 19, startY: 1, endY: 9, count: 15 } },
                    { snowRange: { startX: 34, endX: 38, startY: 1, endY: 10, count: 15 } },
                    { snowRange: { startX: 1, endX: 15, startY: 17, endY: 21, count: 15 } }
                ],
                objects: [
                ]
            },  
            "10": {  
                monsters: [
                    { type: "bslime", x: 20, y: 6 },
                    { type: "blueshootingSlime", x: 29, y: 8 },
                    { type: "troll", x: 4, y: 5 },
                    { type: "troll", x: 7, y: 14 },
                    { type: "troll", x: 28, y: 19 },
                ],
                trees: [
                ],
                objects: [
                ]
            },  
            "11": {  
                monsters: [
                    { type: "bslime", x: 20, y: 6 },
                    { type: "blueshootingSlime", x: 29, y: 4 },
                    { type: "blueshootingSlime", x: 2, y: 8 },
                    { type: "blueshootingSlime", x: 5, y: 12 },
                    { type: "blueshootingSlime", x: 8, y: 2 },
                    { type: "blueshootingSlime", x: 14, y: 19 },
                    { type: "blueshootingSlime", x: 17, y: 4 },
                    { type: "blueshootingSlime", x: 24, y: 15 },
                ],
                trees: [
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            },  
            "12": {  
                monsters: [
                    { type: "bslime", x: 20, y: 6 },
                    { type: "blueshootingSlime", x: 29, y: 8 },
                    { type: "troll", x: 4, y: 5 },
                    { type: "troll", x: 7, y: 14 },
                    { type: "troll", x: 28, y: 19 },
                ],
                trees: [
                ],
                objects: [
                ]
            },  
            "13": {  
                monsters: [
                    { type: "bslime", x: 20, y: 6 },
                    { type: "blueshootingSlime", x: 29, y: 8 },
                    { type: "troll", x: 28, y: 19 },
                ],
                trees: [
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            },  
            "14": {  
                monsters: [
                    { type: "bslime", x: 20, y: 3 },
                    { type: "bslime", x: 2, y: 16 },
                    { type: "bslime", x: 5, y: 13 },
                    { type: "bslime", x: 14, y: 2 },
                    { type: "bslime", x: 19, y: 6 },
                    { type: "bslime", x: 24, y: 8 },
                    { type: "bslime", x: 21, y: 6 },
                    { type: "bslime", x: 37, y: 8 },
                ],
                trees: [
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            },  
            "15": {  
                monsters: [
                    { type: "bslime", x: 20, y: 5 },
                    { type: "blueshootingSlime", x: 29, y: 8 },
                    { type: "blueshootingSlime", x: 37, y: 8 },
                    { type: "blueshootingSlime", x: 33, y: 8 },
                    { type: "boss", x: 28, y: 15 },
                    { type: "boss", x: 6, y: 18 },
                ],
                trees: [
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                    { type: "Blue Key", x: 20, y: 15, color: "blue" },
                ]
            },
            "16": {  
                monsters: [
                    { type: "troll", x: 38, y: 2 },
                    { type: "troll", x: 38, y: 3 },
                    { type: "troll", x: 38, y: 4 },
                    { type: "troll", x: 38, y: 5 },
                    { type: "troll", x: 38, y: 6 },
                    { type: "troll", x: 38, y: 15 },
                    { type: "troll", x: 38, y: 16 },
                    { type: "troll", x: 38, y: 17 },
                    { type: "troll", x: 38, y: 18 },
                    { type: "troll", x: 38, y: 19 },
                    { type: "troll", x: 38, y: 20 },
                    { type: "troll", x: 2, y: 2 },
                    { type: "troll", x: 2, y: 3 },
                    { type: "troll", x: 2, y: 4 },
                    { type: "troll", x: 2, y: 5 },
                    { type: "troll", x: 2, y: 6 },
                    { type: "troll", x: 2, y: 15 },
                    { type: "troll", x: 2, y: 16 },
                    { type: "troll", x: 2, y: 17 },
                    { type: "troll", x: 2, y: 18 },
                    { type: "troll", x: 2, y: 19 },
                    { type: "troll", x: 2, y: 20 },
                ],
                trees: [
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            }, 
            "17": {  
            monsters: [
                ],
                trees: [
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
        },
           "18": {  
                monsters: [
                    { type: "bslime", x: 20, y: 5 },
                    { type: "blueshootingSlime", x: 29, y: 8 },
                    { type: "troll", x: 38, y: 2 },
                    { type: "troll", x: 38, y: 3 },
                    { type: "troll", x: 38, y: 4 },
                    { type: "troll", x: 38, y: 5 },
                    { type: "troll", x: 38, y: 6 },
                    { type: "troll", x: 38, y: 15 },
                    { type: "troll", x: 38, y: 16 },
                    { type: "troll", x: 38, y: 17 },
                    { type: "troll", x: 38, y: 18 },
                    { type: "troll", x: 38, y: 19 },
                    { type: "troll", x: 38, y: 20 },
                    { type: "boss", x: 20, y: 6 },
                    { type: "boss", x: 20, y: 19 },
                ],
                trees: [
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                    { type: "Purple Key", x: 38, y: 12, color: "purple" },
                    { type: "bluering", x: 38, y: 14},
                ]
            },    
            "19": {  
                monsters: [
                ],
                objects: [
                ]
            },   
            "20": {  
                monsters: [
                ],
                objects: [
                    { type: "Green Door", x: 18, y: 6, requiredKey: "green"  },
                    { type: "Green Door", x: 19, y: 6, requiredKey: "green"  },

                    { type: "Blue Door", x: 18, y: 10, requiredKey: "blue"  },
                    { type: "Blue Door", x: 19, y: 10, requiredKey: "blue"  },

                    { type: "Red Door", x: 18, y: 14, requiredKey: "red"  },
                    { type: "Red Door", x: 19, y: 14, requiredKey: "red"  },

                    { type: "Purple Door", x: 18, y: 18, requiredKey: "purple"  },
                    { type: "Purple Door", x: 19, y: 18, requiredKey: "purple"  },
                ]
            },  
            "21": {  
                monsters: [
                    { type: "Final Boss", x: 10, y: 8 }
                ],
                objects: [
                ]
            },  
            "22": {  
                monsters: [
                    { type: "shootingSlime", x: 20, y: 5 },
                    { type: "shootingSlime", x: 13, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "bull", x: 2, y: 2 },
                    { type: "bull", x: 2, y: 19 },
                    { type: "bull", x: 38, y: 2 },
                    { type: "bull", x: 38, y: 19 },
                ],
                objects: [
                    { type: "DeadTree", x: 22, y: 18 },
                    { type: "DeadTree", x: 37, y: 7 },
                    { type: "DeadTree", x: 27, y: 6},
                    { type: "DeadTree", x: 36, y: 13 },
                    { type: "DeadTree", x: 20, y: 8 },
                    { type: "DeadTree", x: 4, y: 8 },
                    { type: "DeadTree", x: 13, y: 20 },
                ]
            },
            "23": {  
                monsters: [
                    { type: "shootingSlime", x: 20, y: 5 },
                    { type: "shootingSlime", x: 13, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "bull", x: 2, y: 2 },
                    { type: "bull", x: 2, y: 19 },
                    { type: "bull", x: 38, y: 2 },
                    { type: "bull", x: 38, y: 19 },
                ],
                objects: [
                    { type: "DeadTree", x: 22, y: 18 },
                    { type: "DeadTree", x: 37, y: 7 },
                    { type: "DeadTree", x: 27, y: 6},
                    { type: "DeadTree", x: 36, y: 13 },
                    { type: "DeadTree", x: 20, y: 8 },
                    { type: "DeadTree", x: 4, y: 8 },
                    { type: "DeadTree", x: 13, y: 20 },
                ]
            },
            "24": {  
                monsters: [
                    { type: "shootingSlime", x: 20, y: 5 },
                    { type: "shootingSlime", x: 13, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "bull", x: 2, y: 2 },
                    { type: "bull", x: 2, y: 19 },
                    { type: "bull", x: 38, y: 2 },
                    { type: "bull", x: 38, y: 19 },
                ],
                objects: [
                    { type: "DeadTree", x: 22, y: 18 },
                    { type: "DeadTree", x: 37, y: 7 },
                    { type: "DeadTree", x: 27, y: 6},
                    { type: "DeadTree", x: 36, y: 13 },
                    { type: "DeadTree", x: 20, y: 8 },
                    { type: "DeadTree", x: 4, y: 8 },
                    { type: "DeadTree", x: 13, y: 20 },
                ]
            },
            "25": {  
                monsters: [
                    { type: "shootingSlime", x: 20, y: 5 },
                    { type: "shootingSlime", x: 13, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "shootingSlime", x: 20, y: 6 },
                    { type: "shootingSlime", x: 13, y: 12 },
                    { type: "shootingSlime", x: 34, y: 13 },
                    { type: "bull", x: 2, y: 2 },
                    { type: "bull", x: 2, y: 19 },
                    { type: "bull", x: 38, y: 2 },
                    { type: "bull", x: 38, y: 19 },
                    { type: "bull", x: 3, y: 2 },
                    { type: "bull", x: 3, y: 19 },
                    { type: "bull", x: 37, y: 2 },
                    { type: "bull", x: 37, y: 19 },
                ],
                objects: [
                    { type: "DeadTree", x: 22, y: 18 },
                    { type: "DeadTree", x: 37, y: 7 },
                    { type: "DeadTree", x: 27, y: 6},
                    { type: "DeadTree", x: 36, y: 13 },
                    { type: "DeadTree", x: 20, y: 8 },
                    { type: "DeadTree", x: 4, y: 8 },
                    { type: "DeadTree", x: 13, y: 20 },
                    { type: "yellowring", x: 38, y: 12 },
                ]
            },
            "26": {  
                monsters: [
                    { type: "shootingSlime", x: 20, y: 5 },
                    { type: "shootingSlime", x: 13, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "shootingSlime", x: 20, y: 6 },
                    { type: "shootingSlime", x: 13, y: 12 },
                    { type: "shootingSlime", x: 34, y: 13 },
                    { type: "bull", x: 2, y: 2 },
                    { type: "bull", x: 2, y: 19 },
                    { type: "bull", x: 38, y: 2 },
                    { type: "bull", x: 38, y: 19 },
                    { type: "bull", x: 3, y: 2 },
                    { type: "bull", x: 3, y: 19 },
                    { type: "bull", x: 37, y: 2 },
                    { type: "bull", x: 37, y: 19 },
                ],
                objects: [
                    { type: "DeadTree", x: 22, y: 18 },
                    { type: "DeadTree", x: 37, y: 7 },
                    { type: "DeadTree", x: 27, y: 6},
                    { type: "DeadTree", x: 36, y: 13 },
                    { type: "DeadTree", x: 20, y: 8 },
                    { type: "DeadTree", x: 4, y: 8 },
                    { type: "DeadTree", x: 13, y: 20 },
                    { type: "yellownecklace", x: 20, y: 20 },
                ]
            },
            "27": {  
                monsters: [
                    { type: "shootingSlime", x: 20, y: 5 },
                    { type: "shootingSlime", x: 13, y: 11 },
                    { type: "shootingSlime", x: 34, y: 12 },
                    { type: "shootingSlime", x: 20, y: 6 },
                    { type: "shootingSlime", x: 13, y: 12 },
                    { type: "shootingSlime", x: 34, y: 13 },
                    { type: "bull", x: 2, y: 2 },
                    { type: "bull", x: 2, y: 19 },
                    { type: "bull", x: 38, y: 2 },
                    { type: "bull", x: 38, y: 19 },
                    { type: "bull", x: 3, y: 2 },
                    { type: "bull", x: 3, y: 19 },
                    { type: "bull", x: 37, y: 2 },
                    { type: "bull", x: 37, y: 19 },
                    { type: "boss", x: 20, y: 6 },
                    { type: "boss", x: 20, y: 7 },
                ],
                objects: [
                    { type: "DeadTree", x: 22, y: 18 },
                    { type: "DeadTree", x: 37, y: 7 },
                    { type: "DeadTree", x: 27, y: 6},
                    { type: "DeadTree", x: 36, y: 13 },
                    { type: "DeadTree", x: 20, y: 8 },
                    { type: "DeadTree", x: 4, y: 8 },
                    { type: "DeadTree", x: 13, y: 20 },
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "Red Key", x: 35, y: 3 }
                ],
            },
            "28": {  
                monsters: [
                    { type: "crab", x: 20, y: 10 },
                    { type: "crab", x: 13, y: 11 },
                    { type: "crab", x: 34, y: 12 }
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            },
            "29": {  
                monsters: [
                    { type: "crab", x: 20, y: 5 },
                    { type: "crab", x: 13, y: 11 },
                    { type: "crab", x: 34, y: 12 }
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            },
            "30": {  
                monsters: [
                    { type: "crab", x: 20, y: 5 },
                    { type: "crab", x: 13, y: 11 },
                    { type: "crab", x: 34, y: 12 }
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            },
            "31": {  
                monsters: [
                    { type: "crab", x: 20, y: 5 },
                    { type: "crab", x: 13, y: 11 },
                    { type: "crab", x: 34, y: 12 }
                ],
                objects: [
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
            },
            "32": {  
                monsters: [
                    { type: "crab", x: 38, y: 2 },
                    { type: "crab", x: 37, y: 2 },
                    { type: "crab", x: 36, y: 2 },
                    { type: "crab", x: 35, y: 2 },
                    { type: "crab", x: 34, y: 2 },
                    { type: "crab", x: 33, y: 2 },
                    { type: "crab", x: 32, y: 2 },
                    { type: "crab", x: 31, y: 2 },
                    { type: "crab", x: 31, y: 17 },
                    { type: "crab", x: 32, y: 17 },
                    { type: "crab", x: 33, y: 17 },
                    { type: "crab", x: 34, y: 17 },
                    { type: "crab", x: 35, y: 17 },
                    { type: "crab", x: 36, y: 17 },
                    { type: "crab", x: 37, y: 17 },
                    { type: "crab", x: 38, y: 17 },
                    { type: "crab", x: 30, y: 2 },
                    { type: "crab", x: 30, y: 17 },
                    { type: "crab", x: 29, y: 2 },
                    { type: "crab", x: 28, y: 2 },
                    { type: "crab", x: 27, y: 2 },
                    { type: "crab", x: 26, y: 2 },
                    { type: "crab", x: 25, y: 2 },
                    { type: "crab", x: 24, y: 2 },
                    { type: "crab", x: 23, y: 2 },
                    { type: "crab", x: 22, y: 2 },
                    { type: "crab", x: 29, y: 17 },
                    { type: "crab", x: 28, y: 17 },
                    { type: "crab", x: 27, y: 17 },
                    { type: "crab", x: 26, y: 17 },
                    { type: "crab", x: 25, y: 17 },
                    { type: "crab", x: 24, y: 17 },
                    { type: "crab", x: 23, y: 17 },
                    { type: "crab", x: 22, y: 17 },
                    { type: "crab", x: 21, y: 2 },
                    { type: "crab", x: 21, y: 17 },
                    { type: "crab", x: 29, y: 2 },
                    { type: "crab", x: 20, y: 2 },
                    { type: "crab", x: 19, y: 2 },
                    { type: "crab", x: 18, y: 2 },
                    { type: "crab", x: 17, y: 2 },
                    { type: "crab", x: 16, y: 2 },
                    { type: "crab", x: 15, y: 2 },
                    { type: "crab", x: 14, y: 2 },
                    { type: "crab", x: 21, y: 17 },
                    { type: "crab", x: 20, y: 17 },
                    { type: "crab", x: 19, y: 17 },
                    { type: "crab", x: 18, y: 17 },
                    { type: "crab", x: 17, y: 17 },
                    { type: "crab", x: 16, y: 17 },
                    { type: "crab", x: 15, y: 17 },
                    { type: "crab", x: 14, y: 17 },
                    { type: "crab", x: 13, y: 2 },
                    { type: "crab", x: 21, y: 16 },
                    { type: "crab", x: 21, y: 15 },
                    { type: "crab", x: 21, y: 14 },
                    { type: "crab", x: 21, y: 13 },
                    { type: "crab", x: 21, y: 12 },
                    { type: "crab", x: 21, y: 11 },
                    { type: "crab", x: 21, y: 10 },
                    { type: "crab", x: 21, y: 9 },
                    { type: "crab", x: 21, y: 8 },
                ],
                objects: [
                    { type: "Green Key", x: 3, y: 14, color: "green" },
                ]
            },
            "33": {
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                objects: [
                    { type: "DeadTree", x: 22, y: 18 },
                    { type: "DeadTree", x: 37, y: 7 },
                    { type: "DeadTree", x: 27, y: 6},
                    { type: "DeadTree", x: 36, y: 13 },
                    { type: "DeadTree", x: 20, y: 8 },
                    { type: "DeadTree", x: 4, y: 8 },
                    { type: "DeadTree", x: 13, y: 20 },
                    { type: "hotdog", x: 3, y: 19},
                    { type: "hotdog", x: 5, y: 4},
                    { type: "hotdog", x: 8, y: 8},
                    { type: "hotdog", x: 14, y: 13},
                    { type: "hotdog", x: 19, y: 18},
                    { type: "hotdog", x: 25, y: 3},
                    { type: "hotdog", x: 30, y: 19},
                    { type: "hotdog", x: 35, y: 11},
                    { type: "hotdog", x: 38, y: 15},
                ]
                }
            }};

    addRandomTreesInRange(mapNum, startX, endX, startY, endY, treeCount) {
        const availableTiles = [];
    
        // Collect all available tiles in the given range
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const tileNum = this.gp.tileM.mapTileNum[mapNum]?.[x]?.[y];
                if (tileNum === TILE_TYPES.GRASS || tileNum === TILE_TYPES.SNOW) {
                    availableTiles.push({ x, y });
                } else {
                    console.log(`Skipping tile at (${x}, ${y}) with tileNum: ${tileNum}`);
                }
            }
        }
    
        // Ensure `this.gp.obj[mapNum]` is initialized
        if (!this.gp.obj[mapNum]) {
            this.gp.obj[mapNum] = [];
        }
    
        // Randomly select tiles to place trees
        for (let i = 0; i < treeCount && availableTiles.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            const { x, y } = availableTiles.splice(randomIndex, 1)[0]; // Remove selected tile
    
            console.log(`Placing random tree at map ${mapNum}, x: ${x}, y: ${y}`);
            const tree = new OBJ_Tree();
            tree.x = x * this.gp.tileSize;
            tree.y = y * this.gp.tileSize;
            this.gp.obj[mapNum].push(tree);
        }
    }
    addRandomSnowTreesInRange(mapNum, startX, endX, startY, endY, treeCount) {
        const availableTiles = [];

        // Collect all available tiles in the given range
        for (let x = startX; x <= endX; x++) {
            for (let y = startY; y <= endY; y++) {
                const tileNum = this.gp.tileM.mapTileNum[mapNum]?.[x]?.[y];
                if (tileNum === TILE_TYPES.GRASS || tileNum === TILE_TYPES.SNOW) {
                    availableTiles.push({ x, y });
                } else {
                    console.log(`Skipping tile at (${x}, ${y}) with tileNum: ${tileNum}`);
                }
            }
        }

        if (!this.gp.obj[mapNum]) {
            this.gp.obj[mapNum] = [];
        }

       
        for (let i = 0; i < treeCount && availableTiles.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * availableTiles.length);
            const { x, y } = availableTiles.splice(randomIndex, 1)[0]; // Remove selected tile

            console.log(`Placing Snow Tree at map ${mapNum}, x: ${x}, y: ${y}`);
            const snowTree = new OBJ_SnowTree();
            snowTree.x = x * this.gp.tileSize;
            snowTree.y = y * this.gp.tileSize;
            this.gp.obj[mapNum].push(snowTree);
        }
    }
    processTrees(setup, mapNum, mapIndex) {
        setup.trees?.forEach(tree => {
            if (tree.range) {
                for (let x = tree.range.startX; x <= tree.range.endX; x++) {
                    for (let y = tree.range.startY; y <= tree.range.endY; y++) {
                        const tileNum = this.gp.tileM.mapTileNum[mapNum]?.[x]?.[y];
                        if (tileNum === TILE_TYPES.GRASS || tileNum === TILE_TYPES.SNOW) {
                            console.log(`Placing tree at map ${mapNum}, x: ${x}, y: ${y}`);
                            this.gp.obj[mapNum][mapIndex] = new OBJ_Tree();
                            this.gp.obj[mapNum][mapIndex].x = x * this.gp.tileSize;
                            this.gp.obj[mapNum][mapIndex].y = y * this.gp.tileSize;
                            mapIndex++;
                        } else {
                            console.log(`Skipping tree at (${x}, ${y}) due to tile type: ${tileNum}`);
                        }
                    }
                }
            } else if (tree.randomRange) {
                const { startX, endX, startY, endY, count } = tree.randomRange;
                this.addRandomTreesInRange(mapNum, startX, endX, startY, endY, count);
            } else if (tree.snowRange) {
                for (let x = tree.snowRange.startX; x <= tree.snowRange.endX; x++) {
                    for (let y = tree.snowRange.startY; y <= tree.snowRange.endY; y++) {
                        const tileNum = this.gp.tileM.mapTileNum[mapNum]?.[x]?.[y];
                        if (tileNum === TILE_TYPES.GRASS || tileNum === TILE_TYPES.SNOW) {
                            console.log(`Placing Snow Tree at map ${mapNum}, x: ${x}, y: ${y}`);
                            this.gp.obj[mapNum][mapIndex] = new OBJ_SnowTree();
                            this.gp.obj[mapNum][mapIndex].x = x * this.gp.tileSize;
                            this.gp.obj[mapNum][mapIndex].y = y * this.gp.tileSize;
                            mapIndex++;
                        } else {
                            console.log(`Skipping Snow Tree at (${x}, ${y}) due to tile type: ${tileNum}`);
                        }
                    }
                }
            } else if (tree.snowRandomRange) {
                const { startX, endX, startY, endY, count } = tree.snowRandomRange;
                this.addRandomSnowTreesInRange(mapNum, startX, endX, startY, endY, count);
            } else {
                console.log(`Placing individual tree at map ${mapNum}, x: ${tree.x}, y: ${tree.y}`);
                this.gp.obj[mapNum][mapIndex] = new OBJ_Tree();
                this.gp.obj[mapNum][mapIndex].x = tree.x * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].y = tree.y * this.gp.tileSize;
                mapIndex++;
            }
        });
        return mapIndex;
    }
    

    setObject() {
        
        Object.keys(this.mapSetups).forEach(mapNum => {
            if (!this.gp.obj[mapNum]) {
                this.gp.obj[mapNum] = [];
            }
        });

       
        Object.keys(mapConnections).forEach(mapNum => {
            let mapIndex = 0; 
            
            mapConnections[mapNum].doors?.forEach(doorConfig => {
                this.gp.obj[mapNum][mapIndex] = new OBJ_Door();
                this.gp.obj[mapNum][mapIndex].x = doorConfig.x * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].y = doorConfig.y * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].destinationMap = doorConfig.destinationMap;
                this.gp.obj[mapNum][mapIndex].destinationX = doorConfig.destinationX;
                this.gp.obj[mapNum][mapIndex].destinationY = doorConfig.destinationY;
                mapIndex++;
            });

            // Set uArrows
            mapConnections[mapNum].uArrow?.forEach(doorConfig => {
                this.gp.obj[mapNum][mapIndex] = new UP_Arrow();
                this.gp.obj[mapNum][mapIndex].x = doorConfig.x * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].y = doorConfig.y * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].destinationMap = doorConfig.destinationMap;
                this.gp.obj[mapNum][mapIndex].destinationX = doorConfig.destinationX;
                this.gp.obj[mapNum][mapIndex].destinationY = doorConfig.destinationY;
                mapIndex++;
            });
    
            // Set dArrows - continue from the current mapIndex
            mapConnections[mapNum].dArrow?.forEach(doorConfig => {
                this.gp.obj[mapNum][mapIndex] = new DOWN_Arrow();
                this.gp.obj[mapNum][mapIndex].x = doorConfig.x * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].y = doorConfig.y * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].destinationMap = doorConfig.destinationMap;
                this.gp.obj[mapNum][mapIndex].destinationX = doorConfig.destinationX;
                this.gp.obj[mapNum][mapIndex].destinationY = doorConfig.destinationY;
                mapIndex++;
            });

            // Set rArrows - continue from the current mapIndex
            mapConnections[mapNum].rArrow?.forEach(doorConfig => {
                this.gp.obj[mapNum][mapIndex] = new RIGHT_Arrow();
                this.gp.obj[mapNum][mapIndex].x = doorConfig.x * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].y = doorConfig.y * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].destinationMap = doorConfig.destinationMap;
                this.gp.obj[mapNum][mapIndex].destinationX = doorConfig.destinationX;
                this.gp.obj[mapNum][mapIndex].destinationY = doorConfig.destinationY;
                console.log(`Arrow created with Destination Map: ${this.gp.obj[mapNum][mapIndex].destinationMap}, X: ${this.gp.obj[mapNum][mapIndex].destinationX}, Y: ${this.gp.obj[mapNum][mapIndex].destinationY}`);
                mapIndex++;
            });

            // Set lArrows - continue from the current mapIndex
            mapConnections[mapNum].lArrow?.forEach(doorConfig => {
                this.gp.obj[mapNum][mapIndex] = new LEFT_Arrow();
                this.gp.obj[mapNum][mapIndex].x = doorConfig.x * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].y = doorConfig.y * this.gp.tileSize;
                this.gp.obj[mapNum][mapIndex].destinationMap = doorConfig.destinationMap;
                this.gp.obj[mapNum][mapIndex].destinationX = doorConfig.destinationX;
                this.gp.obj[mapNum][mapIndex].destinationY = doorConfig.destinationY;
                console.log(`Arrow created with Destination Map: ${this.gp.obj[mapNum][mapIndex].destinationMap}, X: ${this.gp.obj[mapNum][mapIndex].destinationX}, Y: ${this.gp.obj[mapNum][mapIndex].destinationY}`);
                mapIndex++;
            });
        }); 

        
        Object.keys(this.mapSetups).forEach(mapNum => {
            let mapIndex = this.gp.obj[mapNum]?.length || 0;  // Start after doors /////////////////////// IMPORTANT TO SET ITEMS UP HERE TOOO!!!!!
            const setup = this.mapSetups[mapNum];

            // Process trees
            mapIndex = this.processTrees(setup, mapNum, mapIndex);
            
            setup.objects?.forEach(obj => {
                switch(obj.type) {
                    case "key":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Key();
                        break;
                    case "door":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Door();
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
                    case "greenring":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_GreenRing();
                        break;
                    case "greennecklace":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_GreenNecklace();
                        break;
                    case "bluering":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_BlueRing();
                        break;
                    case "bluenecklace":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_BlueNecklace();
                        break;
                    case "yellowring":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_YellowRing();
                        break;
                    case "yellownecklace":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_YellowNecklace();
                        break;
                    case "Tree":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Tree();
                        if (obj.size) {
                            this.gp.obj[mapNum][mapIndex].width *= obj.size;
                            this.gp.obj[mapNum][mapIndex].height *= obj.size;
                        }
                        break;
                    case "DeadTree":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_DeadTree();
                        if (obj.size) {
                            this.gp.obj[mapNum][mapIndex].width *= obj.size;
                            this.gp.obj[mapNum][mapIndex].height *= obj.size;
                        }
                        break;
                    case "Red Door":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_RedDoor();
                        if (obj.requiredKey) this.gp.obj[mapNum][mapIndex].requiredKey = obj.requiredKey;
                        break;
                    case "Blue Door":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_BlueDoor();
                        if (obj.requiredKey) this.gp.obj[mapNum][mapIndex].requiredKey = obj.requiredKey;
                        break;
                    case "Green Door":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_GreenDoor();
                        if (obj.requiredKey) this.gp.obj[mapNum][mapIndex].requiredKey = obj.requiredKey;
                        break;
                    case "Purple Door":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_PurpleDoor();
                        if (obj.requiredKey) this.gp.obj[mapNum][mapIndex].requiredKey = obj.requiredKey;
                        break;
                    case "Red Key":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_RedKey();
                        if (obj.color) this.gp.obj[mapNum][mapIndex].color = obj.color;
                        break;
                    case "Blue Key":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_BlueKey();
                        if (obj.color) this.gp.obj[mapNum][mapIndex].color = obj.color;
                        break;
                    case "Green Key":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_GreenKey();
                        if (obj.color) this.gp.obj[mapNum][mapIndex].color = obj.color;
                        break;
                    case "Purple Key":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_PurpleKey();
                        if (obj.color) this.gp.obj[mapNum][mapIndex].color = obj.color;
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
                    this.gp.npc[mapNum] = this.gp.npc[mapNum] || [];
                    this.gp.npc[mapNum][mapIndex] = new NPC_OldMan(this.gp);
                    this.gp.npc[mapNum][mapIndex].x = npc.x * this.gp.tileSize;
                    this.gp.npc[mapNum][mapIndex].y = npc.y * this.gp.tileSize;
                    mapIndex++;
                }
            });
        })
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
                } else if (monster.type === "Final Boss") {
                    this.gp.monster[mapNum][mapIndex] = new MON_FinalBoss(this.gp);
                } else if (monster.type === "troll") {
                    this.gp.monster[mapNum][mapIndex] = new MON_Troll(this.gp);
                } else if (monster.type === "spider") {
                    this.gp.monster[mapNum][mapIndex] = new MON_Spider(this.gp);
                } else if (monster.type === "bull") {
                    this.gp.monster[mapNum][mapIndex] = new MON_Bull(this.gp);
                } else if (monster.type === "bslime") {
                    this.gp.monster[mapNum][mapIndex] = new MON_BlueSlime(this.gp);
                } else if (monster.type === "blueshootingSlime") {
                    this.gp.monster[mapNum][mapIndex] = new MON_BlueShootingSlime(this.gp);
                } else if (monster.type === "boss") {
                    this.gp.monster[mapNum][mapIndex] = new MON_Boss(this.gp);
                } else if (monster.type === "crab") {
                    this.gp.monster[mapNum][mapIndex] = new MON_Crab(this.gp);
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