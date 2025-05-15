import Equipment from './Equipment.js';

export default class OBJ_BlueRing extends Equipment {
    constructor() {
        super();
        this.name = "Blue Ring";
        this.equipType = "weapon";
        this.attack = 2;
        this.description = "Made of the mined out ice of the troll's mountain";
        this.image = new Image();
        this.image.src = './res/objects/BlueRing2.png';
    }
}