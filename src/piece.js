// 俄罗斯方块 - 方块定义

// 方块形状定义
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1]],
  S: [[0, 1, 1], [1, 1, 0]],
  Z: [[1, 1, 0], [0, 1, 1]],
  J: [[1, 0, 0], [1, 1, 1]],
  L: [[0, 0, 1], [1, 1, 1]]
};

// 方块颜色
const COLORS = {
  I: '#00f0f0',
  O: '#f0f000',
  T: '#a000f0',
  S: '#00f000',
  Z: '#f00000',
  J: '#0000f0',
  L: '#f0a000'
};

// 方块类型列表
const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

export class Piece {
  constructor(type) {
    this.type = type;
    this.shape = JSON.parse(JSON.stringify(SHAPES[type])); // 深拷贝
    this.color = COLORS[type];
    this.x = 0;
    this.y = 0;
  }

  // 向右旋转90度（顺时针）
  rotateRight() {
    const rows = this.shape.length;
    const cols = this.shape[0].length;
    const rotated = [];

    for (let i = 0; i < cols; i++) {
      rotated[i] = [];
      for (let j = rows - 1; j >= 0; j--) {
        rotated[i][rows - 1 - j] = this.shape[j][i];
      }
    }
    this.shape = rotated;
  }

  // 向左旋转90度（逆时针）
  rotateLeft() {
    const rows = this.shape.length;
    const cols = this.shape[0].length;
    const rotated = [];

    for (let i = 0; i < cols; i++) {
      rotated[i] = [];
      for (let j = 0; j < rows; j++) {
        rotated[i][j] = this.shape[j][cols - 1 - i];
      }
    }
    this.shape = rotated;
  }

  // 复制当前方块（用于测试旋转）
  copy() {
    const piece = new Piece(this.type);
    piece.x = this.x;
    piece.y = this.y;
    piece.shape = JSON.parse(JSON.stringify(this.shape));
    return piece;
  }

  // 获取方块所占位置的坐标列表
  getPositions(offsetX = 0, offsetY = 0) {
    const positions = [];
    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x]) {
          positions.push({
            x: this.x + x + offsetX,
            y: this.y + y + offsetY
          });
        }
      }
    }
    return positions;
  }
}

// 创建随机方块
export function createRandomPiece() {
  const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
  return new Piece(type);
}

export const SHAPES_ALL = SHAPES;
export const COLORS_ALL = COLORS;
