const boardSize = 6;
let board = [];
let score = 0;
let selected = null;
let isGameRunning = false;

const boardElement = document.getElementById('board');
const scoreElement = document.getElementById('score-value');
const resetButton = document.getElementById('reset-btn');
const startButton = document.getElementById('start-btn');
const rulesButton = document.getElementById('rules-btn');
const rulesModal = document.getElementById('rules-modal');
const rulesText = document.getElementById('rules-text');
const closeRulesButton = document.getElementById('close-rules');

let countdownInterval;

// 게임 초기화
function initGame() {
    board = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    score = 0;
    scoreElement.textContent = score;
    selected = null;
    isGameRunning = true;
    renderBoard();
    addRandomBomb();
    addRandomBomb();
    startCountdown();
}

// 보드 렌더링
function renderBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (board[i][j]) {
                cell.textContent = `${board[i][j].value} (${board[i][j].countdown})`;
                if (board[i][j].countdown <= 10) cell.classList.add('danger');
                else if (board[i][j].countdown <= 20) cell.classList.add('warning');
                if (selected && selected.x === i && selected.y === j) cell.classList.add('selected');
            }
            cell.addEventListener('click', () => handleClick(i, j));
            boardElement.appendChild(cell);
        }
    }
}

// 랜덤 폭탄 추가
function addRandomBomb() {
    const emptyCells = [];
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!board[i][j]) emptyCells.push({ x: i, y: j });
        }
    }
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[x][y] = { value: Math.floor(Math.random() * 3) + 1, countdown: 30 };
        renderBoard();
    } else if (isGameRunning) {
        gameOver();
    }
}

// 카운트다운 진행
function updateCountdown() {
    if (!isGameRunning) return;
    let exploded = false;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j]) {
                board[i][j].countdown--;
                if (board[i][j].countdown <= 0) {
                    explodeBomb(i, j);
                    exploded = true;
                }
            }
        }
    }
    if (!exploded) checkMerge();
    renderBoard();
}

// 폭발 처리
function explodeBomb(x, y) {
    board[x][y] = null;
    if (selected && selected.x === x && selected.y === y) selected = null;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && board[newX][newY]) {
            board[newX][newY].countdown = Math.max(0, board[newX][newY].countdown - 5);
        }
    }
    addRandomBomb();
}

// 클릭 처리
function handleClick(x, y) {
    if (!isGameRunning) return;
    if (!selected && board[x][y]) {
        selected = { x, y };
    } else if (selected) {
        if (!board[x][y] && isValidMove(selected.x, selected.y, x, y)) {
            board[x][y] = board[selected.x][selected.y];
            board[selected.x][selected.y] = null;
            selected = null;
            checkMerge();
        } else {
            selected = board[x][y] ? { x, y } : null;
        }
    }
    renderBoard();
}

// 유효한 이동 확인
function isValidMove(fromX, fromY, toX, toY) {
    const dx = Math.abs(fromX - toX);
    const dy = Math.abs(fromY - toY);
    return (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
}

// 방향키 이동
document.addEventListener('keydown', (e) => {
    if (!isGameRunning || !selected) return;
    let newX = selected.x;
    let newY = selected.y;
    if (e.key === 'ArrowUp') newX--;
    if (e.key === 'ArrowDown') newX++;
    if (e.key === 'ArrowLeft') newY--;
    if (e.key === 'ArrowRight') newY++;
    
    if (newX >= 0 && newX < boardSize && newY >= 0 && newY < boardSize && !board[newX][newY]) {
        board[newX][newY] = board[selected.x][selected.y];
        board[selected.x][selected.y] = null;
        selected = { x: newX, y: newY };
        checkMerge();
        renderBoard();
    }
});

// 합치기 체크
function checkMerge() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (board[i][j]) {
                const matches = findMatches(i, j, board[i][j].value, []);
                if (matches.length >= 2) {
                    mergeBombs(matches);
                    return;
                }
            }
        }
    }
    addRandomBomb();
}

// 같은 단계 폭탄 찾기
function findMatches(x, y, value, visited) {
    const key = `${x},${y}`;
    if (visited.includes(key) || x < 0 || x >= boardSize || y < 0 || y >= boardSize || !board[x][y] || board[x][y].value !== value) {
        return [];
    }
    visited.push(key);
    const matches = [{ x, y }];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let [dx, dy] of directions) {
        matches.push(...findMatches(x + dx, y + dy, value, visited));
    }
    return matches;
}

// 폭탄 합치기
function mergeBombs(matches) {
    const value = board[matches[0].x][matches[0].y].value;
    for (let { x, y } of matches) {
        board[x][y] = null;
    }
    const center = matches[0];
    board[center.x][center.y] = { value: value + 1, countdown: 30 };
    if (selected && matches.some(m => m.x === selected.x && m.y === selected.y)) {
        selected = { x: center.x, y: center.y };
    }
    score += value * matches.length * 10;
    scoreElement.textContent = score;
    addRandomBomb();
}

// 게임 오버
function gameOver() {
    isGameRunning = false;
    alert(`게임 오버! 점수: ${score}`);
    showMenu();
}

// 주기적 카운트다운
function startCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

// 메뉴 표시
function showMenu() {
    document.getElementById('menu').classList.remove('hidden');
    document.getElementById('score').classList.add('hidden');
    document.getElementById('board').classList.add('hidden');
    resetButton.classList.add('hidden');
    rulesModal.classList.add('hidden'); // 모달 강제 숨김
    clearInterval(countdownInterval);
    boardElement.innerHTML = '';
}

// 이벤트 리스너 설정
startButton.addEventListener('click', () => {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('score').classList.remove('hidden');
    document.getElementById('board').classList.remove('hidden');
    resetButton.classList.remove('hidden');
    initGame();
});

rulesButton.addEventListener('click', () => {
    rulesModal.classList.remove('hidden');
    rulesText.innerHTML = `
        <strong>게임 규칙</strong><br><br>
        - <strong>목표</strong>: 폭탄이 터지기 전에 옮기고 합쳐 최대한 높은 점수를 얻으세요.<br>
        - <strong>보드</strong>: 6x6 격자에서 진행됩니다.<br>
        - <strong>폭탄</strong>: 1~3 단계로 시작하며, 숫자와 카운트다운(초)이 표시됩니다.<br>
        - <strong>카운트다운</strong>: 1초마다 줄어들며, 0이 되면 폭탄이 터져 주변 폭탄의 시간이 5초 감소합니다.<br>
        - <strong>이동</strong>: 폭탄을 클릭해 선택(초록색 테두리)한 후, 방향키 또는 빈 칸 클릭으로 인접한 곳으로 옮길 수 있습니다.<br>
        - <strong>합치기</strong>: 같은 단계 폭탄 2개 이상이 붙으면 합쳐져 단계가 1 증가하고, 카운트다운이 30초로 리셋됩니다.<br>
        - <strong>점수</strong>: 합칠 때마다 '단계 × 합친 개수 × 10' 만큼 점수가 오릅니다.<br>
        - <strong>게임 오버</strong>: 보드가 꽉 차면 게임이 끝납니다.<br><br>
        팁: 폭탄을 합쳐 점수를 높이되, 너무 기다리면 터질 수 있으니 조심하세요!
    `;
});

closeRulesButton.addEventListener('click', () => {
    rulesModal.classList.add('hidden');
});

resetButton.addEventListener('click', () => {
    clearInterval(countdownInterval);
    initGame();
});

// 초기화
showMenu();