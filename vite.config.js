import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      jsxImportSource: '@emotion/react',
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.jsx'),
      name: 'OpenIMISFePolicyholder',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format}.js`
    },
    sourcemap: true,
    outDir: 'dist',
    rollupOptions: {
      external: [
        /^@babel.*/,
        /^@date-io\/.*/,
       
        /^@openimis.*/,
        'classnames',
        'clsx',
        'history',
        /^lodash.*/,
        'moment',
        'prop-types',
        /^react.*/,
        /^redux.*/,
        '@mui/material',
        '@mui/icons-material',
        '@mui/system'
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
})
