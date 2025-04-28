export default class TileManager {
    constructor(gp) {
        this.gp = gp;
        this.tile = [];
        // Initialize mapTileNum as 3D array for multiple maps
        this.mapTileNum = Array(gp.maxMap).fill().map(() => 
            Array(gp.maxScreenCol).fill().map(() => 
                Array(gp.maxScreenRow).fill(0)
            )
        );

        this.loadTileImages();
        this.loadMap('./res/maps/map01.txt', 0);
        this.loadMap('./res/maps/map02.txt', 1);
    }

    loadTileImages() {
        this.tile = [
            { image: this.setupTile('Grass'), collision: false },     // 0 grass
            { image: this.setupTile('Bricks'), collision: true },     // 1 wall
            { image: this.setupTile('Water'), collision: true },      // 2 water
            { image: this.setupTile('Earth'), collision: false },     // 3 earth
            { image: this.setupTile('Tree'), collision: true },       // 4 tree
            { image: this.setupTile('Sand'), collision: false },      // 5 sand
            { image: this.setupTile('Snow'), collision: false },      // 6 snow
            { image: this.setupTile('Ice'), collision: false }        // 7 Ice
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
                const numbers = lines[row].trim().split(' ');
                for (let col = 0; col < this.gp.maxScreenCol; col++) {
                    this.mapTileNum[mapNum][col][row] = parseInt(numbers[col]);
                }
            }
        } catch (e) {
            console.error("Error loading map:", e);
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
                const x = col * this.gp.tileSize;
                const y = row * this.gp.tileSize;
                
                // Draw the tile if image is loaded
                if (this.tile[tileNum] && this.tile[tileNum].image) {
                    ctx.drawImage(
                        this.tile[tileNum].image, 
                        x, 
                        y, 
                        this.gp.tileSize, 
                        this.gp.tileSize
                    );
                }
            }
        }
    }
}