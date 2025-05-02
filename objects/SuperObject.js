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
            ctx.drawImage(
                this.image, 
                this.x,      // Use actual pixel coordinates 
                this.y,      // Use actual pixel coordinates
                gp.tileSize, 
                gp.tileSize
            );
        }
    }
}