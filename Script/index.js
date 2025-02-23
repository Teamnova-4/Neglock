const canvas = document.getElementById('offCanvas');
const ctx = canvas.getContext('2d');
const rcanvas = document.getElementById('gameCanvas');
const rctx = rcanvas.getContext('2d');


import { Block } from './Blocks/Block.js';
import { DisappearBlock, GoalBlock, NormalBlock } from './Blocks/BlocksFile.js';

import { GameLoop } from './GameSystem.js';
import { Util } from './Util.js';

import { UIManager, Panel } from './Manager/UIManger.js';
import { TileScreen } from './Panel/TestPanel.js';
import { GridManager, GameMap } from './Manager/GridManager.js';
import { Player } from './Player.js';



export { rcanvas, rctx, canvas, ctx };

export { UIManager, Panel }; 
export { GridManager, GameMap };

export { TileScreen };
export { GameLoop };
export { Util };
export { Block, DisappearBlock, GoalBlock, NormalBlock };
export { Player };


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const player = new Player(0, 0);

/**
const map = new GameMap(10, 10);
map.blocksId = [
    " "," ", "B", "D", "B", "D", "B", "B", "B", "G",
    " "," ", "B", "N", "B", "N", "B", "B", "B", "B",
    " "," ", "B", "N", "B", "N", "B", "B", "B", "B",
    " "," ", "B", "N", "B", "N", "B", "B", "B", "B",
    " "," ", "B", "N", "B", "N", "B", "B", "B", "B",
    " "," ", "B", "N", "B", "N", "B", "B", "B", "B",
    " "," ", "B", "N", "B", "N", "B", "B", "B", "B",
    " "," ", "B", "N", "B", "N", "B", "B", "B", "B",
    " "," ", "B", "B", "B", "B", "B", "B", "B", "B",
    " ","N", "N", "N", "N", "N", "N", "N", "N", "G",
]
 */
const map = new GameMap(10, 10);
map.blocksId = [
    " "," ", " ", "       ", "      ", "      ", "      ", " ", " ", " ",
    " "," ", " ", "       ", "      ", "      ", "      ", " ", " ", " ",
    " "," ", " ", "n      ", "n     ", "n     ", "n     ", " ", " ", " ",
    " "," ", "n", "P      ", "G 12 0", "      ", "e 9 8", "n", " ", " ",
    " "," ", "n", "       ", "d 3 0 ", "      ", "      ", "n", " ", " ",
    " "," ", "n", "       ", "      ", "D 9 0 ", "      ", "n", " ", " ",
    " "," ", "n", "D 9 0  ", "      ", "      ", "      ", "n", " ", " ",
    " "," ", " ", "n      ", "n     ", "n     ", "n     ", " ", " ", " ",
    " "," ", " ", "       ", "      ", "      ", "      ", " ", " ", " ",
    " "," ", " ", "       ", "      ", "      ", "      ", " ", " ", " ",
]

GridManager.Instance().setMap(map);
GameLoop.Instance().start();