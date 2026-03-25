// 俄罗斯方块 - 游戏核心逻辑

import { Board } from './board.js';
import { createRandomPiece } from './piece.js';

// 得分规则
const SCORE_RULES = {
  1: 100,
  2: 300,
  3: 500,
  4: 800
};

// 难度对应的下落间隔（毫秒）
const DIFFICULTY_SPEEDS = {
  easy: 1000,
  medium: 600,
  hard: 300
};

// 消除动画时长（毫秒）
const CLEAR_ANIMATION_DURATION = 200;

export class Game {
  constructor(canvas, nextPieceCanvas, scoreElement, highScoreElement, onGameOver = null) {
    this.board = new Board();
    this.canvas = canvas;
    this.nextPieceCanvas = nextPieceCanvas;
    this.scoreElement = scoreElement;
    this.highScoreElement = highScoreElement;
    this.onGameOver = onGameOver;

    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.level = 1;
    this.difficulty = 'medium';
    this.dropInterval = DIFFICULTY_SPEEDS[this.difficulty];
    this.lastDropTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.isGameOver = false;

    // 消除动画状态
    this.isAnimating = false;
    this.animationStartTime = 0;
    this.clearedLines = [];
    this.clearingLines = [];

    this.animationId = null;

    // 加载最高分
    this.loadHighScore();
  }

  // 开始游戏
  start() {
    this.board.init();
    this.score = 0;
    this.level = 1;
    this.isRunning = true;
    this.isPaused = false;
    this.isGameOver = false;
    this.isAnimating = false;
    this.clearedLines = [];
    this.clearingLines = [];

    this.nextPiece = createRandomPiece();
    this.spawnPiece();
    this.updateScore();

    this.lastDropTime = performance.now();
    this.loop();
  }

  // 生成新方块
  spawnPiece() {
    this.currentPiece = this.nextPiece;
    this.nextPiece = createRandomPiece();

    // 将新方块放置在棋盘顶部中央
    this.currentPiece.x = Math.floor((this.board.width - this.currentPiece.shape[0].length) / 2);
    this.currentPiece.y = 0;

    // 检查是否游戏结束
    if (!this.board.isValidMove(this.currentPiece)) {
      this.gameOver();
    }
  }

  // 游戏主循环
  loop() {
    if (!this.isRunning) return;

    // 如果正在播放消除动画，只渲染不更新逻辑
    if (this.isAnimating) {
      const now = performance.now();
      const progress = Math.min(1, (now - this.animationStartTime) / CLEAR_ANIMATION_DURATION);
      this.animationId = requestAnimationFrame(() => this.loop());
      return { animating: true, progress, clearingLines: this.clearingLines };
    }

    if (this.isPaused) {
      this.animationId = requestAnimationFrame(() => this.loop());
      return { animating: false };
    }

    const now = performance.now();
    if (now - this.lastDropTime >= this.dropInterval) {
      this.drop();
      this.lastDropTime = now;
    }

    this.animationId = requestAnimationFrame(() => this.loop());
    return { animating: false };
  }

  // 方块下落
  drop() {
    if (this.isAnimating) return; // 动画中不下落

    if (this.board.isValidMove(this.currentPiece, 0, 1)) {
      this.currentPiece.y++;
    } else {
      // 固定方块
      this.board.lockPiece(this.currentPiece);
      // 检查并记录要消除的行
      this.checkAndStartClearAnimation();
    }
  }

  // 快速下落（直接到底部）
  hardDrop() {
    if (this.isAnimating) return; // 动画中不下落

    let dropCount = 0;
    while (this.board.isValidMove(this.currentPiece, 0, 1)) {
      this.currentPiece.y++;
      dropCount++;
    }

    // 固定方块
    this.board.lockPiece(this.currentPiece);
    this.score += dropCount; // 硬降每格加1分

    // 检查并记录要消除的行
    this.checkAndStartClearAnimation();
    this.updateScore();
  }

  // 移动方块
  moveLeft() {
    if (this.isAnimating) return;
    if (this.board.isValidMove(this.currentPiece, -1, 0)) {
      this.currentPiece.x--;
    }
  }

