import {defineConfig, splitVendorChunkPlugin} from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import {visualizer} from 'rollup-plugin-visualizer';

const VISUALIZER = false; // change to see the current bundle.

const bigPackages = [
    'prompt.ts',
    'lodash',
    'react-nice',
    'localforage',
    'highlight.js',
    'mathematica.js',
    'entities.json',
    'chroma.js',
    '',]
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        svgr(),
        splitVendorChunkPlugin(),
        VISUALIZER &&
        visualizer({
            open: true,
            gzipSize: true,
            filename: 'chunks-report.html',
        }),
    ],
    server: {
        host: '0.0.0.0'
    },
    base: './',
    build: {
        outDir: "build/dist",
        minify: true,
        emptyOutDir: true,
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    for (const p of bigPackages) {
                        if (p && id.includes(p)) {
                            return p
                        }
                    }
                    if (
                        id.includes('react-router-dom') ||
                        id.includes('@remix-run') ||
                        id.includes('react-router')
                    ) {
                        return '@react-router';
                    }
                },
            },
        },
    },
})
