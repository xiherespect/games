# 俄罗斯方块 Web 游戏

## 项目概述

经典的俄罗斯方块网页版游戏，支持多种难度级别和方块形状，为玩家提供熟悉的方块消除体验。当前阶段：项目初始化。

## 技术栈

- **语言**: JavaScript (ES6+)
- **框架**: 原生 HTML5 Canvas + JavaScript
- **构建**: Vite
- **其他**: 无额外UI库，使用原生CSS

## 开发规则

1. 任何代码改动如果与 docs/ 下的文档不一致，必须同步更新对应文档
2. 产品决策变更（功能取舍、交互调整、设计修改）必须写入对应文档，不能只存在于对话中
3. 不确定的产品问题先问我，不要自行决定
4. 遵循简洁原则，避免过度设计

## 常用命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 文档索引

| 文档 | 路径 |
|------|------|
| 产品规格 | docs/product-spec.md |
| 设计规范 | docs/design-tokens.md |
| 开发计划 | docs/plan.md |
| 任务列表 | docs/tasks/todo.md |
| 经验教训 | docs/tasks/lessons.md |

## 开发流程

- 非trivial任务先写 docs/tasks/todo.md 再动代码
- 遇到问题 STOP，重新规划，不要硬推
- 改完必须验证（手动测试/看日志）
- 修完bug后把教训写进 docs/tasks/lessons.md
- 每次session开始先读 docs/tasks/lessons.md
