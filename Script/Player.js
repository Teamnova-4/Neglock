import { canvas, ctx } from "./index.js";
import { GameLoop, GridManager } from "./index.js";

export class Player{
    static instance ;

    constructor(x, y) {
        this.position = { x: x, y: y }; // 현재 위치 (X 좌표)

        if (Player.instance){
            return Player.instance;
        }



        Player.instance = this;
        Player.instance.Initialize();
    }

    static Instance() {
        if (!Player.instance) {
            new Player(0,0);
        }
        return Player.instance;
    }

    Initialize() {
        this.image = new Image();
        this.image.src = "../Resources/player.png";
        this.keyPressed = new Set(); // 현재 눌린 키를 저장하는 Set
    }

    /** 키 입력 감지 */
    initInputListener() {
        console.log("re")
        window.addEventListener("keydown", (event) => this.handleKeyDown(event));
        window.addEventListener("keyup", (event) => this.handleKeyUp(event));
    }

    /** 키가 눌렸을 때 */
    handleKeyDown(event) {
        if (this.keyPressed.has(event.key)) return; // 중복 입력 방지
        this.keyPressed.add(event.key);

        switch (event.key) {
            case "ArrowUp":
            case "w":
                this.move("up");
                break;
            case "ArrowDown":
            case "s":
                this.move("down");
                break;
            case "ArrowLeft":
            case "a":
                this.move("left");
                break;
            case "ArrowRight":
            case "d":
                this.move("right");
                break;
        }
    }

    /** 키를 뗐을 때 */
    handleKeyUp(event) {
        this.keyPressed.delete(event.key);
    }

    /** 플레이어 이동 */
    move(direction) {
        let newX = this.position.x;
        let newY = this.position.y;

        // 방향에 따라 이동 좌표 계산
        switch (direction) {
            case "up": newY -= 1; break;
            case "down": newY += 1; break;
            case "left": newX -= 1; break;
            case "right": newX += 1; break;
        }

        this.moveTo(newX, newY);
    }

    moveTo(x, y){
        // 이동 가능한지 체크
        if (this.canMove(x, y)) {
            this.position = { x: x, y: y };
            GameLoop.Instance().isPlayerUpdate = true;
            this.checkInteraction();  // 이동 후 블록과 상호작용
            console.log("Player move to:" + x + ", " + y);
        }
    }


    /** 해당 위치로 이동 가능한지 체크 */
    canMove(x, y) {
        // 화면 밖으로 나가는 경우 불가능
        console.log(1);
        if (!GridManager.Instance().isValidPosition(x, y)) return false;
        
        console.log(2);
        const block = GridManager.Instance().map.getBlock(x, y);
        if (!block) return true; // 블록이 없으면 이동 가능

        console.log(block);
        return !block.isCollidable; // 블록이 충돌 가능하면 이동 불가능
    }

    draw(){
        const radians = (this.isReverse ? 180 : 0 * Math.PI) / 180; // 도를 라디안으로 변환

        // 캔버스 상태 저장
        ctx.save();


        ctx.rotate(radians);

        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            this.position.x * GridManager.cellSize, this.position.y * GridManager.cellSize, GridManager.cellSize, GridManager.cellSize);


        // Bloom 효과를 줄 원의 속성
        const radius = 0.1;
        const spread = 2;
        const spreadCount = 20;
        const intensity = 0.01;
        const glowColor = "rgba(255, 50, 50, 0.7)";

        // 여러 번 그려서 빛 번짐 효과를 줌
        for (let i = 0; i < spreadCount; i++) {
            ctx.beginPath();
            ctx.arc(
                this.position.x * GridManager.cellSize + GridManager.cellSize / 2,
                this.position.y * GridManager.cellSize + GridManager.cellSize / 2,
                radius + i * spread, 0, Math.PI * 2);

            ctx.fillStyle = glowColor;
            ctx.globalAlpha = intensity; // 각 레이어를 약간 투명하게
            ctx.fill();
        }

        // 캔버스 상태 복원
        ctx.restore();
    }

    update() { 
        GameLoop.Instance().isPlayerUpdate = false;

    }

    /** 현재 위치에서 블록과 상호작용 */
    checkInteraction() {
        /**
        let block = this.grid.getBlock(this.x, this.y);
        if (!block) return;

        if (block instanceof GoalBlock && block.isActive()) {
            this.handleWin(); // 목표 블록과 상호작용 시 승리
        } else if (block instanceof HazardBlock && block.isActive()) {
            this.handleLoss(); // 위험 블록과 상호작용 시 패배
        } else {
            block.resetTimer(); // 일반 블록은 타이머 리셋
        }
         */
    }

}
