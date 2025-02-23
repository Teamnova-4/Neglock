import { Block, GameLoop, GridManager } from '../index.js';

export class GoalBlock extends Block {
    constructor(x, y, params) {
        super(x, y);
        this.image.src = "../../Resources/block_goal.png";


        this.activateTime = parseInt(params[1]);  // 초기 타이머 값
        this.timer = parseInt(params[2]);  // 초기 타이머 값

        this.activate = false;
    }

    Start() {
        GridManager.Instance().goalBlocks.push(this); // 블록 생성시 호출
    }
    onActivate(){ 
        console.log("goal activate")
    }
    onDeactivate(){ }
    Update(){} //플레이거 움직때 마다 호출
    onInteract(){}
}

export class NormalBlock extends Block {
    constructor(x, y, params) {
        super(x, y);
        this.image.src = "../../Resources/block_normal.png";

        this.timer = -1;  // 초기 타이머 값
        this.activateTime = -1;  // 초기 타이머 값
    }

    onActivate(){ 
    }
    onDeactivate(){ }
    Update(){} //플레이거 움직때 마다 호출
    Start(){} //블록 생성시 호출
    onInteract(){}
}

export class DisappearBlock extends Block {
    constructor(x, y, params) {
        super(x, y);
        this.image.src = "../../Resources/block_disappear.png";

        this.activateTime = parseInt(params[1]);  // 초기 타이머 값
        this.timer = parseInt(params[2]);  // 초기 타이머 값
    }

    onActivate(){ 
        GridManager.Instance().map.setBlock(this.position.x, this.position.y, null) // 블록 플레이어 상호작용시 호출
        console.log("onActivate");
    }
    onDeactivate(){ }
    Update(){} //플레이거 움직때 마다 호출
    Start(){} //블록 생성시 호출
    onInteract(){}

}

export class DeadBlock extends Block {
    constructor(x, y, params) {
        super(x, y);
        this.image.src = "../../Resources/block_dead.png";

        this.activateTime = parseInt(params[1]);  // 초기 타이머 값
        this.timer = parseInt(params[2]);  // 초기 타이머 값
    }

    onActivate(){ 
        GameLoop.Instance().handleLoss(); // 게임 오버 처리
    }
    onDeactivate(){ }
    Update(){} //플레이거 움직때 마다 호출
    Start(){} //블록 생성시 호출
    onInteract(){}
}