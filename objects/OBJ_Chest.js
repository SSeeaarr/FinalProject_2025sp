import SuperObject from './SuperObject.js';

export default class OBJ_Chest extends SuperObject {
    constructor() {
        super();
        this.name = "Chest";
        this.type = "chest";  // Add this line to identify it as a chest
        this.image = new Image();
        this.image.src = './res/objects/Chest.png';
        this.collision = true;    // Start as solid
        this.opened = false;      // Track chest state
    }

    // In the use or interact method:
    use(player) {
        if (!this.opened) {
            // If already unlocking, don't proceed
            if (this.unlocking) return;
            
            // Check if player has key
            if (player.hasItem("Key")) {
                // Handle chest opening logic (remove key, spawn loot, etc.)
                // ...existing chest opening code...
            } else {
                // Player doesn't have a key - use lock message type
                this.gp.ui.showMessage("You need a key to open this chest!", "lock");
            }
        }
    }
}