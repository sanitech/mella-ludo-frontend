export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-hot-toast']
        }
      }
    },
    // Drop console.log using esbuild
    terserOptions: undefined, // <-- not needed
    esbuild: {
      drop: ['console']
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
