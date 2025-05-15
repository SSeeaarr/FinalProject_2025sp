import Equipment from './Equipment.js';

export default class OBJ_YellowNecklace extends Equipment {
    constructor() {
        super();
        this.name = "Yellow Necklace";
        this.equipType = "armor";
        this.defense = 3;
        this.description = "Just a cool yellow necklace tbh, thats it";
        this.image = new Image();
        this.image.src = './res/objects/YellowNecklace3.png';
    }
}