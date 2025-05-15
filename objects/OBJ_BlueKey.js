import OBJ_Key from './OBJ_Key.js';

export default class OBJ_BlueKey extends OBJ_Key {
    constructor() {
        super();
        this.name = "blue Key";
        this.type = "o";
        this.description = "A blue key that can open blue locked doors.";
        this.image.src = './res/objects/BlueKey.png';
        this.color = "blue";
        this.collision = true;
    }

    use(player) {
        // Keys don't have a direct use action from inventory
        // They're used automatically when interacting with locked objects
        return false;
    }
}