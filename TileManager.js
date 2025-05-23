import { TILE_TYPES } from './TileTypes.js';

export default class TileManager {
    constructor(gp) {
        this.gp = gp;
        this.tile = [];
        // Initialize mapTileNum as 3D array for multiple maps
        this.mapTileNum = Array.from({ length: gp.maxMap }, () =>
            Array.from({ length: gp.maxScreenCol }, () =>
                Array.from({ length: gp.maxScreenRow }, () => 0)
            )
        );

        this.loadTileImages();
        this.loadMap('./res/maps/ForestMaps/map01.txt', 0);
        this.loadMap('./res/maps/ForestMaps/map02.txt', 1);
        this.loadMap('./res/maps/ForestMaps/map03.txt', 2);
        this.loadMap('./res/maps/ForestMaps/map04.txt', 3);
        this.loadMap('./res/maps/ForestMaps/map05.txt', 4);
        this.loadMap('./res/maps/ForestMaps/map06.txt', 5);
        this.loadMap('./res/maps/ForestMaps/map07.txt', 6);
        this.loadMap('./res/maps/ForestMaps/map08.txt', 7);
        this.loadMap('./res/maps/ForestMaps/map09.txt', 8);
        this.loadMap('./res/maps/SnowMaps/map10.txt', 9);
        this.loadMap('./res/maps/SnowMaps/map11.txt', 10);
        this.loadMap('./res/maps/SnowMaps/map12.txt', 11);
        this.loadMap('./res/maps/SnowMaps/map13.txt', 12);
        this.loadMap('./res/maps/SnowMaps/map14.txt', 13);
        this.loadMap('./res/maps/SnowMaps/map15.txt', 14);
        this.loadMap('./res/maps/SnowMaps/map16.txt', 15);
        this.loadMap('./res/maps/SnowMaps/map17.txt', 16);
        this.loadMap('./res/maps/SnowMaps/map18.txt', 17);
        this.loadMap('./res/maps/SnowMaps/map19.txt', 18);
        this.loadMap('./res/maps/FinalAreaMaps/FinalAreaEntrance.txt', 19);
        this.loadMap('./res/maps/FinalAreaMaps/FinalAreaCorridor.txt', 20);
        this.loadMap('./res/maps/FinalAreaMaps/FinalAreaFINALBOSSROOM.txt', 21);
        this.loadMap('./res/maps/DesertMaps/map22.txt', 22);
        this.loadMap('./res/maps/DesertMaps/map23.txt', 23);
        this.loadMap('./res/maps/DesertMaps/map24.txt', 24);
        this.loadMap('./res/maps/DesertMaps/map25.txt', 25);
        this.loadMap('./res/maps/DesertMaps/map26.txt', 26);
        this.loadMap('./res/maps/DesertMaps/map27.txt', 27);
        this.loadMap('./res/maps/BeachMaps/map30.txt', 28);
        this.loadMap('./res/maps/BeachMaps/map31.txt', 29);
        this.loadMap('./res/maps/BeachMaps/map32.txt', 30);
        this.loadMap('./res/maps/BeachMaps/map33.txt', 31);
        this.loadMap('./res/maps/BeachMaps/map34.txt', 32);
        this.loadMap('./res/maps/ForestMaps/map.67.txt', 33);
    }

    loadTileImages() {
        this.tile = [];
        this.tile[TILE_TYPES.GRASS] = { image: this.setupTile('Grass1'), collision: false }; //0
        this.tile[TILE_TYPES.BRICKS] = { image: this.setupTile('Bricks'), collision: true }; //1
        this.tile[TILE_TYPES.WATER] = { image: this.setupTile('Water'), collision: true }; //2
        this.tile[TILE_TYPES.EARTH] = { image: this.setupTile('Earth'), collision: false }; //3
        this.tile[TILE_TYPES.TREE] = { image: this.setupTile('Tree'), collision: true }; //4
        this.tile[TILE_TYPES.SAND] = { image: this.setupTile('Sand'), collision: false }; //5
        this.tile[TILE_TYPES.SNOW] = { image: this.setupTile('Snow'), collision: false }; //6
        this.tile[TILE_TYPES.ICE] = { image: this.setupTile('Ice'), collision: false }; //7
        this.tile[TILE_TYPES.STONE_PATH] = { image: this.setupTile('StonePath'), collision: false }; //8
        this.tile[TILE_TYPES.DIRT] = { image: this.setupTile('Dirt'), collision: false }; //9
        this.tile[TILE_TYPES.ICE_PATH] = { image: this.setupTile('IcePath'), collision: false }; //10
        this.tile[TILE_TYPES.ICE_CUBE] = { image: this.setupTile('IceCube'), collision: true }; //11
        this.tile[TILE_TYPES.MISC] = { image: this.setupTile('Dark_Bricks'), collision: true }; //12
        this.tile[TILE_TYPES.MISC2] = { image: this.setupTile('Red_Carpet_Left'), collision: false }; //13
        this.tile[TILE_TYPES.MISC3] = { image: this.setupTile('Red_Carpet_Right'), collision: false }; //14
        this.tile[TILE_TYPES.MISC4] = { image: this.setupTile('Dark'), collision: false }; //15
        this.tile[TILE_TYPES.MISC5] = { image: this.setupTile('House'), collision: true }; //16
        this.tile[TILE_TYPES.MISC6] = { image: this.setupTile('Window'), collision: true }; //17
        this.tile[TILE_TYPES.BEACHSAND] = { image: this.setupTile('BeachSand'), collision: false }; //18
        this.tile[TILE_TYPES.BEACHWATERDCRAB] = { image: this.setupTile('BeachWaterDCrab'), collision: false }; //19
        this.tile[TILE_TYPES.BEACHWATERD] = { image: this.setupTile('BeachWaterD'), collision: false }; //20
        this.tile[TILE_TYPES.BEACHWATERU] = { image: this.setupTile('BeachWaterU'), collision: false }; //21
        this.tile[TILE_TYPES.BEACHWATERL] = { image: this.setupTile('BeachWaterL'), collision: false }; //22
        this.tile[TILE_TYPES.BEACHWATERR] = { image: this.setupTile('BeachWaterR'), collision: false }; //23
        this.tile[TILE_TYPES.BEACHSTAR] = { image: this.setupTile('BeachStar'), collision: false }; //24
        this.tile[TILE_TYPES.BEACHSANDCO] = { image: this.setupTile('BeachSandCo'), collision: true }; //25
    }

