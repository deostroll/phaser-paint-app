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
        const pen = this.add.image(0, 0, 'pen');
        // console.log(this.game.config.width, this.game.config.height);
        const config = this.game.config;
        //
        this.add.rectangle(10, 10 , config.width - 10, config.height - 10 , 0x0000ff)
            .setOrigin(0);
        const line = this.add.line(0,0, 0,0, config.width, config.height, 0x0);
        console.log(line.getBounds());
        console.log(line.setOrigin(0,0))
        pen.scale = 1.5
        pen.visible = true;
        const container = this.add.container(100, 100, [pen]);
        // console.log(container.getBounds())
        const rect = this.add.rectangle(50, 50, 32, 32)
            .setOrigin(0);
        // rect.strokeColor = 0x8b7d7d;
        // rect.lineWidth = 1;
        // rect.fillColor = 0xfff;
        rect.setStrokeStyle(1, 0x8b7d7d);
        // console.log(pen.width, pen.height);
        console.log(pen);
        this.input.on('pointerdown', (evt) => {
            // this.isPenDown = true;
            console.log('pen down');
            this.lastPos = { x: evt.x, y: evt.y };
            this.curve = new Phaser.Curves.Spline([evt.x, evt.y]);
        });
        
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(this.lineStyleSize * 1.5, this.brushColorNum);
        this.input.on('pointermove', (evt) => {
            // console.log(evt);
            // debugger;
            if(evt.isDown) {
                // console.log(evt.x, evt.y);
                // this.add.rectangle(evt.x, evt.y, this.brushSize, this.brushSize, 0xff0000);
                if(Phaser.Math.Distance.Between(evt.x, evt.y, this.lastPos.x, this.lastPos.y) > this.distance) {
                    this.lastPos = { x: evt.x, y: evt.y };
                    this.curve.addPoint(evt.x, evt.y);
                    this.curve.draw(this.graphics, 512);               }
            }
        });

        this.input.on('pointerup', () => {
            this.graphics.save();
            this.curve = null;
        });


    }
}
