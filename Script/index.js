const canvas = document.getElementById('offCanvas');
const ctx = canvas.getContext('2d');
const rcanvas = document.getElementById('gameCanvas');
const rctx = rcanvas.getContext('2d');


import { Block } from './Abstract/Block.js';

import { GameLoop } from './GameSystem.js';
import { Util } from './Util.js';

import { UIManager, Panel } from './Manager/UIManger.js';
import { TileScreen } from './Panel/TestPanel.js';
import { GridManager } from './Manager/GridManager.js';
import { Player } from './Player.js';



export { rcanvas, rctx, canvas, ctx };

export { UIManager, Panel }; 
export { GridManager };

export { TileScreen };
export { GameLoop };
export { Util };
export { Block };
export { Player };


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
GameLoop.Instance();
new Player(2, 2);