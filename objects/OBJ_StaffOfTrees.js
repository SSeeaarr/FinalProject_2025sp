import Equipment from './Equipment.js';

export default class OBJ_StaffOfTrees extends Equipment {
    constructor() {
        super();
        this.name = "Staff of Trees";
        this.equipType = "weapon";
        this.attack = 3;
        this.description = "A powerful staff carved from ancient wood, channeling the strength of the forest";
        this.image = new Image();
        this.image.src = './res/objects/Staff_of_Trees.png';
    }
}