import Equipment from './Equipment.js';

export default class OBJ_YellowRing extends Equipment {
    constructor() {
        super();
        this.name = "Yellow Ring";
        this.equipType = "weapon";
        this.attack = 3;
        this.description = "Thought to be buried deep within the sands.  How lucky!";
        this.image = new Image();
        this.image.src = './res/objects/YellowRing3.png';
    }
}