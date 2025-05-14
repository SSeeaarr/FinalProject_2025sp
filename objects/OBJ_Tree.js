import SuperObject from './SuperObject.js';

export default class OBJ_Tree extends SuperObject {
    constructor() {
        super(); // Call the parent constructor
        this.name = "Tree";
        this.collision = true;
        this.type = "obstacle";
        
        this.width = 72;  
        this.height = 96; 
        
        this.image = new Image();
        this.image.src = "./res/objects/Tree.png";
        
        // Set collision area
        this.solidArea = {
            x: 8,
            y: 16,
            width: 32,
            height: 32
        };
    }
}