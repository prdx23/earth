import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path'
import glsl from 'vite-plugin-glsl';


export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd (), '')
    return {
        plugins: [glsl()],
        server: {
            host: true,
            port: 2323,
        },
        define: {
            'DEV_CDN_URL': JSON.stringify(env.VITE_DEV_CDN_URL),
            'PROD_CDN_URL': JSON.stringify(env.VITE_PROD_CDN_URL),
        },

    }
})

