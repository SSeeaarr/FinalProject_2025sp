import Equipment from './Equipment.js';

export default class OBJ_LeatherRobe extends Equipment {
    constructor() {
        super();
        this.name = "Robe of Frail Light";
        this.equipType = "armor";
        this.defense = 1;
        this.description = "A simple leather robe offering basic protection";
        this.image = new Image();
        this.image.src = './res/objects/Robe_of_Frail_Light.png';
    }
}