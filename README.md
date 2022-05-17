开发由 vite + React + ts + styled-components + pnpm 搭建

本地预览  `git clone https://github.com/Muxi-X/forum-fe.git && cd forum-fe && pnpm install && pnpm dev`

本地server `pnpm build && pnpm server`

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

# Git 规范

### 提交规范

+ 添加新功能 `git commit -m ":new: [feat]: $新功能`
+ 修改bug `git commit -m ":bug: [fix]: $修改内容"`
+ 代码重构(功能重构) `git commit -m ":hammer: [refactor] $重构内容"`
+ 修改样式(样式重构) `git commit -m ":art: [fix]" $修改内容`
  

上面是基本规范，关于更多的，包括添加测试、升级依赖版本、等请参阅 [git开发规范](https://juejin.cn/post/6844903635533594632)，[git Emoji](https://github.com/liuchengxu/git-commit-emoji-cn)。

合作开发时的[pr教程](https://juejin.cn/post/6949848117072101384)

# 开发规范(TODO)

### 1. 路由设计
React-Router v6 使用 useRoutes配置路由


### 2. 状态管理方案
内部状态简单的用useState / useReducer 维护
全局状态使用 zustand 一个极简的类redux库 [地址](https://github.com/pmndrs/zustand)

### 3. 网络请求
自定义useFetch


### 4. IndexDB使用
使用IndexDB对文章草稿储存 直到该文章发布成功/被删除才从IndexDB中销毁 使用 [Dexie.js](https://dexie.org/)


### 工具函数的使用
ahooks




### 有意义的点
1. 闭包陷阱的解决