import SuperObject from './SuperObject.js';

export default class OBJ_Chest extends SuperObject {
    constructor() {
        super();
        this.name = "Chest";
        this.image = new Image();
        this.image.src = './res/objects/Chest.png';
        this.collision = true;    // Start as solid
        this.opened = false;      // Track chest state
    }
}