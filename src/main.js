// 俄罗斯方块 - 主入口文件

import { Game } from './game.js';
import { Renderer } from './renderer.js';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

// 获取DOM元素
const canvas = document.getElementById('game-canvas');
const nextPieceCanvas = document.getElementById('next-piece-canvas');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const finalScoreElement = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const difficultySelect = document.getElementById('difficulty');
const pauseOverlay = document.getElementById('pause-overlay');
const gameOverOverlay = document.getElementById('game-over-overlay');

// 触摸控制按钮
const touchRotate = document.getElementById('touch-rotate');
const touchLeft = document.getElementById('touch-left');
const touchDown = document.getElementById('touch-down');
const touchRight = document.getElementById('touch-right');
const touchHardDrop = document.getElementById('touch-hard-drop');
const touchPause = document.getElementById('touch-pause');

// 初始化渲染器
const renderer = new Renderer(canvas, BLOCK_SIZE);
renderer.setSize(BOARD_WIDTH * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);

// 初始化游戏
const game = new Game(canvas, nextPieceCanvas, scoreElement, highScoreElement, () => {
  // 游戏结束回调
  updateGameOverOverlay();
});

// 渲染循环
function renderLoop() {
  game.render(renderer);
  if (game.isRunning) {
    requestAnimationFrame(renderLoop);
  }
}

// 显示/隐藏暂停界面
function updatePauseOverlay() {
  if (game.isPaused) {
    pauseOverlay.classList.remove('hidden');
  } else {
    pauseOverlay.classList.add('hidden');
  }
}

// 显示/隐藏游戏结束界面
function updateGameOverOverlay() {
  if (game.isGameOver) {
    finalScoreElement.textContent = game.score;
    gameOverOverlay.classList.remove('hidden');
  } else {
    gameOverOverlay.classList.add('hidden');
  }
}

// 开始按钮
startButton.addEventListener('click', () => {
  const difficulty = difficultySelect.value;
  game.setDifficulty(difficulty);
  game.start();
  renderLoop();
  startButton.textContent = '重新开始';
  gameOverOverlay.classList.add('hidden');
});

// 重新开始按钮
restartButton.addEventListener('click', () => {
  const difficulty = difficultySelect.value;
  game.setDifficulty(difficulty);
  game.start();
  renderLoop();
  gameOverOverlay.classList.add('hidden');
});

// 键盘控制
document.addEventListener('keydown', (e) => {
  if (!game.isRunning) return;

  // P键：暂停/继续（即使暂停中也能响应）
  if (e.key === 'p' || e.key === 'P') {
    if (game.isPaused) {
      game.resume();
      updatePauseOverlay();
    } else if (!game.isGameOver) {
      game.pause();
      updatePauseOverlay();
    }
    return;
  }

  // 暂停中或游戏结束时不响应其他按键
  if (game.isPaused || game.isGameOver) return;

  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      game.moveRight();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      game.drop();
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      game.rotate();
      break;
    case ' ':
      e.preventDefault();
      game.hardDrop();
      break;
  }
});

// 难度选择
difficultySelect.addEventListener('change', (e) => {
  game.setDifficulty(e.target.value);
});

// 触摸控制 - 旋转
touchRotate.addEventListener('click', () => {
  if (!game.isRunning || game.isPaused || game.isGameOver || game.isAnimating) return;
  game.rotate();
});

// 触摸控制 - 向左移动（长按连续移动）
let touchLeftInterval = null;
touchLeft.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!game.isRunning || game.isPaused || game.isGameOver || game.isAnimating) return;

  game.moveLeft();

  // 长按连续移动
  touchLeftInterval = setInterval(() => {
    if (game.isRunning && !game.isPaused && !game.isGameOver && !game.isAnimating) {
      game.moveLeft();
    }
  }, 100);
});

touchLeft.addEventListener('touchend', () => {
  if (touchLeftInterval) {
    clearInterval(touchLeftInterval);
    touchLeftInterval = null;
  }
});

// 触摸控制 - 向下（长按连续下落）
let touchDownInterval = null;
touchDown.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!game.isRunning || game.isPaused || game.isGameOver || game.isAnimating) return;

  game.drop();

  touchDownInterval = setInterval(() => {
    if (game.isRunning && !game.isPaused && !game.isGameOver && !game.isAnimating) {
      game.drop();
    }
  }, 100);
});

touchDown.addEventListener('touchend', () => {
  if (touchDownInterval) {
    clearInterval(touchDownInterval);
    touchDownInterval = null;
  }
});

// 触摸控制 - 向右移动（长按连续移动）
let touchRightInterval = null;
touchRight.addEventListener('touchstart', (e) => {
  e.preventDefault();
  if (!game.isRunning || game.isPaused || game.isGameOver || game.isAnimating) return;

  game.moveRight();

  touchRightInterval = setInterval(() => {
    if (game.isRunning && !game.isPaused && !game.isGameOver && !game.isAnimating) {
      game.moveRight();
    }
  }, 100);
});

touchRight.addEventListener('touchend', () => {
  if (touchRightInterval) {
    clearInterval(touchRightInterval);
    touchRightInterval = null;
  }
});

// 触摸控制 - 硬降
touchHardDrop.addEventListener('click', (e) => {
  e.preventDefault();
  if (!game.isRunning || game.isPaused || game.isGameOver || game.isAnimating) return;
  game.hardDrop();
});

// 触摸控制 - 暂停/继续
touchPause.addEventListener('click', (e) => {
  e.preventDefault();
  if (!game.isRunning) return;

  if (game.isPaused) {
    game.resume();
    updatePauseOverlay();
  } else if (!game.isGameOver) {
    game.pause();
    updatePauseOverlay();
  }
});

console.log('俄罗斯方块游戏初始化完成');
