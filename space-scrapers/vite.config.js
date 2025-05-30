import { defineConfig } from 'vite'

export default defineConfig({
    base: '/space-scrapers/',
    build: {
        outDir: 'dist',
        emptyOutDir: true
    }
})