export default class OBJ_DeadTree extends SuperObject {
    constructor() {
        super();
        this.name = "Tree";
        this.type = "teleporter"; // Add this property to identify it as a teleporter
        this.image = new Image();
        this.image.src = './res/objects/Tree.png';
        this.collision = true;   // Set to false so player can walk on it
        this.destinationMap = null;
        this.destinationX = null;
        this.destinationY = null;
        this.width = 100; // Default width
        this.height = 100;
        this.image.onload = () => console.log('Tree image loaded successfully');
        this.image.onerror = () => console.error('Failed to load tree image');
    }
    draw(ctx) {
        // Draw the tree image using its custom width and height
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}