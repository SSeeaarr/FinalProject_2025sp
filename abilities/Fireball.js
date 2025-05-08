import Ability from './Ability.js';

export default class Fireball extends Ability {
    constructor(gp, player) {
        super(gp, player);
        this.name = "Fireball";
        this.cooldown = 2.0; // 2 seconds cooldown
        
        // Setup scaling values (fireballs scale primarily with strength)
        this.baseDamage = 2; // Base damage before scaling
        this.strengthScaling = 0.6; // 60% of strength added to damage
        this.attackScaling = 0.1; // 10% of attack added to damage
        
        this.speed = 500; // Pixels per second
        this.lifetime = 6; // How long each fireball lives in seconds
        
        // Load the image
        this.projectileImage = new Image();
        this.projectileImage.src = './res/monster/Projectile.png';
        this.icon = new Image();
        this.icon.src = './res/abilities/fireball_icon.png';
    }

    activate() {
        if (super.activate()) { // Checks if ability is ready and starts cooldown
            // Calculate direction based on player facing
            let dirX = 0;
            let dirY = 0;
            
            switch(this.player.direction) {
                case "up":
                    dirY = -1;
                    break;
                case "down":
                    dirY = 1;
                    break;
                case "left":
                    dirX = -1;
                    break;
                case "right":
                    dirX = 1;
                    break;
            }
            
            // Calculate starting position (center of player)
            const startX = this.player.x + this.gp.tileSize / 2 - 8;
            const startY = this.player.y + this.gp.tileSize / 2 - 8;
            
            // Calculate damage based on player stats
            const scaledDamage = this.calculateDamage();
            
            // Create new fireball instance with scaled damage
            this.instances.push(new FireballInstance(
                startX, 
                startY, 
                dirX, 
                dirY, 
                this.gp, 
                this.player,
                scaledDamage, // Use scaled damage
                this.speed,
                this.lifetime,
                this.projectileImage
            ));
            
            return true;
        }
        return false;
    }

    calculateDamage() {
        return this.baseDamage +
               (this.player.strength * this.strengthScaling) +
               (this.player.attack * this.attackScaling);
    }
}

class FireballInstance {
    constructor(x, y, directionX, directionY, gp, player, damage, speed, lifetime, image) {
        this.x = x;
        this.y = y;
        this.baseSpeed = speed;
        
        // Store normalized direction vector
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
        this.directionX = directionX / magnitude;
        this.directionY = directionY / magnitude;
        
        this.gp = gp;
        this.player = player;
        this.active = true;
        this.damage = damage;
        this.lifetime = lifetime;
        this.age = 0;
        this.image = image;
        
        this.width = 48;
        this.height = 48;
    }

    update() {
        // Update position using deltaTime for frame-rate independence
        const moveDistance = this.baseSpeed * this.gp.deltaTime;
        this.x += this.directionX * moveDistance;
        this.y += this.directionY * moveDistance;

        // Track lifetime
        this.age += this.gp.deltaTime;
        if (this.age >= this.lifetime) {
            this.active = false;
            return;
        }

        // Check collision with monsters
        this.gp.monster[this.gp.currentMap]?.forEach(monster => {
            if (monster && monster.alive && !monster.dying) {
                const monsterArea = {
                    x: monster.x + monster.solidArea.x,
                    y: monster.y + monster.solidArea.y,
                    width: monster.solidArea.width,
                    height: monster.solidArea.height
                };

                const fireballArea = {
                    x: this.x,
                    y: this.y,
                    width: this.width,
                    height: this.height
                };

                if (this.rectIntersect(monsterArea, fireballArea)) {
                    if (!monster.invincible) {
                        monster.takeDamage(this.damage);
                        this.active = false;
                    }
                }
            }
        });

        // Deactivate if out of bounds
        if (
            this.x < 0 || this.x > this.gp.screenWidth ||
            this.y < 0 || this.y > this.gp.screenHeight
        ) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (this.image.complete) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
    }

    rectIntersect(r1, r2) {
        return (
            r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r1.height > r2.y
        );
    }
}