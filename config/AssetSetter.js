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
import MON_Boss from '../monster/MON_Boss.js';
import MON_Spider from '../monster/MON_Spider.js';
import MON_Skeleton from '../monster/MON_Skeleton.js';
import MON_Troll from '../monster/MON_Troll.js';
import { mapConnections } from './MapConnections.js';
import OBJ_Tree from '../objects/OBJ_Tree.js';
import OBJ_SnowTree from '../objects/OBJ_SnowTree.js';
import { TILE_TYPES } from '../TileTypes.js';

export default class AssetSetter {
    constructor(gp) {
        this.gp = gp;
        
        // Define map configurations
        this.mapSetups = {
            "0": {  // First map
                monsters: [
                    { type: "slime", x: 15, y: 14 },
                    { type: "slime", x: 11, y: 11 },
                    { type: "shootingSlime", x: 20, y: 10 },
                    { type: "boss", x: 10, y: 10 }
                   
                ],
                objects: [
                    { type: "key", x: 5, y: 8 },
                    { type: "hotdog", x: 20, y: 18 },
                    { type: "hotdog", x: 15, y: 15 },
                    { type: "chest", x: 9, y: 9 },
                    { type: "woodenStaff", x: 7, y: 7 },
                    { type: "leatherRobe", x: 8, y: 7 },
                    { type: "robeOfElders", x: 10, y: 7 },
                    { type: "staffOfTrees", x: 12, y: 7 }
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
                    { range: { startX: 15, endX: 37, startY: 1, endY: 5 } }, // First batch of trees
                    { range: { startX: 25, endX: 30, startY: 10, endY: 15 } },
                    { range: { startX: 1, endX: 9, startY: 15, endY: 19 } }, // Second batch of trees
                    { x: 14, y: 5 }, // Individual tree
                    { range: { startX: 15, endX: 37, startY: 1, endY: 5 } }, // Batch of trees
                    { randomRange: { startX: 10, endX: 20, startY: 5, endY: 15, count: 10 } }, // Random trees
                   // Random Snow Trees
                ],
                npcs: [
                    { type: "oldman", x: 5, y: 5 }
                ]
            },  
            "1": {  
                monsters: [
                    { type: "skeleton", x: 20, y: 5 },
                    { type: "spider", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 15, startY: 10, endY: 20, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "2": {  // Third map
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 14, y: 11 },
                    { type: "troll", x: 34, y: 12 }
                ],

                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },
            "3": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "4": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "5": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "6": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "7": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "8": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "9": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 38, startY: 4, endY: 18, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "10": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 15, startY: 10, endY: 20, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "11": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 15, startY: 10, endY: 20, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "12": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "13": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "14": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },  
            "15": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },
            "16": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            }, 
            "17": {  
            monsters: [
                { type: "slime", x: 20, y: 5 },
                { type: "slime", x: 13, y: 11 },
                { type: "slime", x: 34, y: 12 }
            ],
            trees: [
                
                { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
            ],
            objects: [
                { type: "hotdog", x: 22, y: 12 },
                { type: "chest", x: 28, y: 14 }
            ]
        },
           "18": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            },     
            "19": {  
                monsters: [
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                    { randomRange: { startX: 5, endX: 15, startY: 10, endY: 20, count: 15 } }
                ],
                objects: [
                    { type: "hotdog", x: 22, y: 12 },
                    { type: "chest", x: 28, y: 14 }
                ]
            }  
        };
    }
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
                        console.log(`Placing tree at map ${mapNum}, x: ${x}, y: ${y}`);
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Tree();
                        this.gp.obj[mapNum][mapIndex].x = x * this.gp.tileSize;
                        this.gp.obj[mapNum][mapIndex].y = y * this.gp.tileSize;
                        mapIndex++;
                    }
                }
            } else if (tree.randomRange) {
             
                const { startX, endX, startY, endY, count } = tree.randomRange;
                this.addRandomTreesInRange(mapNum, startX, endX, startY, endY, count);
            } else if (tree.snowRange) {
               
                for (let x = tree.snowRange.startX; x <= tree.snowRange.endX; x++) {
                    for (let y = tree.snowRange.startY; y <= tree.snowRange.endY; y++) {
                        console.log(`Placing Snow Tree at map ${mapNum}, x: ${x}, y: ${y}`);
                        this.gp.obj[mapNum][mapIndex] = new OBJ_SnowTree();
                        this.gp.obj[mapNum][mapIndex].x = x * this.gp.tileSize;
                        this.gp.obj[mapNum][mapIndex].y = y * this.gp.tileSize;
                        mapIndex++;
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
                        case "Tree":
                        this.gp.obj[mapNum][mapIndex] = new OBJ_Tree();
                        if (obj.size) {
                            this.gp.obj[mapNum][mapIndex].width *= obj.size;
                            this.gp.obj[mapNum][mapIndex].height *= obj.size;
                        }
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
                    this.gp.monster[mapNum] = this.gp.monster[mapNum] || [];
                    this.gp.monster[mapNum][mapIndex] = new MON_GreenSlime(this.gp);
                } else if (monster.type === "shootingSlime") {
                    this.gp.monster[mapNum] = this.gp.monster[mapNum] || [];
                    this.gp.monster[mapNum][mapIndex] = new MON_ShootingSlime(this.gp);
                }  else if (monster.type === "boss") {
                    this.gp.monster[mapNum] = this.gp.monster[mapNum] || [];
                    this.gp.monster[mapNum][mapIndex] = new MON_Boss(this.gp);
                }  else if (monster.type === "skeleton") {
                    this.gp.monster[mapNum] = this.gp.monster[mapNum] || [];
                    this.gp.monster[mapNum][mapIndex] = new MON_Skeleton(this.gp);
                }  else if (monster.type === "spider") {
                    this.gp.monster[mapNum] = this.gp.monster[mapNum] || [];
                    this.gp.monster[mapNum][mapIndex] = new MON_Spider(this.gp);
                }  else if (monster.type === "troll") {
                    this.gp.monster[mapNum] = this.gp.monster[mapNum] || [];
                    this.gp.monster[mapNum][mapIndex] = new MON_Troll(this.gp);
                }
                if (this.gp.monster[mapNum][mapIndex]) {
                    this.gp.monster[mapNum][mapIndex].x = monster.x * this.gp.tileSize;
                    this.gp.monster[mapNum][mapIndex].y = monster.y * this.gp.tileSize;
                    mapIndex++;
                }
            });
        });
    }
    
    // Ensure proper closing of the class
}