import SuperObject from './SuperObject.js';

export default class OBJ_Key extends SuperObject {
    constructor() {
        super();
        this.name = "Key";
        this.type = "key"; // Keep as "key" type, not "equipment"
        this.description = "A key that can open locked doors and chests.";
        this.collision = true; // Enable collision so player can pick it up
        
        // Load the image
        this.image = new Image();
        this.image.src = './res/objects/key.png';
    }

    use(player) {
        // Keys don't have a direct use action from inventory
        // They're used automatically when interacting with locked objects
        return false;
    }
}