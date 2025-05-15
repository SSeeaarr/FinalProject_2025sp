import Equipment from './Equipment.js';

export default class OBJ_BlueNecklace extends Equipment {
    constructor() {
        super();
        this.name = "Blue Necklace";
        this.equipType = "armor";
        this.defense = 2;
        this.description = "Only every 100 years can this be made";
        this.image = new Image();
        this.image.src = './res/objects/BlueNecklace2.png';
    }
}