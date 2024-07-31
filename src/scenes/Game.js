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
        // this.penColor = 0xff0000;
        // this.lastPenColor = 0xff0000;
        this.eraseColor = 0xffffff;
        this.penSelected = true;
        // this.rectColorActive = 0xa5a0a4;
        // this.rectColorInactive = 0xcfc9ce;
        this.rectColorActive = 0xcfc9ce;        
        this.rectColorInactive = 0xa5a0a4;
        this.currentBrushColor = 0xff0000;
    }

    preload() {
        this.load.image('pen', 'assets/pen.png');
        this.load.image('eraser', 'assets/eraser.png');
    }

    create() {
        
        let { containers} = this.createMainObjects();
        this.wireContainerEvents(containers);
        this.wireDrawingEvents();        
        this.createSliderAndSetupEvents();
        this.createColorPaletteAndSetupEvents();
    }

    createMainObjects() {
        // const scene = this;
        const config = this.game.config;
        
        this.rtPaintSurface = this.add.renderTexture(0,0, config.width, config.height)
            .setName('paint-surface')
            .setOrigin(0);
        
        this.rtColorRect = this.add.renderTexture(0,0, 24 ,24)
            .setOrigin(0)
            .setName('color-selection')

        const pen = this.add.image(0, 0, 'pen');
        const eraser = this.add.image(0, 0, 'eraser');
        const colorRect = this.add.rectangle(0, 0, 24, 24, 0xff0000)
            .setOrigin(0)
            .setStrokeStyle(1, 0x0);
        this.rtColorRect.draw(colorRect);
        colorRect.destroy();
        this.graphics = this.add.graphics();
        
        pen.setOrigin(0.5);
        eraser.setOrigin(0.5);
        pen.setScale(1.5);
        eraser.setScale(1.5);


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
        this.rtColorRect.setX(pen.x);
        this.rtColorRect.setY(pen.y);
        this.rtColorRect.setOrigin(0.5);
        
        const cont1 = this.add.container(0, 0, [
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorActive)
                .setVisible(true)
                .setOrigin(0)
                .setName('c1ra'),
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorInactive)
                .setOrigin(0)
                .setVisible(false)
                .setName('c1ri'),
            pen
        ]);
        // this.input.enableDebug(r1);
        
        cont1.name = 'pencil';

        const cont2 = this.add.container(xPos1b3, 0, [
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorActive)
                .setOrigin(0)
                .setVisible(false)
                .setName('c2ra'),
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorInactive)
                .setOrigin(0)
                .setVisible(true)
                .setName('c2ri'),
            eraser
        ]);

        cont2.name = 'eraser';

        const cont3 = this.add.container(xPos2b3, 0, [
            this.add.rectangle(0, 0, width1by3, rectBtnHeight, this.rectColorInactive)
                .setOrigin(0),
            this.rtColorRect
        ]);

        cont3.name = 'color';

        return {
            containers: [cont1, cont2, cont3]
        }
    }

    wireContainerEvents(containers) {
        containers.forEach(c => {
            const r = c.list[0];
            c.setInteractive({
                hitArea: c, hitAreaCallback: (hitArea, x, y, gameObject) => {
                    return Phaser.Geom.Rectangle.Contains(r, x, y);
                }
            });
            c.on('pointerup', () => {

                const cont1List = containers[0].list;
                const cont2List = containers[1].list;

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
                    // this.penColor = this.currentBrushColor;
                } else if(c.name === 'eraser') {
                    // deactive pencil
                    rc11.setVisible(false);
                    rc12.setVisible(true);
                    // activate eraser
                    rc21.setVisible(true);
                    rc22.setVisible(false);
                    this.penSelected = false;
                    // this.penColor = this.eraseColor;
                }
            });

        });
    }

    wireDrawingEvents() {
        this.input.on('pointerdown', (evt) => {
            this.lastPos = { x: evt.x, y: evt.y };
            this.curve = new Phaser.Curves.Spline([evt.x, evt.y]);
        });

        // first time set
        this.graphics.lineStyle(this.penSize * 1.5, this.penSelected ? this.currentBrushColor: this.eraseColor);

        this.input.on('pointermove', (evt) => {
            // console.log('pointermove', evt.x, evt.y);
            // debugger;
            if (evt.isDown && this.lastPos) {
                // console.log(evt.x, evt.y);
                // this.add.rectangle(evt.x, evt.y, this.brushSize, this.brushSize, 0xff0000);
                // console.log('pointermove - isDown', evt.x, evt.y, this.lastPos)
                if (Phaser.Math.Distance.Between(evt.x, evt.y, this.lastPos.x, this.lastPos.y) > this.distance) {
                    this.lastPos = { x: evt.x, y: evt.y };
                    this.curve.addPoint(evt.x, evt.y);
                    // this.graphics.lineStyle(this.penSize * 1.5, this.penColor);
                    // console.log('penSelected:', this.penSelected);
                    this.graphics.lineStyle(this.penSize * 1.5, this.penSelected ? this.currentBrushColor: this.eraseColor);

                    this.curve.draw(this.graphics, 32);
                }
            }
        });

        this.input.on('pointerup', () => {
            
            this.curve = null;

            // render it to the paint surface
            // and clear the graphics

            this.rtPaintSurface.draw(this.graphics, 0, 0);
            this.graphics.clear();
        });
    }

    createSliderAndSetupEvents() {
        const config = this.game.config;
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
        // const self = this;
        control.on('drag', (pointer, dragX, dragY) => {
            // debugger;
            control.x = Phaser.Math.Clamp(dragX, barBounds.x + 10, barBounds.x + barBounds.width - 10);
            // console.log(dragX);
            const percentage = control.x / barBounds.width;
            this.penSize = PMath.Interpolation.Linear(penSizeRange, percentage);
            // console.log('BrushSize:', self.penSize);
            this.graphics.lineStyle(this.penSize * 1.5, this.penSelected ? this.currentBrushColor : this.eraseColor);
        });

        // setting the slider to initial size
        control.x = PMath.Interpolation.Linear(
            [barBounds.x - 10, barBounds.x + barBounds.width - 10], 
            this.penSize / this.penSizeMax
        );
    }

    createColorPaletteAndSetupEvents() {
        // VIBGYOR -> ROYGBIV
        const config = this.game.config;
        const container = this.ctnrColorPalette = this.add.container(0, 100);
        container.setName('color-palette')
        container.setVisible(false);
        
        for(let i = 0; i < 7; i++) {

        }
    }
}
