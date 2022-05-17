import fs from 'fs';
import path from 'path';
import virtual from '@rollup/plugin-virtual';
import { Plugin } from 'vite';

type AutoRoutes = {
  routes: string[];
};

interface DirProps {
  pagesDir: string;
}

const parsePagesDirectory = (
  dir: string,
  { prependName, prependPath } = { prependName: '', prependPath: '/' },
): AutoRoutes => {
  let routes = [];
  // 获取当前目录下的文件夹和文件  withFileTypes表示是否将返回值作为 fs.Dirent对象返回
  const siblings = fs.readdirSync(dir, { withFileTypes: true });
  // 筛选出文件
  const files = siblings
    .filter((f) => f.isFile() && f.name.endsWith('.tsx') && !f.name.startsWith('-'))
    .map((f) => f.name);
  // 筛选出文件夹
  const directories = siblings.filter((f) => f.isDirectory()).map((d) => d.name);
  // 遍历文件
  for (const name of files) {
    const f = { name: name.split('.')[0], importPath: path.join(dir, name) };
    const routeOptions = [];

    // 处理NotFound情况
    if (f.name == 'NotFound') {
      routeOptions.push(`"name": "NotFound"`);
      routeOptions.push(`"component": "() => import('/${f.importPath}')"`);
      routeOptions.push(`"path": "*"`);
      routes.push(`{ ${routeOptions.join(', ')} }`);
      continue;
    }
    if (
      !directories.includes(f.name) ||
      !fs.existsSync(path.join(dir, f.name, 'index.jsx'))
    ) {
      const routeName =
        f.name === 'index' && prependName
          ? prependName.slice(0, -1)
          : prependName + f.name.replace(/^_/, '');
      routeOptions.push(`"name": "${routeName}"`);
    }
    // Route path
    routeOptions.push(
      `"path": "${prependPath}${
        f.name === 'index' ? '' : f.name.replace(/^_/, ':')
      }"`.toLocaleLowerCase(),
    );
    // Route component
    routeOptions.push(`"component": "() => import('/${f.importPath}')"`);
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

  // If a directory exists with the same name as a sibling file, it means the folder acts as
  // children routes. Those children are dealt with above, so we filter them out here.
  const filesWithoutExtension = files.map((f) => f.slice(0, -4));
  const remainingDirectories = directories.filter(
    (d) => !filesWithoutExtension.includes(d),
  );
  for (const name of remainingDirectories) {
    const parsedDir = parsePagesDirectory(path.join(dir, name), {
      prependName: `${prependName}${name.replace(/^_/, '')}-`,
      prependPath: `${prependPath}${name.replace(/^_/, ':')}/`,
    });
    routes = routes.concat(parsedDir.routes);
  }
  return { routes };
};

const parse = (routes: string[], lazy: any) => {
  const parseChildren = (children: any) => {
    return children.map((c: any) => {
      if (c.children) c.children = parseChildren(c.children);
      return { ...c, component: lazy(eval(c.component)) };
    });
  };
  return routes.map((route) => {
    const r = JSON.parse(route);
    r.component = lazy(eval(r.component));
    if (r.children) {
      r.children = parseChildren(r.children);
    }
    return r;
  });
};

const makeModuleContent = ({ pagesDir }: DirProps) => {
  const { routes } = parsePagesDirectory(pagesDir);
  return `
  export default [${routes.map((route) => JSON.stringify(route)).join(', \n')}]\n 
  export const parse = ${parse} `;
};

const MyPlugin = ({ pagesDir } = { pagesDir: 'src/pages/' }): Plugin => {
  const rollupInputOptions = {
    plugins: [virtual({ 'react-auto-routes': makeModuleContent({ pagesDir }) })],
  };

  return {
    name: 'react-auto-route',
    configureServer: (server) => {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.includes('react-auto-routes')) {
          const routes = makeModuleContent({ pagesDir });
          res.setHeader('Content-Type', 'application/javascript');
          res.end(routes);
        } else {
          await next();
        }
      });
    },
    resolveId: (source) => {
      if (source.includes('react-auto-routes')) return source;
      return null;
    },
    options: () => rollupInputOptions,
  };
};

export default MyPlugin;
