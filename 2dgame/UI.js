export default class UI {
    constructor(gp) {
        this.gp = gp;
        this.fontSize = 32;
        this.fontFamily = 'Arial';
        this.currentDialogue = '';
        this.commandNum = 0;

        // Load heart images directly
        this.heartFull = new Image();
        this.heartHalf = new Image();
        this.heartEmpty = new Image();

        // Point to the res folder for heart images
        this.heartFull.src = './res/objects/FullHeart.png';
        this.heartHalf.src = './res/objects/HalfHeart.png';
        this.heartEmpty.src = './res/objects/EmptyHeart.png';
    }

    draw(ctx) {
        ctx.font = `${this.fontSize}px ${this.fontFamily}`;
        ctx.fillStyle = 'white';

        if (this.gp.gameState === this.gp.playState) {
            this.drawPlayerLife(ctx);
        } else if (this.gp.gameState === this.gp.pauseState) {
            this.drawPlayerLife(ctx);
            this.drawPauseScreen(ctx);
        } else if (this.gp.gameState === this.gp.dialogueState) {
            this.drawPlayerLife(ctx);
            this.drawDialogueWindow(ctx);
        } else if (this.gp.gameState === this.gp.gameOverState) {
            this.drawGameOverScreen(ctx);
        }
    }

    drawPlayerLife(ctx) {
        let x = this.gp.tileSize / 2;
        let y = this.gp.tileSize / 2;
        let i = 0;
        
        // Set heart dimensions
        const heartWidth = this.gp.tileSize * 1.2;  
        const heartHeight = this.gp.tileSize * 1.2; 
        const heartSpacing = heartWidth + 10;       // Add some spacing between hearts

        // Draw max life (empty hearts)
        while (i < this.gp.player.maxLife / 2) {
            ctx.drawImage(this.heartEmpty, x, y, heartWidth, heartHeight);
            i++;
            x += heartSpacing;
        }

        // Draw current life (half/full hearts)
        x = this.gp.tileSize / 2;
        y = this.gp.tileSize / 2;
        i = 0;

        while (i < this.gp.player.life) {
            ctx.drawImage(this.heartHalf, x, y, heartWidth, heartHeight);
            i++;
            if (i < this.gp.player.life) {
                ctx.drawImage(this.heartFull, x, y, heartWidth, heartHeight);
            }
            i++;
            x += heartSpacing;
        }
    }

    drawPauseScreen(ctx) {
        const text = "PAUSED";
        const x = this.getXForCenteredText(ctx, text);
        const y = this.gp.screenHeight / 2;

        ctx.fillText(text, x, y);
    }

    drawDialogueWindow(ctx) {
        // Draw dialogue window
        let x = this.gp.tileSize * 2;
        let y = this.gp.tileSize * 2;
        let width = this.gp.screenWidth - (this.gp.tileSize * 4);
        let height = this.gp.tileSize * 4;

        // Draw window background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(x, y, width, height);

        // Draw window border
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);

        // Draw text
        ctx.fillStyle = 'white';
        x += this.gp.tileSize;
        y += this.gp.tileSize;
        
        // Split text into lines if it's too long
        const maxWidth = width - (this.gp.tileSize * 2);
        let words = this.currentDialogue.split(' ');
        let line = '';
        let lines = [];

        for (let word of words) {
            let testLine = line + word + ' ';
            if (ctx.measureText(testLine).width > maxWidth) {
                lines.push(line);
                line = word + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Draw each line
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + (i * 40));
        }
    }

    drawGameOverScreen(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, this.gp.screenWidth, this.gp.screenHeight);

        ctx.fillStyle = "white";
        ctx.font = "96px Arial";
        const text = "Game Over";
        const x = this.getXForCenteredText(ctx, text);
        const y = this.gp.screenHeight / 2;
        ctx.fillText(text, x, y);
    }

    drawSubWindow(ctx, x, y, width, height) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.84)";
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, 35);
        ctx.fill();

        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(x + 5, y + 5, width - 10, height - 10, 25);
        ctx.stroke();
    }

    getXForCenteredText(ctx, text) {
        const metrics = ctx.measureText(text);
        const textWidth = metrics.width;
        return this.gp.screenWidth / 2 - textWidth / 2;
    }
}