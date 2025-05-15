import OBJ_Key from './OBJ_Key.js';

export default class OBJ_GreenKey extends OBJ_Key {
    constructor() {
        super();
        this.name = "green Key";
        this.type = "o";
        this.description = "A green key that can open blue locked doors.";
        this.image.src = './res/objects/GreenKey.png';
        this.color = "green";
        this.collision = true;
    }

    use(player) {
        // Keys don't have a direct use action from inventory
        // They're used automatically when interacting with locked objects
        return false;
    }
}