import { svelte } from "@sveltejs/vite-plugin-svelte"
import fs from 'fs/promises'
import { join } from "path"
import { defineConfig, PluginOption } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), updateScripts()],
  build: {
    sourcemap: true,
    manifest: true,
    rollupOptions: {
      input: {
        background: 'src/background/index.ts',
        sidepanel: 'src/sidepanel/index.html',
      },
    },
  }
})

function updateScripts() {
  return {
    name: 'update scripts',
    async writeBundle({ dir }) {
      const files = JSON.parse(
        (await fs.readFile(join(dir, '.vite', 'manifest.json'))).toString())
      await fs.writeFile(join(dir, 'background.js'),
        `import './${files['src/background/index.ts'].file}'`)
    },
  } as PluginOption
}
