import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import tailwindcss from "@tailwindcss/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: true,
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: true,
      }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      // 开发环境配置
      port: 3001, // 改为普通端口
      host: '0.0.0.0', // 允许外部访问
      open: true, // 自动打开浏览器
      proxy: {
        // 只在开发环境使用代理
        "/api": {
          target: env.VITE_APP_BASE_API || "http://localhost:3000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    // 预览服务器配置（用于生产构建预览）
    preview: {
      port: 4173,
      host: '0.0.0.0',
    },
    build: {
      // 生产环境构建配置
      outDir: 'dist',
      sourcemap: false, // 生产环境不生成 sourcemap
      minify: 'esbuild', // 使用 esbuild 压缩
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // Element Plus 相关
              if (id.includes("element-plus")) {
                return "element-plus";
              }
              if (id.includes("@element-plus/icons-vue")) {
                return "element-icons";
              }

              // Vue 生态
              if (id.includes("vue") && !id.includes("vuedraggable")) {
                return "vue-core";
              }
              if (id.includes("pinia")) {
                return "pinia";
              }
              if (id.includes("vue-router")) {
                return "vue-router";
              }

              // 图表库
              if (id.includes("echarts")) {
                return "echarts";
              }

              // 拖拽相关
              if (id.includes("sortablejs") || id.includes("vuedraggable")) {
                return "drag-drop";
              }

              // 样式库
              if (id.includes("tailwindcss") || id.includes("normalize.css")) {
                return "styles";
              }

              // HTTP 相关
              if (id.includes("axios")) {
                return "http";
              }

              // 工具库
              if (id.includes("nprogress")) {
                return "utils";
              }

              // 其他第三方库
              return "vendor";
            }

            // 功能模块分包
            if (id.includes("/pages/Designer/")) {
              return "designer";
            }
            if (id.includes("/pages/CodeGenerator/")) {
              return "code-generator";
            }
            if (id.includes("/pages/HomePage/")) {
              return "homepage";
            }
            if (id.includes("/pages/LoginPage/")) {
              return "auth";
            }

            // API 模块分包
            if (id.includes("/api/designer/")) {
              return "api-designer";
            }
            if (id.includes("/api/dashboard/")) {
              return "api-dashboard";
            }
            if (id.includes("/api/templates/")) {
              return "api-templates";
            }
          },
        },
      },
    },
    // 环境变量配置
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    },
  };
});