export default class GameDataService {
    constructor(gp) {
        this.gp = gp;
        this.playerData = null;
    }

    async initialize() {
        try {
            console.log("Creating default player data (persistence disabled)");
            
            // Create default player data using the class selected on the start screen
            // Instead of hardcoding "knight"
            this.playerData = this.createNewPlayerData({
                username: "player",
                attributes: { email: "player@example.com" }
            });
            
            console.log("Created new player data:", this.playerData);
            return true;
        } catch (error) {
            console.error("Error initializing game data service:", error);
            return false;
        }
    }

    applyPlayerDataToGame() {
        if (!this.playerData) {
            console.error("No player data to apply");
            return false;
        }
        
        // Apply stats to the player
        const player = this.gp.player;
        
        // Preserve the selected class from the character selection screen
        // instead of using the saved class
        const characterClass = player.characterClass || "knight";
        console.log(`Using character class from selection: ${characterClass}`);
        
        // IMPORTANT: Explicitly initialize class abilities for ALL characters
        player.setCharacterClass(characterClass);
        
        // Make sure to call both ability initialization and sprite loading
        player.loadClassSprites();
        player.initClassAbility();
        console.log(`Initialized abilities for: ${characterClass}`);
        
        // Apply default starting position
        player.x = 400;
        player.y = 300;
        this.gp.currentMap = 0;
        
        return true;
    }

    // Create a new player data object with the class from selection screen
    createNewPlayerData(user) {
        // Get the class that was selected on the start screen
        // instead of hardcoding "knight"
        const characterClass = this.gp.player.characterClass || "knight";
        
        return {
            username: user.username,
            email: user.attributes.email,
            class: characterClass, // Use the actual selected class
            level: 1,
            strength: 3,
            dexterity: 1,
            attack: 5,
            defense: 3,
            baseAttack: 5,
            baseDefense: 3,
            life: 8,
            maxLife: 8,
            exp: 0,
            nextLevelExp: 5,
            coin: 0,
            inventory: [],
            equipment: {
                weapon: null,
                armor: null
            }
        };
    }

    // Simplified stubs for these methods
    createItemFromData(itemData) { return null; }
    createWeaponFromData(weaponData) { return null; }
    createArmorFromData(armorData) { return null; }
    equipItem(player, item) {}
    async saveGameStats() { return true; }
}