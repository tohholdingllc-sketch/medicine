import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
// viteSingleFile: la build produce un unico dist/index.html con CSS e JS
// incorporati, così è facilissimo da caricare/embeddare ovunque.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
})