    setupTile(imageName) {
        const img = new Image();
        img.src = `./res/tiles/${imageName}.png`;
        return img;
    }

    async loadMap(filePath, mapNum) {
         // <--- LOG 1: At the start of loadMap
        try {
            const response = await fetch(filePath);
             // <--- LOG 2: Response status
            if (!response.ok) {
                console.error(`Error loading map ${filePath}: ${response.status} ${response.statusText}`);
                return Promise.reject(response); // Propagate the error
            }
            const data = await response.text();
             // <--- LOG 3: First 100 chars of data

            const lines = data.split('\n');
            for (let row = 0; row < this.gp.maxScreenRow; row++) {
                // Make sure we have enough rows in the map file
                if (row >= lines.length) {
                    console.warn(`Map file ${filePath} has fewer rows than expected`);
                    break;
                }

                // Split by any whitespace (spaces, tabs) and filter out empty strings
                const numbers = lines[row].trim().split(/\s+/).filter(val => val !== '');

                for (let col = 0; col < this.gp.maxScreenCol; col++) {
                    // Make sure we have enough columns in this row
                    if (col >= numbers.length) {
                        console.warn(`Map file ${filePath} row ${row} has fewer columns than expected`);
                        console.log(`Expected grid size: ${this.gp.maxScreenRow}x${this.gp.maxScreenCol}`);
                        console.log(`Parsed map dimensions: ${lines.length} rows`);
                        // Use a default tile (0 = grass) for missing data
                        this.mapTileNum[mapNum][col][row] = 0;
                    } else {
                        // Parse the number, with error handling
                        const tileId = parseInt(numbers[col]);
                        if (isNaN(tileId)) {
                            console.warn(`Invalid tile ID at row ${row}, col ${col}: "${numbers[col]}"`);
                            console.log(`Expected grid size: ${this.gp.maxScreenRow}x${this.gp.maxScreenCol}`);
                            console.log(`Parsed map dimensions: ${lines.length} rows`);
                            this.mapTileNum[mapNum][col][row] = 0; // Use default on error
                        } else {
                            this.mapTileNum[mapNum][col][row] = tileId;
                        }
                    }
                }
            }
             // <--- LOG 4: On successful load
        } catch (e) {
            console.error(`Error loading map ${filePath}:`, e);
            // Load default map if file loading fails
            this.loadDefaultMap(mapNum);
        }
    }

    loadDefaultMap(mapNum) {
        // Create a simple border map as fallback
        for (let col = 0; col < this.gp.maxScreenCol; col++) {
            for (let row = 0; row < this.gp.maxScreenRow; row++) {
                if (col === 0 || col === this.gp.maxScreenCol - 1 || 
                    row === 0 || row === this.gp.maxScreenRow - 1) {
                    this.mapTileNum[mapNum][col][row] = 1; // wall
                } else {
                    this.mapTileNum[mapNum][col][row] = 0; // grass
                }
            }
        }
    }

    draw(ctx) {
        // Save the current context state
        ctx.save();
        
        // Disable image smoothing for crisp pixel art
        ctx.imageSmoothingEnabled = false;
        
        for (let row = 0; row < this.gp.maxScreenRow; row++) {
            for (let col = 0; col < this.gp.maxScreenCol; col++) {
                const tileNum = this.mapTileNum[this.gp.currentMap][col][row];
                
                // Ensure pixel-perfect alignment by using Math.floor
                const x = Math.floor(col * this.gp.tileSize);
                const y = Math.floor(row * this.gp.tileSize);
                
                // Draw the tile if image is loaded
                if (this.tile[tileNum] && this.tile[tileNum].image) {
                    // Make tiles slightly larger to eliminate gaps
                    ctx.drawImage(
                        this.tile[tileNum].image, 
                        x, 
                        y, 
                        this.gp.tileSize + 0.5, // Add a small overlap
                        this.gp.tileSize + 0.5  // Add a small overlap
                    );
                }
            }
        }
        
        // Restore the context state
        ctx.restore();
    }
}