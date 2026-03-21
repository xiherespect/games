// 俄罗斯方块 - 渲染器

const BLOCK_SIZE = 30;
const GRID_COLOR = '#2d2d44';
const BACKGROUND_COLOR = '#1a1a2e';
const BORDER_COLOR = '#4a4a6a';

export class Renderer {
  constructor(canvas, blockSize = BLOCK_SIZE) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.blockSize = blockSize;
  }

  // 清空画布
  clear() {
    this.ctx.fillStyle = BACKGROUND_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // 绘制单个方块
  drawBlock(x, y, color, alpha = 1) {
    const px = x * this.blockSize;
    const py = y * this.blockSize;
    const size = this.blockSize - 1; // 留1px间隙

    // 方块主体
    this.ctx.globalAlpha = alpha;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(px, py, size, size);

    // 方块高光效果
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.fillRect(px, py, size, 2);
    this.ctx.fillRect(px, py, 2, size);

    // 方块阴影效果
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(px, py + size - 2, size, 2);
    this.ctx.fillRect(px + size - 2, py, 2, size);
    this.ctx.globalAlpha = 1;
  }

  // 绘制消除动画效果
  drawLineClearAnimation(board, lines, progress) {
    const grid = board.getGrid();
    const alpha = 1 - progress; // 1 到 0，逐渐消失

    // 绘制每一行
    for (const y of lines) {
      for (let x = 0; x < board.width; x++) {
        if (grid[y] && grid[y][x]) {
          // 绘制闪烁效果
          this.ctx.fillStyle = progress < 0.5 ? '#ffffff' : grid[y][x];
          this.ctx.globalAlpha = alpha * 0.8;
          const px = x * this.blockSize;
          const py = y * this.blockSize;
          const size = this.blockSize - 1;
          this.ctx.fillRect(px, py, size, size);
          this.ctx.globalAlpha = 1;
        }
      }
    }
  }

  // 绘制方块
  drawPiece(piece, offsetX = 0, offsetY = 0) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          this.drawBlock(piece.x + x + offsetX, piece.y + y + offsetY, piece.color);
        }
      }
    }
  }

  // 绘制棋盘
  drawBoard(board, blockSize = null, clearingLines = null, clearProgress = 0) {
    const oldSize = this.blockSize;
    if (blockSize) this.blockSize = blockSize;

    const grid = board.getGrid();

    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        if (grid[y][x] !== null) {
          this.drawBlock(x, y, grid[y][x]);
        } else {
          // 绘制空格子
          const px = x * this.blockSize;
          const py = y * this.blockSize;
          this.ctx.strokeStyle = GRID_COLOR;
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(px, py, this.blockSize - 1, this.blockSize - 1);
        }
      }
    }

    // 绘制消除动画
    if (clearingLines && clearingLines.length > 0) {
      this.drawLineClearAnimation(board, clearingLines, clearProgress);
    }

    // 绘制边框
    this.ctx.strokeStyle = BORDER_COLOR;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(0, 0, board.width * this.blockSize, board.height * this.blockSize);

    if (blockSize) this.blockSize = oldSize;
  }

  // 绘制完整场景（棋盘 + 当前方块）
  render(board, currentPiece, nextPiece = null, nextPieceCanvas = null, clearingLines = null, clearProgress = 0) {
    this.clear();
    this.drawBoard(board, null, clearingLines, clearProgress);

    if (currentPiece) {
      this.drawPiece(currentPiece);
    }

    // 绘制下一个方块预览
    if (nextPiece && nextPieceCanvas) {
      this.drawNextPiece(nextPiece, nextPieceCanvas);
    }
  }

  // 绘制下一个方块预览
  drawNextPiece(piece, canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const blockSize = 25;

    // 清空画布
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, width, height);

    // 绘制边框
    ctx.strokeStyle = BORDER_COLOR;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // 计算居中位置
    const pieceWidth = piece.shape[0].length * blockSize;
    const pieceHeight = piece.shape.length * blockSize;
    const offsetX = Math.floor((width - pieceWidth) / 2 / blockSize);
    const offsetY = Math.floor((height - pieceHeight) / 2 / blockSize);

    // 绘制方块
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const px = (offsetX + x) * blockSize;
          const py = (offsetY + y) * blockSize;
          const size = blockSize - 1;

          ctx.fillStyle = piece.color;
          ctx.fillRect(px, py, size, size);

          // 高光
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
          ctx.fillRect(px, py, size, 2);
          ctx.fillRect(px, py, 2, size);

          // 阴影
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.fillRect(px, py + size - 2, size, 2);
          ctx.fillRect(px + size - 2, py, 2, size);
        }
      }
    }
  }

  // 设置画布尺寸
  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