  moveRight() {
    if (this.isAnimating) return;
    if (this.board.isValidMove(this.currentPiece, 1, 0)) {
      this.currentPiece.x++;
    }
  }

  // 旋转方块
  rotate() {
    if (this.isAnimating) return;
    const tempPiece = this.currentPiece.copy();
    tempPiece.rotateRight();
    if (this.board.isValidMove(tempPiece)) {
      this.currentPiece.rotateRight();
    } else {
      // 尝试墙踢（简单版：尝试左移或右移）
      for (let offset of [-1, 1, -2, 2]) {
        if (this.board.isValidMove(tempPiece, offset, 0)) {
          tempPiece.x += offset;
          this.currentPiece.shape = tempPiece.shape;
          this.currentPiece.x = tempPiece.x;
          break;
        }
      }
    }
  }

  // 暂停游戏
  pause() {
    this.isPaused = true;
  }

  // 继续游戏
  resume() {
    this.isPaused = false;
    this.lastDropTime = performance.now();
  }

  // 设置难度
  setDifficulty(difficulty) {
    if (DIFFICULTY_SPEEDS[difficulty]) {
      this.difficulty = difficulty;
      this.dropInterval = DIFFICULTY_SPEEDS[difficulty];
    }
  }

  // 检查是否需要播放消除动画
  checkAndStartClearAnimation() {
    const clearedRows = [];
    for (let y = 0; y < this.board.height; y++) {
      if (this.board.grid[y].every(cell => cell !== null)) {
        clearedRows.push(y);
      }
    }

    if (clearedRows.length > 0) {
      this.startClearAnimation(clearedRows);
    } else {
      // 没有消除，直接生成新方块
      this.spawnPiece();
    }
  }

  // 开始消除动画
  startClearAnimation(rows) {
    this.isAnimating = true;
    this.animationStartTime = performance.now();
    this.clearingLines = rows;

    // 等待动画结束再生成新方块
    setTimeout(() => {
      this.endClearAnimation();
    }, CLEAR_ANIMATION_DURATION);
  }

  // 结束消除动画
  endClearAnimation() {
    // 实际消除行
    const linesCleared = this.board.clearLines();
    this.addScore(linesCleared);

    // 重置状态，允许游戏继续
    this.isAnimating = false;
    this.clearingLines = [];

    // 生成新方块
    this.spawnPiece();
  }

  // 计分
  addScore(linesCleared) {
    if (linesCleared > 0) {
      const baseScore = SCORE_RULES[linesCleared] || 0;
      this.score += baseScore * this.level;
      this.updateScore();
    }
  }

  // 更新分数显示
  updateScore() {
    if (this.scoreElement) {
      this.scoreElement.textContent = this.score;
    }
    this.updateHighScore();
  }

  // 更新最高分
  updateHighScore() {
    const highScore = this.getHighScore();
    if (this.score > highScore) {
      this.setHighScore(this.score);
    }
  }

  // 获取最高分
  getHighScore() {
    const saved = localStorage.getItem('tetris-high-score');
    return saved ? parseInt(saved, 10) : 0;
  }

  // 保存最高分
  setHighScore(score) {
    localStorage.setItem('tetris-high-score', score.toString());
    if (this.highScoreElement) {
      this.highScoreElement.textContent = score;
    }
  }

  // 加载最高分
  loadHighScore() {
    const highScore = this.getHighScore();
    if (this.highScoreElement) {
      this.highScoreElement.textContent = highScore;
    }
  }

  // 游戏结束
  gameOver() {
    this.isRunning = false;
    this.isGameOver = true;
    this.isAnimating = false;
    this.updateHighScore();
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    // 触发游戏结束回调
    if (this.onGameOver) {
      this.onGameOver();
    }
  }

  // 渲染游戏
  render(renderer) {
    const loopResult = this.loop();
    renderer.render(
      this.board,
      this.currentPiece,
      this.nextPiece,
      this.nextPieceCanvas,
      loopResult.clearingLines || null,
      loopResult.progress || 0
    );
  }
}
