import { GridManager, ctx } from "../index.js";

export class Block {
    constructor(x, y, type) {

        this.type = type;
        this.position = { x, y };

        this.timer = 6;  // 초기 타이머 값
        this.initTimer = 6;  // 초기 타이머 값

        this.isActive = false;

        this.isCollidable = true;
        this.isTemporary = false;  // 임시 블록인지 여부
        this.isReverse = false;  // 리버스 블록의 상태 관리용

        this.image = new Image();
        this.image.src = "../../Resources/test.png";
        this.image.onload = () => {
        };
    }

    // 타이머 업데이트 (플레이어 이동 시마다 호출)
    updateTimer() {
        if (this.timer > 0) {
            this.timer -= 1;  // 타이머 감소
        }
        
        // 타이머가 0에 도달하면 자동 활성화
        if (this.timer === 0) {
            this.setActive(true);
        }
    }

    // 타이머 리셋 (플레이어와 상호작용 시 호출)
    resetTimer() {
        this.timer = this.initTimer;  // 타이머 초기화
    }

    setActive(status) {
        status = this.isReverse ? !status : status;

        if (status) {
            this.activate();
        } else {
            this.deactivate();
        } 
    }

    // 블록 활성화
    activate() {
        this.isActive = true;

        this.onActivate();
        if (this.isTemporary) {
            this.deactivate();  // 일시 활성화 블록은 바로 비활성화
        }
    }

    // 블록 비활성화
    deactivate() {
        this.isActive = false;
        this.onDeactivate();
    }


    // 블록과 상호작용 (충돌 처리)
    interact() {
        this.resetTimer();  // 타이머 리셋
        this.setActive(false);
        this.onInteract();  // 상호작용 시 호출되는 메서드
    }

    // 이미지를 캔버스에 그리는 메서드
    draw() {
        const radians = (this.isReverse ? 180 : 0) * Math.PI / 180; // 도를 라디안으로 변환

        const realPos = {x: this.position.x * GridManager.cellSize, y: this.position.y * GridManager.cellSize};
        const radius = GridManager.cellSize / 2;
        const time =  (this.initTimer - this.timer) / this.initTimer;

        // 캔버스 상태 저장
        ctx.save();


        ctx.globalAlpha = (time == 1) ? 1 : 0.3;

        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            realPos.x, realPos.y, GridManager.cellSize, GridManager.cellSize);


        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.moveTo(realPos.x + GridManager.cellSize / 2, realPos.y + GridManager.cellSize / 2); // 중심으로 이동
        ctx.arc(realPos.x + GridManager.cellSize / 2, realPos.y + GridManager.cellSize / 2, GridManager.cellSize, Math.PI * -0.5, Math.PI * (-0.5 + time * 2)); 

        ctx.closePath();
        ctx.clip(); // 해당 영역만 남기고 클리핑


        ctx.save();
        ctx.translate(realPos.x + radius, realPos.y + radius); // 중심으로 이동
        ctx.rotate(radians);
        ctx.restore();

        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            realPos.x, realPos.y, GridManager.cellSize, GridManager.cellSize);



        // 캔버스 상태 복원
        ctx.restore();
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