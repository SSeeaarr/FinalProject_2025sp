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
       

    }

    loadTileImages() {
        this.tile = [
            { image: this.setupTile('Grass1'), collision: false },     // 0 grass
            { image: this.setupTile('Bricks'), collision: true },     // 1 wall
            { image: this.setupTile('Water'), collision: true },      // 2 water
            { image: this.setupTile('Earth'), collision: false },     // 3 earth
            { image: this.setupTile('Tree'), collision: true },       // 4 tree
            { image: this.setupTile('Sand'), collision: false },      // 5 sand
            { image: this.setupTile('Snow'), collision: false },      // 6 snow
            { image: this.setupTile('Ice'), collision: false },        // 7 Ice
            { image: this.setupTile('StonePath'), collision: false },  // 8 Stone
            { image: this.setupTile('Dirt'), collision: false },         // 9 Dirt
            { image: this.setupTile('IcePath'), collision: false },         // 10 IcePath
            { image: this.setupTile('IceCube'), collision: true },         // 11 Dirt 
        ];
    }

    setupTile(imageName) {
        const img = new Image();
        img.src = `./res/tiles/${imageName}.png`;
        return img;
    }

    async loadMap(filePath, mapNum) {
        try {
            const response = await fetch(filePath);
            const data = await response.text();
            
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
                        
                        
                        // Use a default tile (0 = grass) for missing data
                        this.mapTileNum[mapNum][col][row] = 0;
                    } else {
                        // Parse the number, with error handling
                        const tileId = parseInt(numbers[col]);
                        if (isNaN(tileId)) {
                            
                            this.mapTileNum[mapNum][col][row] = 0; // Use default on error
                        } else {
                            this.mapTileNum[mapNum][col][row] = tileId;
                        }
                    }
                }
            }
            
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
        for (let row = 0; row < this.gp.maxScreenRow; row++) {
            for (let col = 0; col < this.gp.maxScreenCol; col++) {
                const tileNum = this.mapTileNum[this.gp.currentMap][col][row];
                
                // Calculate position with a small overlap (0.5px)
                const x = Math.floor(col * this.gp.tileSize);
                const y = Math.floor(row * this.gp.tileSize);
                
                // Draw the tile slightly larger to avoid gaps
                if (this.tile[tileNum] && this.tile[tileNum].image) {
                    ctx.drawImage(
                        this.tile[tileNum].image, 
                        x, 
                        y, 
                        this.gp.tileSize + 1, // Add 1px
                        this.gp.tileSize + 1  // Add 1px
                    );
                }
            }
        }
    }
}