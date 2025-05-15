import OBJ_Key from './OBJ_Key.js';

export default class OBJ_PurpleKey extends OBJ_Key {
    constructor() {
        super();
        this.name = "purple Key";
        this.type = "o";
        this.description = "A purple key that can open blue locked doors.";
        this.image.src = './res/objects/PurpleKey.png';
        this.color = "purple";
        this.collision = true;
    }

    use(player) {
        // Keys don't have a direct use action from inventory
        // They're used automatically when interacting with locked objects
        return false;
    }
}