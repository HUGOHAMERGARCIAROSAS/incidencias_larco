import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  // base: '/incidencias_mdvlh/',
  base: '/',
  build: {
    outDir: 'dist', 
  },
  server: {
    historyApiFallback: true
  }
})
