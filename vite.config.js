import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
const { resolve } = require("path");
// https://vitejs.dev/config/
export default ({ mode }) => {
  const env=loadEnv(mode, process.cwd())
  const app_host = env.VITE_APP_API_URL;
  let pageName = env.VITE_PAGE_NAME
  let pageRoot=env.VITE_PAGE_ROOT
  console.log('页面名称',pageName)
  console.log('页面人口',pageRoot)
  return defineConfig({
    define: {
      'process.env': env
    },
    plugins: [
      vue(),
    ],
    root:pageRoot,
    // 项目部署的基础路径
    build: {
      outDir: resolve(__dirname, `dist/${pageName}`),
      rollupOptions: {
        input: {
          main: resolve(__dirname, `${pageRoot}/index.html`),
        },
      },
    },
    server: {
      open: '/',
      port: 3030,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: app_host, // 需要请求的地址
          changeOrigin: true, // 是否跨域
          rewrite: (path) => path.replace(/^\/api/, ""),
        }
      },
    },
    resolve: {
      alias: [
        //配置别名
        { find: "@", replacement: resolve(__dirname, pageRoot) },
        { find: "@views", replacement: resolve(__dirname,`${pageRoot}/views`) },
      ],
      // 情景导出 package.json 配置中的exports字段
      conditions: [],
      // 导入时想要省略的扩展名列表
      // 不建议使用 .vue 影响IDE和类型支持
      extensions: ['.vue',".mjs", ".js", ".ts", ".jsx", ".tsx", ".json"],
    },
  });
};
