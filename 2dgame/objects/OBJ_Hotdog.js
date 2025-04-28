import SuperObject from './SuperObject.js';

export default class OBJ_Hotdog extends SuperObject {
    constructor() {
        super();
        this.name = "Hotdog";
        this.type = "health";  // Add type for healing items
        this.healValue = 2;    // Amount of health to restore
        this.image = new Image();
        this.image.src = './res/objects/Hotdog.png';
    }
}