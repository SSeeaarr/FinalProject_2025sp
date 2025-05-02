import Equipment from './Equipment.js';

export default class OBJ_RobeOfElders extends Equipment {
    constructor() {
        super();
        this.name = "Robe of the Elders";
        this.equipType = "armor";
        this.defense = 3;
        this.description = "An ancient robe imbued with protective magic from forgotten elders";
        this.image = new Image();
        this.image.src = './res/objects/Robe_of_the_Elders.png';
    }
}