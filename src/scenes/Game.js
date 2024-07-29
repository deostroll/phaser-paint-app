import { Scene, Math as PMath } from 'phaser';

export class PaintScene extends Scene {
    constructor() {
        super('PaintScene');
        // this.brushSize = 1;
        this.penDown = false;
        this.lastPos = null;
        this.graphics = null;
        this.curve = null;
        this.distance = 1;
        this.penSize = 3;
        this.penSizeMax = 18;
        this.penColor = 0xff0000;
        this.lastPenColor = 0xff0000;
        this.eraseColor = 0xffffff;
        this.penSelected = true;
        // this.rectColorActive = 0xa5a0a4;
        // this.rectColorInactive = 0xcfc9ce;
        this.rectColorActive = 0xcfc9ce;        
        this.rectColorInactive = 0xa5a0a4;
    }

    preload() {
        this.load.image('pen', 'assets/pen.png');
        this.load.image('eraser', 'assets/eraser.png');
    }

    create() {
        const pen = this.add.image(0, 0, 'pen');
        const eraser = this.add.image(0, 0, 'eraser');
        const colorRect = this.add.rectangle(0, 0, 24, 24, 0xff0000);

        this.colorRect = colorRect;
        this.graphics = this.add.graphics();
        pen.setOrigin(0.5);
        eraser.setOrigin(0.5);
        pen.setScale(1.5);
        eraser.setScale(1.5);

        const config = this.game.config;

        let _1b3 = 1 / 3;
        let _2b3 = 2 / 3;

        let width1by3;
        let xPos1b3;
        width1by3 = xPos1b3 = _1b3 * config.width;
        const xPos2b3 = _2b3 * config.width;

        const rectBtnHeight = 50;

        pen.setX(width1by3 / 2);
        eraser.setX(width1by3 / 2);
        pen.setY(rectBtnHeight / 2);
        eraser.setY(rectBtnHeight / 2);
        colorRect.setX(pen.x);
        colorRect.setY(pen.y);
        colorRect.setOrigin(0.5);
        colorRect.setStrokeStyle(1.5, 0x000);

        const rc10 = this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorActive)
            .setVisible(true)
            .setOrigin(0)
        const rc11 = this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorInActive)
            .setOrigin(0)
            .setVisible(false)
        const cont1 = this.add.container(0, 0, [
            rc10,
            rc11,
            pen
        ]);
        // this.input.enableDebug(r1);
        cont1.name = 'pencil';

        const cont2 = this.add.container(xPos1b3, 0, [
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorActive)
                .setOrigin(0)
                .setVisible(false),
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorInactive)
                .setOrigin(0)
                .setVisible(true),
            eraser
        ]);

        cont2.name = 'eraser';

        const cont3 = this.add.container(xPos2b3, 0, [
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorInactive)
                .setOrigin(0),
            colorRect
        ]);

        cont3.name = 'color';

        [cont1, cont2, cont3].forEach(function (c) {
            // TODO write event handling for container
            // c.setSize(width1by3, 50);
            // console.log(c)
            const r = c.list[0];
            c.setInteractive({
                hitArea: c, hitAreaCallback: (hitArea, x, y, gameObject) => {
                    return Phaser.Geom.Rectangle.Contains(r, x, y);
                }
            });
            c.on('pointerup', function handleIconOrRectPointerUp(evt) {

                const cont1List = cont1.list;
                const cont2List = cont2.list;

                const rc11 = cont1List[0];
                const rc12 = cont1List[1];
                const rc21 = cont2List[0];
                const rc22 = cont2List[1];

                if(c.name === 'pencil' && r.visible && this.penSelected) {
                    // noop
                } else if(c.name === 'eraser' && r.visible && !this.penSelected) {
                    // noop
                } else if(c.name === 'pencil') {
                    // activate pencil
                    rc11.setVisible(true);
                    rc12.setVisible(false);
                    // deactivate eraser
                    rc21.setVisible(false);
                    rc22.setVisible(true);
                    this.penSelected = true;
                } else if(c.name === 'eraser') {
                    // deactive pencil
                    rc11.setVisible(false);
                    rc12.setVisible(true);
                    // activate eraser
                    rc21.setVisible(true);
                    rc22.setVisible(false);

                    this.penSelected = false;
                }
            });

        });

        this.input.on('pointerdown', (evt) => {
            this.lastPos = { x: evt.x, y: evt.y };
            this.curve = new Phaser.Curves.Spline([evt.x, evt.y]);
        });

        // first time set
        this.graphics.lineStyle(this.penSize * 1.5, this.penColor);

        this.input.on('pointermove', (evt) => {
            // console.log('pointermove', evt.x, evt.y);
            // debugger;
            if (evt.isDown) {
                // console.log(evt.x, evt.y);
                // this.add.rectangle(evt.x, evt.y, this.brushSize, this.brushSize, 0xff0000);
                // console.log('pointermove - isDown', evt.x, evt.y, this.lastPos)
                if (Phaser.Math.Distance.Between(evt.x, evt.y, this.lastPos.x, this.lastPos.y) > this.distance) {
                    this.lastPos = { x: evt.x, y: evt.y };
                    this.curve.addPoint(evt.x, evt.y);
                    // this.graphics.lineStyle(this.penSize * 1.5, this.penColor);

                    this.curve.draw(this.graphics, 512);
                }
            }
        });

        this.input.on('pointerup', () => {
            // console.log('pointerup');
            this.graphics.save();
            this.curve = null;
        });


        const slider = this.add.container(0, 50);
        const sliderHt = 50;
        // const barWidth = config.width - 2 * 25;
        const barHeight = 10;
        // const barYPos = sliderHt - 2 * barHeight;
        const barPadding = 10;
        const barWidth = config.width - 2 * barPadding;

        const penSizeRange = [1, 15];

        const bar = this.add.rectangle(config.width / 2, sliderHt / 2, barWidth, barHeight, 0xf0f0f0)
            .setOrigin(0.5)
            .setStrokeStyle(1, 0x0);
        // console.log(bar.getBounds());
        const control = this.add.circle(config.width / 2, 25, 10, this.rectColorInactive)
            .setOrigin(0.5)
            .setStrokeStyle(1, 0x0)

        const rbck = this.add.rectangle(0, 0, config.width, 50, 0xf567dd)
            .setOrigin(0);

        slider.add([rbck, bar, control]);
        // slider.add([ bar, control ]);

        control.setInteractive({ draggable: true });
        const barBounds = bar.getBounds();
        const self = this;
        control.on('drag', function (pointer, dragX, dragY) {
            // debugger;
            control.x = Phaser.Math.Clamp(dragX, barBounds.x + 10, barBounds.x + barBounds.width - 10);
            // console.log(dragX);
            const percentage = control.x / barBounds.width;
            self.penSize = PMath.Interpolation.Linear(penSizeRange, percentage);
            console.log('BrushSize:', self.penSize);
            self.graphics.lineStyle(self.penSize * 1.5, self.penColor);
        });

        // initialize the slider control to current pen size
        // control.x = Phaser.Math.Interpolation.Linear([barBounds.x, barBounds.x + barBounds.width], this.penSize/this.penSizeMax);
        // console.log(barBounds)
        control.x = PMath.Interpolation.Linear([barBounds.x - 10, barBounds.x + barBounds.width - 10], this.penSize / this.penSizeMax);
        // console.log(control.x)
        // console.log(Phaser);
        // // slider.setSize(400, 32);
        // slider.setInteractive({ draggable: true });

        // slider.on('drag', function (pointer, dragX, dragY) {

        //     slider.x = dragX;
        //     slider.y = dragY;

        // });


    }
}
