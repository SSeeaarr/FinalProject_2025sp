import Equipment from './Equipment.js';

export default class OBJ_WoodenStaff extends Equipment {
    constructor() {
        super();
        this.name = "Staff of Apprentices";
        this.equipType = "weapon";
        this.attack = 1;
        this.description = "A basic wooden staff for apprentice mages";
        this.image = new Image();
        this.image.src = './res/objects/Staff_of_Apprentices.png';
    }
}