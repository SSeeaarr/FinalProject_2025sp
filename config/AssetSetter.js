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

export default class AssetSetter {
    constructor(gp) {
        this.gp = gp;
        
        // Define map configurations
        this.mapSetups = {
            "0": {  // First map
                monsters: [
                    { type: "slime", x: 15, y: 14 },
                    { type: "slime", x: 11, y: 11 },
                    { type: "shootingSlime", x: 38, y: 10 }
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
                    { x: 11, y: 19 }, // Individual tree //screen is 40 wide by 23 tall
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } },
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
                    { type: "slime", x: 20, y: 5 },
                    { type: "slime", x: 13, y: 11 },
                    { type: "slime", x: 34, y: 12 }
                ],
                trees: [
                    
                     { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } } //pretty good random I dont think it spawns on the borders.
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
                    { type: "slime", x: 34, y: 12 }
                ],

                trees: [
                    
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 }}
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
                    
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } }
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
                    
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } }
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
                    
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } }
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
                    
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } }
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
                    
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } }
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
                    
                    { type: "tree", randomRange: { startX: 1, endX: 39, startY: 2, endY: 19, count: 35 } }
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
                    
                    { type: "tree", randomRange: { startX: 3, endX: 45, startY: 3, endY: 19, count: 40 } }
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
                    
                     { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, // Batch of Snow Trees
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
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
                    
                     { snowRange: { startX: 5, endX: 10, startY: 5, endY: 10 } }, 
                    { snowRandomRange: { startX: 15, endX: 25, startY: 10, endY: 20, count: 5 } }
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

    isPositionAvailable(mapNum, tileX, tileY) {
        // Check if tile has collision
        const tileNum = this.gp.tileM.mapTileNum[mapNum]?.[tileX]?.[tileY];
        const tileCollision = this.gp.tileM.tile[tileNum]?.collision || false;
        
        if (tileCollision) {
            return false; // Tile itself has collision
        }
        
        // Check collision with existing objects
        const worldX = tileX * this.gp.tileSize;
        const worldY = tileY * this.gp.tileSize;
        
        // Check objects
        if (this.gp.obj[mapNum]) {
            for (let i = 0; i < this.gp.obj[mapNum].length; i++) {
                const obj = this.gp.obj[mapNum][i];
                if (!obj) continue;
                
                if (Math.abs(obj.x - worldX) < this.gp.tileSize && 
                    Math.abs(obj.y - worldY) < this.gp.tileSize) {
                    return false; // Object already here
                }
            }
        }
        
        // Check NPCs
        if (this.gp.npc[mapNum]) {
            for (let i = 0; i < this.gp.npc[mapNum].length; i++) {
                const npc = this.gp.npc[mapNum][i];
                if (!npc) continue;
                
                if (Math.abs(npc.x - worldX) < this.gp.tileSize && 
                    Math.abs(npc.y - worldY) < this.gp.tileSize) {
                    return false; // NPC already here
                }
            }
        }
        
        // Check monsters
        if (this.gp.monster[mapNum]) {
            for (let i = 0; i < this.gp.monster[mapNum].length; i++) {
                const monster = this.gp.monster[mapNum][i];
                if (!monster) continue;
                
                if (Math.abs(monster.x - worldX) < this.gp.tileSize && 
                    Math.abs(monster.y - worldY) < this.gp.tileSize) {
                    return false; // Monster already here
                }
            }
        }
        
        // Also avoid player starting position (for map 0)
        if (mapNum === "0") {
            // Avoid common starting areas (adjust based on your game)
            const startingX = 5; 
            const startingY = 5;
            if (Math.abs(tileX - startingX) < 3 && Math.abs(tileY - startingY) < 3) {
                return false; // Too close to player start
            }
        }
        
        return true; // Position is available
    }

    addRandomObstaclesInRange(mapNum, type, startX, endX, startY, endY, count, size) {
        if (!this.gp.obj[mapNum]) {
            this.gp.obj[mapNum] = [];
        }
        
        let obstaclesPlaced = 0;
        let attempts = 0;
        const maxAttempts = count * 10; // Avoid infinite loops
        
        while (obstaclesPlaced < count && attempts < maxAttempts) {
            attempts++;
            
            // Generate random position within range
            const tileX = Math.floor(startX + Math.random() * (endX - startX + 1));
            const tileY = Math.floor(startY + Math.random() * (endY - startY + 1));
            
            // Check if position is available
            if (this.isPositionAvailable(mapNum, tileX, tileY)) {
                // Create appropriate obstacle based on type
                let obstacle;
                switch(type) {
                    case "tree":
                        obstacle = new OBJ_Tree();
                        break;
                    case "snowTree":
                        obstacle = new OBJ_SnowTree();
                        break;
                    // Add other types as needed
                    default:
                        obstacle = new OBJ_Tree();
                }
                
                // Set position and add to map
                obstacle.x = tileX * this.gp.tileSize;
                obstacle.y = tileY * this.gp.tileSize;
                
                // Apply custom size if provided
                if (size) {
                    obstacle.width = obstacle.width * size;
                    obstacle.height = obstacle.height * size;
                }
                
                this.gp.obj[mapNum].push(obstacle);
                obstaclesPlaced++;
                
                console.log(`Placed ${type} at map ${mapNum}, x: ${tileX}, y: ${tileY}`);
            }
        }
        
        if (obstaclesPlaced < count) {
            console.warn(`Could only place ${obstaclesPlaced}/${count} ${type}s due to space constraints`);
        }
    }

    createObstacle(mapNum, mapIndex, type, x, y, size) {
        switch(type) {
            case "tree":
                this.gp.obj[mapNum][mapIndex] = new OBJ_Tree();
                break;
            case "snowTree":
                this.gp.obj[mapNum][mapIndex] = new OBJ_SnowTree();
                break;
            // Add other obstacle types as needed
            default:
                this.gp.obj[mapNum][mapIndex] = new OBJ_Tree(); // Default
        }
        
        // Set position
        this.gp.obj[mapNum][mapIndex].x = x * this.gp.tileSize;
        this.gp.obj[mapNum][mapIndex].y = y * this.gp.tileSize;
        
        // Apply custom size if provided
        if (size) {
            this.gp.obj[mapNum][mapIndex].width = this.gp.obj[mapNum][mapIndex].width * size;
            this.gp.obj[mapNum][mapIndex].height = this.gp.obj[mapNum][mapIndex].height * size;
        }
    }

    processObstacles(setup, mapNum, mapIndex) {
        setup.obstacles?.forEach(obstacle => {
            // Get the obstacle type and configuration
            const type = obstacle.type || "tree"; // Default to tree if not specified
            
            if (obstacle.range) {
                // Place obstacles in a continuous range
                for (let x = obstacle.range.startX; x <= obstacle.range.endX; x++) {
                    for (let y = obstacle.range.startY; y <= obstacle.range.endY; y++) {
                        if (this.isPositionAvailable(mapNum, x, y)) {
                            console.log(`Placing ${type} at map ${mapNum}, x: ${x}, y: ${y}`);
                            this.createObstacle(mapNum, mapIndex, type, x, y, obstacle.size);
                            mapIndex++;
                        }
                    }
                }
            } else if (obstacle.randomRange) {
                // Place obstacles randomly within a range
                const { startX, endX, startY, endY, count } = obstacle.randomRange;
                this.addRandomObstaclesInRange(mapNum, type, startX, endX, startY, endY, count, obstacle.size);
            } else {
                // Place individual obstacle
                if (this.isPositionAvailable(mapNum, obstacle.x, obstacle.y)) {
                    console.log(`Placing individual ${type} at map ${mapNum}, x: ${obstacle.x}, y: ${obstacle.y}`);
                    this.createObstacle(mapNum, mapIndex, type, obstacle.x, obstacle.y, obstacle.size);
                    mapIndex++;
                }
            }
        });
        return mapIndex;
    }

    processTrees(setup, mapNum, mapIndex) {
        setup.trees?.forEach(treeConfig => {
            // Handle individual trees
            if (treeConfig.x !== undefined && treeConfig.y !== undefined) {
                if (this.isPositionAvailable(mapNum, treeConfig.x, treeConfig.y)) {
                    // Determine if it's a snow tree based on type property
                    const treeType = treeConfig.type === "snowTree" ? "snowTree" : "tree";
                    this.createObstacle(mapNum, mapIndex, treeType, treeConfig.x, treeConfig.y, treeConfig.size);
                    mapIndex++;
                }
            } 
            // Handle regular tree ranges
            else if (treeConfig.range) {
                for (let x = treeConfig.range.startX; x <= treeConfig.range.endX; x++) {
                    for (let y = treeConfig.range.startY; y <= treeConfig.range.endY; y++) {
                        if (this.isPositionAvailable(mapNum, x, y)) {
                            this.createObstacle(mapNum, mapIndex, "tree", x, y, treeConfig.size);
                            mapIndex++;
                        }
                    }
                }
            } 
            // Handle snow tree ranges
            else if (treeConfig.snowRange) {
                for (let x = treeConfig.snowRange.startX; x <= treeConfig.snowRange.endX; x++) {
                    for (let y = treeConfig.snowRange.startY; y <= treeConfig.snowRange.endY; y++) {
                        if (this.isPositionAvailable(mapNum, x, y)) {
                            this.createObstacle(mapNum, mapIndex, "snowTree", x, y, treeConfig.size);
                            mapIndex++;
                        }
                    }
                }
            } 
            // Handle random tree ranges
            else if (treeConfig.randomRange) {
                const { startX, endX, startY, endY, count } = treeConfig.randomRange;
                this.addRandomObstaclesInRange(mapNum, "tree", startX, endX, startY, endY, count, treeConfig.size);
            } 
            // Handle random snow tree ranges
            else if (treeConfig.snowRandomRange) {
                const { startX, endX, startY, endY, count } = treeConfig.snowRandomRange;
                this.addRandomObstaclesInRange(mapNum, "snowTree", startX, endX, startY, endY, count, treeConfig.size);
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

        // Set up doors first
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

        // Process each map's objects
        Object.keys(this.mapSetups).forEach(mapNum => {
            let mapIndex = this.gp.obj[mapNum]?.length || 0;
            const setup = this.mapSetups[mapNum];

            // Process obstacles (including trees)
            mapIndex = this.processObstacles(setup, mapNum, mapIndex);
            
            // For backward compatibility, also process trees the old way
            if (setup.trees) {
                mapIndex = this.processTrees(setup, mapNum, mapIndex);
            }
            
            // Process other objects
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