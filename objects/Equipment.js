import SuperObject from './SuperObject.js';

export default class Equipment extends SuperObject {
    constructor() {
        super();
        this.type = "equipment";
        this.equipType = "";
        this.attack = 0;
        this.defense = 0;
        this.description = "";
        this.collision = true; // Enable collision so player can pick it up
    }

    use(player) {
        player.equipItem(this);
        return true;
    }
}