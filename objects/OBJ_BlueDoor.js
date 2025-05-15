import OBJ_Door from './OBJ_Door.js';

export default class OBJ_BlueDoor extends OBJ_Door {
    constructor() {
        super();
        this.name = "Blue Door";
        this.type = "p";
        this.image.src = './res/objects/BlueDoor.png';
        this.requiredKey = "blue";
        this.collision = true;
        this.opened = false; 
    }

    // In the use or interact method:
    use(player) {
        if (!this.opened) {
            // If already unlocking, don't proceed
            if (this.unlocking) return;
            
            // Check if player has key
            if (player.hasItem("Blue Key")) {
                // Handle chest opening logic (remove key, spawn loot, etc.)
                // ...existing chest opening code...
            } else {
                // Player doesn't have a key - use lock message type
                this.gp.ui.showMessage("You need a blue key to open this door!", "lock");
            }
        }
    }
}