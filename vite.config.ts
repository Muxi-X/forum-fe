import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import autoRoute from './src/plugins/vite-plugin-react-autoroutes';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
              fileName: false,
              ssr: false,
            },
          ],
        ],
      },
    }),
    autoRoute({ pagesDir: 'src/pages/' }),
  ],
});
