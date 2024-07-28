import { PaintScene as MainGame } from './scenes/Game';
import { AUTO, Scale, Game, ScaleModes } from 'phaser';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

// export default new Game(config);
function getWidth() {
    return Math.max(
        document.body.scrollWidth,
        document.documentElement.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.offsetWidth,
        document.documentElement.clientWidth
    );
}

function getHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.documentElement.clientHeight
    );
}
window.addEventListener('load', () => {
    // const width = getWidth();
    // const height = getHeight();

    const width = 340;
    const height = 660;
    console.log(width, height);
    const config = {
        type: AUTO,
        width,
        height,
        backgroundColor: '#ffffff',
        scene: [
            MainGame
        ]
    };
    console.log('Game Config:', config);
    new Game(config);

}, false)