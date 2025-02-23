import { GridManager, Player, rcanvas, rctx } from "./index.js";
import { canvas, ctx, Util } from "./index.js";

class Loop {
    constructor(interval, func, order) {
        this.interval = interval;
        this.func = func;
        this.order = order;
        this.currentTime = 0;
    }

    checkInterval(deltaTime) {
        this.currentTime += deltaTime;
        if (this.currentTime >= this.interval) {
            this.currentTime -= this.interval;
            return true;
        }
        return false;
    }
}
export class GameLoop {
    static instance;

    constructor() {
        if(GameLoop.instance){
            return GameLoop.instance;
        }


        GameLoop.instance = this;
        GameLoop.instance.Initialize();
    }


    static Instance() {
        if (!GameLoop.instance) {
            GameLoop.instance = new GameLoop();
        }
        return GameLoop.instance;
    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() {
        this.isRunning = false; // 게임 루프가 실행 중인지 여부

        this.isPlayerUpdate = false;

        GameLoop.playTime = 0;

        GameLoop.instance.start();
    }

    /**
     * 
     * order는 양의 정수 (0 이상의값) 이여야함
     * 
     * @param {*} object 
     * @param {*} timeout 
     * @param {*} order 
     */
    static AddLoop(object, timeout, order = 0) {
        if (object instanceof Function) {
            GameLoop.instance.newLoops.push(new Loop(timeout, object, order));
        } else {
            console.error("Object must be an instance of Function");
        }
    }

    start() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.lastFrameTime = performance.now(); // 게임 시작 시간 설정
        this.gameStartTime = performance.now();
        console.log(`캔버스 크기: ${canvas.width}x${canvas.height}`); // 캔버스 크기 로그 추가

        // 우클릭 방지 코드 추가
        addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });

        // 드래그 방지 코드 추가
        addEventListener('selectstart', (event) => {
            event.preventDefault();
        });
        Player.Instance().initInputListener();

        // 백그라운드 BGM 시작
        /*
        this.backGroundMusic = new Audio('Resources/background-music.mp3'); // BGM 오디오 요소 생성
        this.backGroundMusic.loop = true; // 반복 재생 설정
        this.backGroundMusic.volume = 1.0; // 초기 볼륨 설정
        this.backGroundMusic.play(); // BGM 재생
        
        */

        this.loop(); // 게임 루프 시작
    }

    stop() {
        this.isRunning = false;
    }

    loop() {
    
        if (!this.isRunning) return;

        this.backgroundRender(); // 화면 렌더링
        // 현재 시간 기록
        const currentTime = performance.now();
        GameLoop.deltaTime = (currentTime - this.lastFrameTime) * GameLoop.GameSpeed;
        GameLoop.playTime += GameLoop.deltaTime;

        // ============================Start====================== 

        // ============================Update====================== 

        // 슬라이더에서 볼륨 값을 가져와 BGM 볼륨을 설정
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            const volume = parseFloat(volumeSlider.value); // 슬라이더의 현재 값
            this.backGroundMusic.volume = volume; // BGM 볼륨 설정
        }

        GridManager.Instance().draw(); // 그리드 매니저 업데이트
        Player.Instance().draw();
        if(this.isPlayerUpdate) {
            Player.Instance().update();
            GridManager.Instance().update();
        }

        this.drawRealCanvas();
        //==========================================================

        this.lastFrameTime = currentTime; // 마지막 프레임 시간 업데이트
        // requestAnimationFrame을 사용해 다음 프레임을 요청
        requestAnimationFrame(() => this.loop());
    }

    drawRealCanvas() {
        rctx.clearRect(0, 0, rcanvas.width, rcanvas.height);
        rctx.drawImage(canvas, 0, 0);  // 그리드 그리기
    }

    backgroundRender() {
        // 게임 화면 렌더링 (예: 그리기 작업)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //Background.Instance().animateBackground();
    }

}

export class Background {
    constructor() {
        if (Background.instance) {
            return Background.instance;
        }



        this.Initialize();
        Background.instance = this;
    }

    /**
     * 싱클톤 인스턴스 반환 함수
     */
    static Instance() {
        if (!Background.instance) {
            Background.instance = new Background();
            Background.instance.Initialize();
        }
        return Background.instance;
    }

    /**
     * 싱클톤 초기화 함수
     */
    Initialize() {
        var backGroundMusic = new Audio('Resources/background-music.mp3');
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = "Resources/BackGround.png";
        this.speed = -0.6;
        this.x = 0; // 배경의 초기 위치
        this.isRunning = false;
    }

    static INIT_SCALE(scale) {

        // 실제 캔버스 크기
        Background.REAL_CANVAS_SIZE = { width: canvas.width, height: canvas.height };

        // 게임 캔버스 크기
        Background.CANVAS_SIZE = { width: scale, height: scale / Background.REAL_CANVAS_SIZE.width * Background.REAL_CANVAS_SIZE.height };


        // 게임 캔버스 대비 실제 비율
        Background.SCALE = Background.REAL_CANVAS_SIZE.width / scale;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animateBackground();
    }

    stop() {
        this.isRunning = false;
        cancelAnimationFrame(this.animationId);
    }

    animateBackground() {
        // GameSystem.backgroundRender();
        if (!this.isRunning) return;

        // // 배경 위치 업데이트 (왼쪽에서 오른쪽으로 이동)
        this.x -= this.speed;
        if (Math.abs(this.x) >= canvas.width) {
            this.x = 0; // 화면 끝에 도달하면 처음으로 되돌리기
        }

        // // 캔버스 클리어 후 새로운 배경 그리기
        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            this.x, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            -canvas.width + this.x, 0, canvas.width, canvas.height);
    }
}