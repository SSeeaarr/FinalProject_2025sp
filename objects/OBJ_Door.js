import SuperObject from './SuperObject.js';

export default class OBJ_Door extends SuperObject {
    constructor() {
        super();
        this.name = "Door";
        this.type = "teleporter"; // Add this property to identify it as a teleporter
        this.image = new Image();
        this.image.src = './res/objects/Door.png';
        this.collision = false;   // Set to false so player can walk on it
        this.destinationMap = null;
        this.destinationX = null;
        this.destinationY = null;
    }
}