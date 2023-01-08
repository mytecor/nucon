import react from '@vitejs/plugin-react'
import _ from 'lodash'
import { defineConfig } from 'vite'

export default defineConfig({
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_'],

  root: './src',
  publicDir: '../public',

  build: {
    emptyOutDir: true,
    outDir: '../dist',

    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },

    target: ['es2021', 'chrome100', 'safari13'],
    minify: process.env.TAURI_DEBUG == null && 'esbuild',
    sourcemap: process.env.TAURI_DEBUG != null,
  },

  css: {
    modules: {
      localsConvention: (name) => `$${_.camelCase(name)}`,
    },
  },

  server: {
    port: 1420,
    strictPort: true,
  },

  plugins: [react()],
})
