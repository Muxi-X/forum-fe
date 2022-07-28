本项目由vite + React + ts + styled-components + pnpm搭建

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
**pages下也会有style和component目录，对应相应页面独有的组件和样式**

# Git 规范

### 提交规范

+ 添加新功能 `git commit -m ":new: [feat]: $新功能`
+ 修改bug `git commit -m ":bug: [fix]: $修改内容"`
+ 代码重构(功能重构) `git commit -m ":hammer: [refactor] $重构内容"`
+ 修改样式(样式重构) `git commit -m ":art: [fix]" $修改内容`
  

上面是基本规范，关于更多的，包括添加测试、升级依赖版本、等请参阅 [git开发规范](https://juejin.cn/post/6844903635533594632)，[git Emoji](https://github.com/liuchengxu/git-commit-emoji-cn)。

合作开发时的[pr教程](https://juejin.cn/post/6949848117072101384)

# 开发规范


# 技术要点

### 1. 路由设计
React-Router v6 使用 useRoutes配置路由，自定义插件生成Routes数组，具体可以参考umi的[约定式路由](https://v3.umijs.org/zh-CN/docs/convention-routing)

### 2. 状态管理方案
内部状态简单的用useState / useReducer 维护
全局状态使用 zustand 一个极简的类redux库 [地址](https://github.com/pmndrs/zustand)

全局状态为: 
 + User: 个人信息 包括Role, UserId, avatarUrl 等字段信息
+  ArticleList: 就是文章列表，直接放全局便于管理，不然组件间的通信会很麻烦，比如搜索框是放在Header组件里面的，如果不用全局状态设置文章列表的话就需要通过状态提升+callback的形式才能拿到搜索后的文章结果

### 3. 网络请求
pont + fetch


### 4. IndexDB使用
使用IndexDB对文章草稿储存 直到该文章发布成功/被删除才从IndexDB中销毁 使用 [Dexie.js](https://dexie.org/)


### 工具函数的使用
ahooks


### 有意义的点
1. 闭包陷阱的解决


# 迭代点

目前的文章的Markdown css 是我自己写的，只有一种风格，后续可以开发新的风格 然后统一放在 src/assets/theme 目录下
然后在可以做一写额外的API封装到Editor中去用来配置风格
