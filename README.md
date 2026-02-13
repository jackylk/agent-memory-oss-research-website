# Agent Memory 研究中心 - Website

开源Agent Memory项目的华为云适配性分析平台。

## 🚀 功能特点

- 📊 25个Agent Memory项目的详细分析
- 🇨🇳 华为云适配性评估
- 💰 部署成本估算
- 🏗️ 架构分析
- 📋 项目对比

## 🛠️ 技术栈

- **框架**: Next.js 16.1.6 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS 4.0
- **Markdown**: react-markdown + remark-gfm
- **图表**: Mermaid

## 📦 部署

### Railway 部署

1. Fork 本仓库到你的GitHub账号
2. 在 [Railway](https://railway.app) 创建新项目
3. 连接你的GitHub仓库
4. Railway会自动检测Next.js项目并部署

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📁 项目结构

```
website/
├── app/                    # Next.js App Router页面
│   ├── page.tsx           # 首页（项目列表）
│   └── projects/[name]/   # 项目详情页
├── components/            # React组件
├── lib/                   # 工具函数
├── data/                  # 项目数据
│   ├── projects/         # 25个项目的详细数据
│   └── aggregated/       # 聚合数据
└── public/               # 静态资源
```

## 📊 数据说明

所有项目数据存储在 `data/` 目录：

- `data/projects/*/meta.json` - 项目元数据
- `data/projects/*/architecture.md` - 架构分析
- `data/projects/*/cloud-needs.md` - 华为云适配性分析
- `data/aggregated/*.json` - 聚合数据

## 🔧 配置

无需额外配置，开箱即用。

## 📝 License

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！
