import SuperObject from './SuperObject.js';

export default class DOWN_Arrow extends SuperObject {
    constructor() {
        super();
        this.name = "DOWN";
        this.type = "teleporter"; // Add this property to identify it as a teleporter
        this.image = new Image();
        this.image.src = './res/objects/DOWN.png';
        this.collision = false;   // Set to false so player can walk on it
        this.destinationMap = null;
        this.destinationX = null;
        this.destinationY = null;
    }
}