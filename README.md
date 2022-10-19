本项目由 vite + React + ts + styled-components + pnpm 搭建

本地预览 `git clone https://github.com/Muxi-X/forum-fe.git && cd forum-fe && pnpm install && pnpm dev`

本地 server `pnpm build && pnpm run server`

# 项目目录

```
├── src
│   ├── components      # 公共组件
│   ├── hooks           # 自定义hook
│   ├── pages           # 页面
│   ├── service         # 网络请求部分
│   ├── store           # 全局状态
│   ├── type            # 全局类型声明
│   ├── utils           # 工具函数
│   ├── db              # IndexDB部分
│   ├── App.tsx
│   ├── main.tsx
│   ├── router.tsx
│   └── vite-env.d.ts
├── README.md
├── index.html
├── node_modules
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
```

**pages 下也会有 style 和 component 目录，对应相应页面独有的组件和样式**

# Git 规范

### 提交规范

- 添加新功能 `git commit -m ":new: [feat]: $新功能`
- 修改 bug `git commit -m ":bug: [fix]: $修改内容"`
- 代码重构(功能重构) `git commit -m ":hammer: [refactor] $重构内容"`
- 修改样式(样式重构) `git commit -m ":art: [fix]" $修改内容`

上面是基本规范，关于更多的，包括添加测试、升级依赖版本、等请参阅 [git 开发规范](https://juejin.cn/post/6844903635533594632)，[git Emoji](https://github.com/liuchengxu/git-commit-emoji-cn)。

合作开发时的[pr 教程](https://juejin.cn/post/6949848117072101384)

# 开发规范

# 技术要点

### 1. 路由设计

React-Router v6 使用 useRoutes 配置路由，自定义插件生成 Routes 数组，具体可以参考 umi 的[约定式路由](https://v3.umijs.org/zh-CN/docs/convention-routing)

**注：现已替换成[vite-plugin-pages](https://github.com/hannoeru/vite-plugin-pages)**

### 2. 状态管理方案

内部状态简单的用 useState / useReducer 维护
全局状态使用 [zustand](https://github.com/pmndrs/zustand) 一个极简的类 redux 库

全局状态为:

- User: 个人信息 包括 Role, UserId, avatarUrl 等字段信息
- ArticleList: 就是文章列表，直接放全局便于管理，不然组件间的通信会很麻烦，比如搜索框是放在 Header 组件里面的，如果不用全局状态设置文章列表的话就需要通过状态提升+callback 的形式才能拿到搜索后的文章结果
- Ws 全局 WebSocket 对象
- Chat 聊天记录/联系人列表

### 3. 网络请求

pont + useRequest

用 pont 拉取数据源后，记得在 mods/index.js 添加 `export default window.API`
因为 esm 的工作原理是使用才会打包，如果不 export 到 main.tsx 中去使用的话，index.js 不被会被打包执行， window.API 也不会被执行，那么全局的 API 就是 undefined

**注: 如果重新生成 pont, services/pontCore 也需要修改， 就是把 CommonJs 语法改成 esm 语法**

### 4. IndexDB 使用

使用 [Dexie.js](https://dexie.org/)

使用 IndexDB 对文章草稿储存 直到该文章发布成功/被删除才从 IndexDB 中销毁

对联系人信息进行缓存

### 工具函数的使用

ahooks

### 有意义的点

1. 闭包陷阱的解决 (Editore 那里)
2. 对 useRequest 的再封装， 全局 Loading 状态的处理
3. ws 使用等等等等

# 迭代点

1. 目前的文章的 Markdown css 是我自己写的，只有一种风格，后续可以开发新的风格 然后统一放在 src/assets/theme 目录下, 然后在可以做一写额外的 API 封装到 Editor 中去用来配置风格
2. 聊天添加上传文件功能，Toolbar 已经封装好了
3. 添加新需求，比如关注功能，专栏需求等
