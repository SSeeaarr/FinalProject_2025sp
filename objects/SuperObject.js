export default class SuperObject {
    constructor() {
        this.name = "";
        this.image = null;
        this.collision = false;
        this.x = 0;
        this.y = 0;
        
        // Hitbox settings
        this.solidArea = {
            x: 0,
            y: 0,
            width: 48,
            height: 48
        };
        this.solidAreaDefaultX = 0;
        this.solidAreaDefaultY = 0;
    }

    draw(ctx, gp) {
        if (this.image && this.image.complete) {
            // Use the object's custom dimensions if defined
            const width = this.width || gp.tileSize;
            const height = this.height || gp.tileSize;
            
            // For tall objects like trees:
            // 1. Center horizontally on the tile
            // 2. Position the bottom of the object at the base tile position
            const xOffset = (width - gp.tileSize) / 2;
            const yOffset = height - gp.tileSize;
            
            ctx.drawImage(
                this.image, 
                this.x - xOffset,  // Center wider objects
                this.y - yOffset,  // Make tall objects grow upward from base
                width, 
                height
            );
            
            // Uncomment for debugging hitboxes
            /*
            ctx.strokeStyle = 'red';
            ctx.strokeRect(this.x, this.y, gp.tileSize, gp.tileSize);
            */
        }
    }
}