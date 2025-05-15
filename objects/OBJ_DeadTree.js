import SuperObject from './SuperObject.js';

export default class OBJ_DeadTree extends SuperObject {
    constructor() {
        super(); // Call the parent constructor
        this.name = "DeadTree";
        this.collision = true;
        this.type = "obstacle";
        
        this.width = 72;  
        this.height = 96; 
        
        this.image = new Image();
        this.image.src = "./res/objects/DeadTree.png";
        
        // Set collision area
        this.solidArea = {
            x: 0,
            y: -30,
            width: 32,
            height: 25
        };
    }
}