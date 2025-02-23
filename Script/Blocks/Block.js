import { GridManager, ctx } from "../index.js";

export class Block {
    constructor(x, y) {

        this.position = { x, y };

        this.timer = 0;  // 초기 타이머 값
        this.activateTime = -1;  // 초기 타이머 값

        this.isActive = false;

        this.isCollidable = true;
        this.isTemporary = false;  // 임시 블록인지 여부

        this.image = new Image();
    }

    // 타이머 업데이트 (플레이어 이동 시마다 호출)
    updateTimer() {
        if (this.timer < this.activateTime) {
            this.timer += 1;  // 타이머 증가
        }
        
        // 타이머가 0에 도달하면 자동 활성화
        if (this.timer === this.activateTime) {
            this.Activate();
        }
        this.Update();
    }

    // 블록 활성화
    Activate() {
        this.isActive = true;

        this.onActivate();
        if (this.isTemporary) {
            this.Deactivate();  // 일시 활성화 블록은 바로 비활성화
        }
    }

    // 블록 비활성화
    Deactivate() {
        this.isActive = false;
        this.onDeactivate();
    }


    // 블록과 상호작용 (충돌 처리)
    interact() {
        this.Deactivate();
        this.onInteract();  // 상호작용 시 호출되는 메서드
        this.timer = -1;
    }

    // 이미지를 캔버스에 그리는 메서드
    draw() {

        const realPos = {x: this.position.x * GridManager.cellSize, y: this.position.y * GridManager.cellSize};
        const radius = GridManager.cellSize / 2;
        const time =  this.timer / this.activateTime;

        // 캔버스 상태 저장
        ctx.save();


        ctx.globalAlpha = (time == 1) ? 1 : 0.3;

        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            realPos.x, realPos.y, GridManager.cellSize, GridManager.cellSize);


        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(realPos.x + GridManager.cellSize / 2, realPos.y + GridManager.cellSize / 2); // 중심으로 이동
        ctx.arc(
            realPos.x + GridManager.cellSize / 2,
            realPos.y + GridManager.cellSize / 2,
            GridManager.cellSize, 
            Math.PI * -0.5,
            Math.PI * (-0.5 + time * 2)
        ); 

        ctx.closePath();
        ctx.clip(); // 해당 영역만 남기고 클리핑

        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            realPos.x, realPos.y, GridManager.cellSize, GridManager.cellSize);



        // 캔버스 상태 복원
        ctx.restore();
    }

    onActivate(){}
    onDeactivate(){ }
    Update(){} //플레이거 움직때 마다 호출
    Start(){} //블록 생성시 호출
    onInteract(){}
}