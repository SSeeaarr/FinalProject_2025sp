import Equipment from './Equipment.js';

export default class OBJ_GreenNecklace extends Equipment {
    constructor() {
        super();
        this.name = "Green Necklace";
        this.equipType = "armor";
        this.defense = 1;
        this.description = "A necklace from the far off shores of Weenieville";
        this.image = new Image();
        this.image.src = './res/objects/GreenNecklace1.png';
    }
}