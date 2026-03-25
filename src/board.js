// 俄罗斯方块 - 游戏棋盘

export class Board {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.grid = [];
    this.init();
  }

  // 初始化空棋盘
  init() {
    this.grid = [];
    for (let y = 0; y < this.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x] = null; // null表示空，字符串表示颜色
      }
    }
  }

  // 检查移动是否有效
  isValidMove(piece, offsetX = 0, offsetY = 0) {
    const positions = piece.getPositions(offsetX, offsetY);

    for (const pos of positions) {
      // 检查边界
      if (pos.x < 0 || pos.x >= this.width || pos.y >= this.height) {
        return false;
      }
      // 检查是否与已固定的方块冲突（忽略y<0的情况，方块在顶部外）
      if (pos.y >= 0 && this.grid[pos.y][pos.x] !== null) {
        return false;
      }
    }
    return true;
  }

  // 固定方块到棋盘
  lockPiece(piece) {
    const positions = piece.getPositions();
    for (const pos of positions) {
      if (pos.y >= 0 && pos.y < this.height && pos.x >= 0 && pos.x < this.width) {
        this.grid[pos.y][pos.x] = piece.color;
      }
    }
  }

  // 消除满行，返回消除的行数
  clearLines() {
    let linesCleared = 0;
    const clearedLines = [];

    // 从底部向上检查
    for (let y = this.height - 1; y >= 0; y--) {
      // 检查该行是否已满
      if (this.grid[y].every(cell => cell !== null)) {
        // 记录要消除的行
        clearedLines.push(y);
        linesCleared++;
      }
    }

    // 实际移除满行
    if (clearedLines.length > 0) {
      // 从下往上移除
      for (const y of clearedLines.sort((a, b) => b - a)) {
        this.grid.splice(y, 1);
      }
      // 在顶部添加空行
      for (let i = 0; i < clearedLines.length; i++) {
        this.grid.unshift(new Array(this.width).fill(null));
      }
    }

    return linesCleared;
  }

  // 获取棋盘上最高的方块行号（用于检测游戏结束）
  getHighestRow() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] !== null) {
          return y;
        }
      }
    }
    return this.height;
  }

  // 检查游戏是否结束
  isGameOver() {
    // 如果顶部两行有方块，说明游戏结束
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.grid[y][x] !== null) {
          return true;
        }
      }
    }
    return false;
  }

  // 获取网格（用于渲染）
  getGrid() {
    return this.grid;
  }
}
