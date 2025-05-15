import OBJ_Key from './OBJ_Key.js';

export default class OBJ_RedKey extends OBJ_Key {
    constructor() {
        super();
        this.name = "red Key";
        this.type = "o";
        this.description = "A red key that can open red locked doors.";
        this.image.src = './res/objects/RedKey.png';
        this.color = "red";
        this.collision = true;
    }

    use(player) {
        // Keys don't have a direct use action from inventory
        // They're used automatically when interacting with locked objects
        return false;
    }
}