import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'public',
    emptyOutDir: false // Don't empty the public directory since we're building into it
  },
  plugins: [
    react(),
    {
      name: 'copy-icons',
      buildStart() {
        // Copy icons from assets/ico to public/ico during development and build
        const srcDir = resolve(__dirname, 'assets/ico')
        const publicIcoDir = resolve(__dirname, 'public/ico')
        
        if (!existsSync(publicIcoDir)) {
          mkdirSync(publicIcoDir, { recursive: true })
        }
        
        if (existsSync(srcDir)) {
          const files = readdirSync(srcDir)
          
          files.forEach((file: string) => {
            const srcFile = resolve(srcDir, file)
            const destFile = resolve(publicIcoDir, file)
            copyFileSync(srcFile, destFile)
          })
        }
      }
    }
  ],
})
