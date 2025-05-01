import SuperObject from './SuperObject.js';

export default class OBJ_Door extends SuperObject {
    constructor() {
        super();
        this.name = "Door";
        this.image = new Image();
        this.image.src = './res/objects/Door.png';
        this.collision = false;
        this.destinationMap = null;
        this.destinationX = null;
        this.destinationY = null;
    }
}