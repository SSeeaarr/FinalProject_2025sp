import Equipment from './Equipment.js';

export default class OBJ_GreenRing extends Equipment {
    constructor() {
        super();
        this.name = "Green Ring";
        this.equipType = "weapon";
        this.attack = 1;
        this.description = "A ring dropped by a passerby, finders keepers!";
        this.image = new Image();
        this.image.src = './res/objects/GreenRing1.png';
    }
}