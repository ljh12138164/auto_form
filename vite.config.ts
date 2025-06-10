import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import tailwindcss from "@tailwindcss/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 80,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
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
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    }
  },
});
