import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins: PluginOption[] = [react()]

  // This will only enable the TanStack Router plugin for the 'serve' (dev)
  // command. The 'build' command will not run the plugin, and will instead
  // use the existing `routeTree.gen.ts` file from your repository.
  if (command === 'serve') {
    plugins.push(TanStackRouterVite())
  }

  return {
    plugins,
    define: {
      'process.env': {},
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      watch: {
        ignored: ['**/src/routeTree.gen.ts'],
      },
    },
  }
})