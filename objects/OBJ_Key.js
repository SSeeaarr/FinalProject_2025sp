import SuperObject from './SuperObject.js';

export default class OBJ_Key extends SuperObject {
    constructor() {
        super();
        this.name = "Key";
        this.type = "key";  // Add this
        this.image = new Image();
        this.image.src = './res/objects/Key.png';
    }
}