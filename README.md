# DeveloperNote

## 架构与目录结构

### 架构

本项目由前端（界面部份）和后端（数据 API 服务，设备 API 服务）构成

#### 前端

- Base：Electron
- UI 库：React
- 其它：Redux, React-Redux, React-router, Ramda 等

#### 数据 API 服务

- Base: Koa2 with nodejs
- 数据库：Mongodb, Mongoose
- API：Koa-router, graphql
- 虚拟化：Docker

#### 设备 API 服务

- Base: .NET API Server
- 其它：固定式读写器库

### 目录结构

```bash
├── <root>
  ├── application - 前端及数据 API 代码
    ├── README.md - 本文裆
    ├── app - 前端主要代码
      ├── actions - redux's actions
      ├── components - 组件代码
      ├── index.js - Electron 渲染进程主入口
      ├── main.dev.js - Electron 主进程入品
      ├── pages - 页面代码
      ├── reducers - redux's reducers
      ├── sources - 与 API 交互相关代码
      ├── store - redux's store 相关代码
      ├── utils - 輔助函数
    ├── dll
    ├── flow-typed
    ├── internals
    ├── nodemon.json
    ├── package.json
    ├── server - 数据 API 主要代码及 Docker 配置
    ├── webpack.config.base.js - 其下都为针对不同环境的 webpack 配置
    ├── webpack.config.eslint.js
    ├── webpack.config.main.prod.js
    ├── webpack.config.renderer.dev.dll.js
    ├── webpack.config.renderer.dev.js
    ├── webpack.config.renderer.prod.js
  |- rfidServer - 设备 API 代码
```

## 开发与部署

### Environment

- 前端
  - node.js 9.x+
  - npm 6+
  - yarn 1.3+
  - electron（通过 yarn 全局安装）
- 数据 API
  - node.js 9.x+
  - Docker 18.03+
- 设备 API
  - Visual Studio 2013+
  - IIS

### Run

#### 前端

- 前置配置
  1. 保证数据 API 和设备 API 服务器均已运行并在内网（可被前端访问到的网络下）
  2. 修改 `app/sources/sources/handler.js` 中的服务器域名和端口（请注意保持 url 的 其它部份不变）
     - `publicPath`：设备 API 服务器地址
     - `graphqlPath`: 数据 API 服务器地址

- 初次运行

```bash
# 确保己安装好 yarn，并在终端中进入 <root>/applications
yarn install

cd app && yarn install
cd ../ && yarn dev
```

- 非初次运行

```bash
yarn dev
```

#### 数据 API 服务器

- 前置配置
  - 安装好 docker 并开启
- 初次运行
```bash
# 确保现在 <root>/application/server 下
yarn install
cd ../ && yarn server:dev
```
- 非初次运行
```bash
# 在 <root>/application 下
yarn server:dev
```

#### 设备 API 服务器

1. 先用 VS 运行一次，使其在 IIS 中运行。
2. 进入“我的文裆”（Windows）
3. 找到 `IIS/
4. 重新在 VS 中运行

