import { Scene } from 'phaser';

export class PaintScene extends Scene
{
    constructor ()
    {
        super('PaintScene');
        this.brushSize = 1;
        this.penDown = false;
        this.lastPos = null;
        this.graphics = null;
        this.curve = null;
        this.distance = 1;
        this.lineStyleSize = 1;
        this.brushColorNum = 0xff0000;
    }

    preload ()
    {
        this.load.image('pen', 'assets/pen.png');
        this.load.image('eraser', 'assets/eraser.png');
    }

    create ()
    {
        let config = this.game.config;
        let rect = this.add.rectangle(0,0, 50, 50, 0xff0000)
            .setOrigin(0);
        console.log(config)
        console.log(rect.getBounds());
        
    }
}
