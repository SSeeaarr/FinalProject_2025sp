export default class GameDataService {
    constructor(gp) {
        this.gp = gp;
        this.apiEndpoint = 'https://91fbnp0fwe.execute-api.us-east-1.amazonaws.com/dev';
        this.playerData = null;
        this.autoSaveInterval = null;
    }

    async initialize() {
        try {
            // Get the player data from session storage first
            const storedData = sessionStorage.getItem('playerData');
            
            // If session storage has data, use it - BUT VALIDATE IT FIRST
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                
                // Check if the stored data is actually an error response
                if (parsedData.statusCode >= 400 || parsedData.body?.includes('error') || parsedData.body?.includes('success":false')) {
                    console.warn("Found error response in session storage, clearing it:", parsedData);
                    sessionStorage.removeItem('playerData');
                    
                    // Continue to fetch from API
                } else {
                    // Data seems valid
                    this.playerData = parsedData;
                    console.log("Game data service initialized from session storage:", this.playerData);
                    
                    // Start auto-save
                    this.startAutoSave();
                    
                    return true;
                }
            }
            
            // If no valid data in session, try to fetch from API
            console.log("No valid data in session storage, fetching from API...");
            const success = await this.fetchPlayerDataFromAPI();
            
            // If API call fails, create new player data
            if (!success) {
                console.log("Failed to load player data, creating default data");
                
                // Get current authenticated user
                const Auth = window.aws_amplify.Auth;
                const user = await Auth.currentAuthenticatedUser();
                
                // Create default player data
                this.playerData = this.createNewPlayerData(user);
                
                // Save to session storage
                sessionStorage.setItem('playerData', JSON.stringify(this.playerData));
                console.log("Created new player data:", this.playerData);
                
                // Start auto-save
                this.startAutoSave();
                
                return true;
            }
            
            if (success) {
                console.log("Successfully loaded player data from API");
                return true;
            } else {
                console.error("Could not load player data from session or API");
                return false;
            }
        } catch (error) {
            console.error("Error initializing game data service:", error);
            return false;
        }
    }

    async fetchPlayerDataFromAPI() {
        try {
            // Get current authenticated user
            const Auth = window.aws_amplify.Auth;
            const user = await Auth.currentAuthenticatedUser();
            const token = user.signInUserSession.idToken.jwtToken;
            const username = user.username;
            
            // Make sure email is properly retrieved
            if (!user.attributes || !user.attributes.email) {
                console.error("No email attribute found in user data");
                return false;
            }
            const email = user.attributes.email;
            
            console.log(`Fetching player data for user: ${username}, email: ${email}`);
            
            // Replace fetch call in fetchPlayerDataFromAPI
            const API = window.aws_amplify.API;
            try {
                const playerData = await API.get(
                    'GameAPI', // Replace with your API name from Amplify config
                    `/players/${username}?email=${encodeURIComponent(email)}`,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (!playerData) {
                    console.warn("Empty player data received from API");
                    return false;
                }
                
                // Store the player data
                this.playerData = playerData;
                
                // Update session storage
                sessionStorage.setItem('playerData', JSON.stringify(playerData));
                console.log("Updated session storage with player data from API");
                
                // Start auto-save
                this.startAutoSave();
                
                return true;
            } catch (error) {
                console.error("Error fetching player data from API:", error);
                return false;
            }
        } catch (error) {
            console.error("Error fetching player data from API:", error);
            return false;
        }
    }

    startAutoSave() {
        // Auto-save every 2 minutes
        this.autoSaveInterval = setInterval(() => {
            this.saveGameStats();
        }, 2 * 60 * 1000);
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
    }

    // Modify the applyPlayerDataToGame method to handle inventory and equipment
    applyPlayerDataToGame() {
        if (!this.playerData) {
            console.error("No player data to apply");
            return false;
        }
        
        // Apply stats from DynamoDB to the player
        const player = this.gp.player;
        
        console.log("Before applying data - Player stats:", {
            level: player.level,
            class: player.characterClass,
            strength: player.strength,
            attack: player.attack,
            defense: player.defense
        });
        
        // MODIFIED APPROACH:
        // 1. First determine if this is a new character or loaded character
        const isNewCharacter = !this.playerData.hasBeenPlayed;
        
        // 2. Set character class but WITHOUT APPLYING class stats
        const characterClass = this.playerData.class || "knight";
        console.log(`Setting character class to: ${characterClass} (New character: ${isNewCharacter})`);
        
        // 3. Reset equipment to avoid stacking bonuses
        player.currentWeapon = null;
        player.currentArmor = null;
        
        // 4. For NEW CHARACTERS ONLY: Set class through regular method to get default stats
        if (isNewCharacter) {
            player.setCharacterClass(characterClass);
            console.log("Applied default class stats for new character");
        } else {
            // For EXISTING characters, just set the class property WITHOUT default stats
            player.characterClass = characterClass;
            
            // Only load class sprites - don't apply stats
            try {
                player.loadClassSprites(characterClass);
                console.log(`Loaded sprites for class: ${characterClass}`);
            } catch (error) {
                console.error(`Error loading sprites for class ${characterClass}:`, error);
            }
            
            // Initialize class abilities but don't reset stats
            player.initClassAbility();
            
            // 5. NOW apply saved stats instead of class defaults
            player.baseAttack = this.playerData.baseAttack || 5;
            player.baseDefense = this.playerData.baseDefense || 0;
            player.attack = player.baseAttack;
            player.defense = player.baseDefense;
            player.level = this.playerData.level || 1;
            player.strength = this.playerData.strength || 5;
            player.dexterity = this.playerData.dexterity || 5;
            player.maxLife = this.playerData.maxLife || 100;
            player.life = this.playerData.life || player.maxLife;
            player.exp = this.playerData.exp || 0;
            player.nextLevelExp = this.playerData.nextLevelExp || this.calculateNextLevelExp(player.level);
            player.coin = this.playerData.coin || 100;
        }
        
        // 4. LOAD AND APPLY INVENTORY
        // First ensure inventory array exists with proper size
        player.maxInventorySize = 20; // Make sure this is defined

        // Restore inventory if available
        if (this.playerData.inventory && Array.isArray(this.playerData.inventory)) {
            // Make sure we're preserving null spaces in inventory
            console.log("Inventory data length before processing:", this.playerData.inventory.length);
            
            // Reset inventory to empty array with proper size
            player.inventory = Array(player.maxInventorySize).fill(null);
            
            // Only add actual items, preserve null slots
            this.playerData.inventory.forEach((itemData, index) => {
                if (itemData !== null && itemData !== undefined && index < player.maxInventorySize) {
                    player.inventory[index] = this.createItemFromData(itemData);
                }
            });
            
            // Log how many actual items were loaded
            const actualItems = player.inventory.filter(item => item !== null).length;
            console.log(`Restored ${actualItems} actual items to inventory (with ${player.maxInventorySize - actualItems} empty slots)`);
        }
        
        // 5. LOAD AND APPLY EQUIPMENT
        // Equip saved items
        if (this.playerData.equipment) {
            console.log("Restoring equipment:", this.playerData.equipment);
            
            // Equip weapon if exists in saved data
            if (this.playerData.equipment.weapon) {
                const weaponData = this.playerData.equipment.weapon;
                const weapon = this.createWeaponFromData(weaponData);
                this.equipItem(player, weapon);
            }
            
            // Equip armor if exists in saved data
            if (this.playerData.equipment.armor) {
                const armorData = this.playerData.equipment.armor;
                const armor = this.createArmorFromData(armorData);
                this.equipItem(player, armor);
            }
            
            // Add more equipment types as needed
        }
        
        console.log("After applying data - Player stats:", {
            level: player.level,
            class: player.characterClass,
            baseAttack: player.baseAttack,
            attack: player.attack,
            baseDefense: player.baseDefense,
            defense: player.defense,
            equipment: this.playerData.equipment
        });
        
        // Apply position and map as before
        if (this.playerData.positionX && this.playerData.positionY) {
            console.log(`Setting position to: ${this.playerData.positionX}, ${this.playerData.positionY}`);
            player.x = this.playerData.positionX;
            player.y = this.playerData.positionY;
        }
        
        if (this.playerData.currentMap !== undefined) {
            console.log(`Setting current map to: ${this.playerData.currentMap}`);
            this.gp.currentMap = this.playerData.currentMap;
        }
        
        return true;
    }

    // Update the createItemFromData method to handle image loading better
    createItemFromData(itemData) {
        if (!itemData) return null;
        
        // Create a basic item with image loading
        const item = {
            name: itemData.name || "Unknown Item",
            type: itemData.type || "item",
            description: itemData.description || "",
            value: itemData.value || 0,
            iconPath: itemData.iconPath || "./res/objects/Nothing.png", // Use a known working image as default
            attackValue: itemData.attackValue || 0,
            defenseValue: itemData.defenseValue || 0,
            imageLoaded: false // Track if image loaded successfully
        };
        
        // Create image object for UI display with error handling
        if (item.iconPath) {
            item.image = new Image();
            
            // Add load event handler
            item.image.onload = function() {
                item.imageLoaded = true;
                console.log(`Image loaded for ${item.name}`);
            };
            
            // Add error handler
            item.image.onerror = function() {
                console.warn(`Failed to load image for ${item.name} from ${item.iconPath}`);
                // Try a fallback image
                item.iconPath = "./res/objects/Nothing.png"; 
                item.image.src = item.iconPath;
            };
            
            // Start loading the image
            item.image.src = item.iconPath;
        }
        
        return item;
    }

    // Fix the createWeaponFromData method
    createWeaponFromData(weaponData) {
        if (!weaponData || !weaponData.name) {
            console.warn("Invalid weapon data received:", weaponData);
            return null;
        }
        
        // Create the weapon object first
        const weapon = {
            name: weaponData.name,
            type: 'weapon',
            attackValue: parseInt(weaponData.attackValue) || 5,
            description: weaponData.description || `A ${weaponData.name}`,
            iconPath: weaponData.iconPath || "./res/objects/Nothing.png"
        };
        
        // Then create image for UI
        if (weapon.iconPath) {
            weapon.image = new Image();
            weapon.image.src = weapon.iconPath;
        }
        
        console.log("Created weapon:", weapon);
        return weapon;
    }

    // Fix the createArmorFromData method
    createArmorFromData(armorData) {
        if (!armorData || !armorData.name) {
            console.warn("Invalid armor data received:", armorData);
            return null;
        }
        
        // Create the armor object first
        const armor = {
            name: armorData.name,
            type: 'armor',
            defenseValue: parseInt(armorData.defenseValue) || 3,
            description: armorData.description || `A ${armorData.name}`,
            iconPath: armorData.iconPath || "./res/objects/Nothing.png"
        };
        
        // Then create image for UI
        if (armor.iconPath) {
            armor.image = new Image();
            armor.image.src = armor.iconPath;
        }
        
        console.log("Created armor:", armor);
        return armor;
    }

    // Helper method to equip an item to player
    equipItem(player, item) {
        if (!item) return;
        
        if (item.type === 'weapon') {
            console.log(`Equipping weapon: ${item.name} with attack value ${item.attackValue}`);
            player.currentWeapon = item;
            player.attack = player.baseAttack + item.attackValue;
        } else if (item.type === 'armor') {
            console.log(`Equipping armor: ${item.name} with defense value ${item.defenseValue}`);
            player.currentArmor = item;
            player.defense = player.baseDefense + item.defenseValue;
        }
        // Add other equipment types as needed
    }

    // Add a helper method to calculate next level experience
    calculateNextLevelExp(level) {
        // Common RPG formula: base * level^exponent
        const baseExp = 100;
        const exponent = 1.5;
        return Math.floor(baseExp * Math.pow(level, exponent));
    }

    // Update saveGameStats method
    async saveGameStats() {
        try {
            // Get token as before
            const Auth = window.aws_amplify.Auth;
            const user = await Auth.currentAuthenticatedUser();
            const token = user.signInUserSession.idToken.jwtToken;
            const email = user.attributes.email;
            
            // Create player data as before
            const player = this.gp.player;
            
            const inventoryData = player.inventory ? 
                player.inventory.map(item => {
                    if (item === null || item === undefined) {
                        return null; // Explicitly return null for empty slots
                    }
                    
                    return {
                        name: item.name || "Unknown",
                        type: item.type || "item",
                        description: item.description || "",
                        value: item.value || 0,
                        iconPath: item.iconPath || "./res/objects/Nothing.png",
                        attackValue: item.attackValue || 0, // Save attack value if it exists
                        defenseValue: item.defenseValue || 0 // Save defense value if it exists
                    };
                }) : Array(player.maxInventorySize).fill(null);
                
            const equipmentData = {
                weapon: player.currentWeapon ? {
                    name: player.currentWeapon.name,
                    attackValue: player.currentWeapon.attackValue,
                    iconPath: player.currentWeapon.iconPath || "./res/objects/Nothing.png"
                } : null,
                armor: player.currentArmor ? {
                    name: player.currentArmor.name, 
                    defenseValue: player.currentArmor.defenseValue,
                    iconPath: player.currentArmor.iconPath || "./res/objects/Nothing.png"
                } : null,
            };
            
            const baseStats = {
                attack: player.baseAttack || 5,
                defense: player.baseDefense || 0
            };
            
            const updatedPlayerData = {
                ...this.playerData,
                hasBeenPlayed: true,  // Add this flag to track played characters
                level: player.level,
                strength: player.strength,
                dexterity: player.dexterity,
                attack: player.attack,
                defense: player.defense,
                baseAttack: baseStats.attack,     // Store base attack without equipment
                baseDefense: baseStats.defense,   // Store base defense without equipment 
                life: player.life,
                maxLife: player.maxLife,
                exp: player.exp,
                nextLevelExp: player.nextLevelExp || this.calculateNextLevelExp(player.level),
                coin: player.coin,
                class: player.characterClass,
                email: email, // Include email parameter
                positionX: player.x,
                positionY: player.y,
                currentMap: this.gp.currentMap,
                inventory: inventoryData,          // Add inventory
                equipment: equipmentData           // Add equipment
            };
            
            // Use a different authorization approach
            let response = await fetch(`${this.apiEndpoint}/players/${user.username}?email=${encodeURIComponent(email)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPlayerData)
            });
            
            // If still failing, try creating a new player
            if (!response.ok && response.status === 403) {
                console.log("POST failed with 403, trying to create a new player...");
                
                // Try a different endpoint
                response = await fetch(`${this.apiEndpoint}/players?email=${encodeURIComponent(email)}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedPlayerData)
                });
            }
            
            // Update session storage regardless of API success
            this.playerData = updatedPlayerData;
            sessionStorage.setItem('playerData', JSON.stringify(updatedPlayerData));
            
            // Show message based on API response
            if (response.ok) {
                this.gp.ui.showMessage("Game saved to cloud!");
            } else {
                this.gp.ui.showMessage("Game saved locally!");
            }
            
            return true;
        } catch (error) {
            console.error("Error saving game:", error);
            // Still update session storage on error
            sessionStorage.setItem('playerData', JSON.stringify(updatedPlayerData));
            this.gp.ui.showMessage("Game saved locally only!");
            return false;
        }
    }

    // Add this method to GameDataService
    createNewPlayerData(user) {
        // Create default player data for a new game
        return {
            username: user.username,
            email: user.attributes.email,
            class: "knight", // Default class
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
            hasBeenPlayed: false,
            inventory: [],
            equipment: {
                weapon: null,
                armor: null
            }
        };
    }
}