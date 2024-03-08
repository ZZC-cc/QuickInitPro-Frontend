var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/// <reference types="vitest" />
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as process from 'node:process';
import { loadEnv } from 'vite';
import { createVitePlugins } from './plugins';
import { OUTPUT_DIR } from './plugins/constants';
var baseSrc = fileURLToPath(new URL('./src', import.meta.url));
// https://vitejs.dev/config/
export default (function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd());
    var proxyObj = {};
    if (mode === 'development' && env.VITE_APP_BASE_API_DEV && env.VITE_APP_BASE_URL_DEV) {
        proxyObj[env.VITE_APP_BASE_API_DEV] = {
            target: env.VITE_APP_BASE_URL_DEV,
            changeOrigin: true,
            rewrite: function (path) { return path.replace(new RegExp("^".concat(env.VITE_APP_BASE_API_DEV)), ''); },
        };
    }
    return {
        plugins: createVitePlugins(env),
        resolve: {
            alias: [
                {
                    find: 'dayjs',
                    replacement: 'dayjs/esm',
                },
                {
                    find: /^dayjs\/locale/,
                    replacement: 'dayjs/esm/locale',
                },
                {
                    find: /^dayjs\/plugin/,
                    replacement: 'dayjs/esm/plugin',
                },
                {
                    find: 'vue-i18n',
                    replacement: mode === 'development' ? 'vue-i18n/dist/vue-i18n.esm-browser.js' : 'vue-i18n/dist/vue-i18n.esm-bundler.js',
                },
                {
                    find: /^ant-design-vue\/es$/,
                    replacement: 'ant-design-vue/es',
                },
                {
                    find: /^ant-design-vue\/dist$/,
                    replacement: 'ant-design-vue/dist',
                },
                {
                    find: /^ant-design-vue\/lib$/,
                    replacement: 'ant-design-vue/es',
                },
                {
                    find: /^ant-design-vue$/,
                    replacement: 'ant-design-vue/es',
                },
                {
                    find: 'lodash',
                    replacement: 'lodash-es',
                },
                {
                    find: '~@',
                    replacement: baseSrc,
                },
                {
                    find: '~',
                    replacement: baseSrc,
                },
                {
                    find: '@',
                    replacement: baseSrc,
                },
                {
                    find: '~#',
                    replacement: resolve(baseSrc, './enums'),
                },
            ],
        },
        build: {
            chunkSizeWarningLimit: 4096,
            outDir: OUTPUT_DIR,
            rollupOptions: {
                output: {
                    manualChunks: {
                        vue: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
                        antd: ['ant-design-vue', '@ant-design/icons-vue', 'dayjs'],
                        // lodash: ['loadsh-es'],
                    },
                },
            },
        },
        server: {
            port: 6678,
            host: '0.0.0.0',
            proxy: __assign({}, proxyObj),
        },
        test: {
            globals: true,
            environment: 'jsdom',
        },
    };
});
