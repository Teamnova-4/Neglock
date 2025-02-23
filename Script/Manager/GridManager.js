import { Block, canvas, Player, rcanvas, rctx, UIManager } from "../index.js";

export class GridManager{
    static instance;
    static cellSize = 15;
    static near = [
         { x: 0, y: -1 },
         { x: 0, y: 1 },
         { x: -1, y: 0 },
         { x: 1, y: 0 },
    ]
    constructor() {
        if (UIManager.instance){
            return UIManager.instance;
        }


        GridManager.instance = this;
        this.Initialize();
    }

    static Instance() {
        if (!GridManager.instance) {
            GridManager.instance = new GridManager();
        } 
        return GridManager.instance;
    }
    Initialize() {
        this.map = null;

        const map = new Map(10, 10);
        map.blocksId = [
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
            "N", "B", "B", "B", "B", "B", "B", "B", "B", "B",
        ]

        this.setMap(map);
    }


    setMap(map) {
        this.map = map;
        this.map.render();
    }

    // 그리드에 있는 모든 블록의 타이머 업데이트 및 상호작용 처리
    update() {
        this.interactWithNearBlock(Player.Instance().position.x, Player.Instance().position.y);
        this.map.blocks.forEach(block => {
            if (block){
                block.updateTimer();  // 타이머 갱신
            }
        });
    }

    // 그리드와 블록을 그리는 메서드
    draw() {
        this.map.blocks.forEach(block => {
            if (block){
                block.draw();  // 블록 그리기
            }
        });
    }

    interactWithNearBlock(x ,y){
        GridManager.near.forEach((pos) => {
            const nx = x + pos.x;
            const ny = y + pos.y;
            const block = this.map.getBlock(nx, ny);
            if (block) {
                block.interact();  // 블록과 상호작용
            }
        });
    }

    isValidPosition(x, y) {
        return this.map.isValidPosition(x, y);
    }
}

class Map {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.blocksId = [];
        this.blocks = [];
        /**
         * this.blocks = [
         *    null, null, null, null, null, null, null, null, null, null,
         *    null, null, null, null, null, null, null, null, null, null,
         *    null, null, null, null, null, null, null, null, null, null,
         * ]
         */
    }

    render() {
        this.blocks = [];
        this.blocksId.forEach((id, index, arr) => {
            switch (id) {
                case "B":
                    this.blocks[index] = new Block(index % this.width, Math.floor(index / this.width), "test");
                    break; 
                default:
                    this.blocks[index] = null;
            }
        });
        console.log(this.blocks);
    }

    setBlock(x, y, block) {
        this.blocks[this.width * y + x] = block;
    }

    getBlock(x, y) {    
        if (this.blocks !== null && this.isValidPosition(x, y)) { 
            return this.blocks[this.width * y + x];
        }
        return null;
    }

    isValidPosition(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
}
