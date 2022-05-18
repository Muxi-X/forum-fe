import fs from 'fs';
import path from 'path';
import virtual from '@rollup/plugin-virtual';
import { Plugin } from 'vite';

interface Route {
  name: string;
  path: string;
  element: any;
  children: Route[];
}
// 解析动态路由
const parseDynamicRoutes = (name: string): string => {
  if (name.startsWith('[') && name.endsWith(']'))
    return name.endsWith('$]') ? `:${name.slice(1, -2)}?` : `:${name.slice(1, -1)}`;
  return name;
};
// 解析pages目录生成字符Routes
const parsePagesDirectory = (
  dir: string,
  { prependName, prependPath } = { prependName: '', prependPath: '/' },
): { routes: string[] } => {
  let routes = [];
  // 获取当前目录下的文件夹和文件  withFileTypes表示是否将返回值作为 fs.Dirent对象返回
  const siblings = fs.readdirSync(dir, { withFileTypes: true });
  // 筛选出文件
  const files = siblings
    .filter((f) => f.isFile() && f.name.endsWith('.tsx') && !f.name.startsWith('-'))
    .map((f) => f.name);
  // 筛选出文件夹
  const directories = siblings
    .filter((f) => f.isDirectory())
    .map((d) => d.name)
    .filter((n) => n !== 'components' && n !== 'style');
  // 遍历文件
  for (const name of files) {
    const f = { name: name.split('.')[0], importPath: path.join(dir, name) };
    const routeOptions = [];

    // 处理NotFound情况
    if (f.name == '404') {
      routeOptions.push(`"name": "NotFound"`);
      routeOptions.push(`"element": "() => import('/${f.importPath}')"`);
      routeOptions.push(`"path": "*"`);
      routes.push(`{ ${routeOptions.join(', ')} }`);
      continue;
    }
    // 处理没有子路由或者有子路由但子路由中没有index默认路由的情况
    if (
      !directories.includes(f.name) ||
      !fs.existsSync(path.join(dir, f.name, 'index.tsx'))
    ) {
      const routeName =
        f.name === 'index' && prependName
          ? prependName.slice(0, -1)
          : prependName + f.name.replace(/^_/, '');
      routeOptions.push(`"name": "${routeName}"`);
    }
    // 处理路由path
    routeOptions.push(
      `"path": "${prependPath}${
        f.name === 'index' || f.name === 'layout'
          ? ''
          : parseDynamicRoutes(f.name).replace(/^_/, ':')
      }"`.toLocaleLowerCase(),
    );
    // 处理路由element
    routeOptions.push(`"element": "() => import('/${f.importPath}')"`);
    // Route children
    if (directories.includes(f.name)) {
      const children = parsePagesDirectory(path.join(dir, f.name), {
        prependName: `${prependName}${f.name.replace(/^_/, '')}-`,
        prependPath: '',
      }).routes;
      routeOptions.push(`"children": [ ${children.join(', ')} ]`);
    }
    routes.push(`{ ${routeOptions.join(', ')} }`);
  }

  // 上面的代码已经处理过子路由的问题，那么在最终合并时我们需要过滤掉这部分
  const filesWithoutExtension = files.map((f) => f.slice(0, -4));
  const remainingDirectories = directories.filter(
    (d) => !filesWithoutExtension.includes(d),
  );
  for (const name of remainingDirectories) {
    const parsedDir = parsePagesDirectory(path.join(dir, name), {
      prependName: `${prependName}${name.replace(/^_/, '')}-`,
      prependPath: `${prependPath}${parseDynamicRoutes(name).replace(/^_/, ':')}/`,
    });
    routes = routes.concat(parsedDir.routes);
  }
  return { routes };
};
// 解析字符Routes为Js Routes
const parse = (routes: string[], lazy: any) => {
  const parseChildren = (children: Route[]) => {
    return children.map((c: Route) => {
      if (c.children) c.children = parseChildren(c.children);
      return { ...c, element: lazy(eval(c.element)) };
    });
  };
  return routes.map((route) => {
    const r = JSON.parse(route);
    r.element = lazy(eval(r.element));
    if (r.children) {
      r.children = parseChildren(r.children);
    }
    return r;
  });
};
// 抽象出的函数 用于生成虚拟模块的具体内容
const makeModuleContent = (pagesDir: string) => {
  const { routes } = parsePagesDirectory(pagesDir);
  return `
  export default [${routes.map((route) => JSON.stringify(route)).join(', \n')}]\n 
  export const parse = ${parse} `;
};
// 插件函数 返回值是一个插件对象
const React_Auto_Routes = ({ pagesDir } = { pagesDir: 'src/pages/' }): Plugin => {
  // 这里是为了表示react-auto-routes是一个虚拟模块 具体作用不清楚
  const rollupInputOptions = {
    plugins: [virtual({ 'react-auto-routes': makeModuleContent(pagesDir) })],
  };

  return {
    name: 'react-auto-route',
    configureServer: (server) => {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.includes('react-auto-routes')) {
          const routes = makeModuleContent(pagesDir);
          res.setHeader('Content-Type', 'application/javascript');
          res.end(routes);
        } else {
          await next();
        }
      });
    },
    resolveId: (source) => {
      if (source.includes('react-auto-routes')) return source; // 表示命中该资源 如果没有这个hook会报错
      return null;
    },
    options: () => rollupInputOptions,
  };
};

export default React_Auto_Routes;
