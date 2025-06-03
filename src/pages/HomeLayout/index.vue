<template>
  <div class="common-layout">
    <el-container class="h-screen">
      <!-- 左侧边栏 -->
      <el-aside width="200px" class="bg-gray-50 border-r border-gray-200">
        <div class="h-full flex flex-col">
          <h5 class="h-[64px] flex justify-center items-center">AUTO FORM</h5>
          <!-- 菜单 -->
          <BaseMenu></BaseMenu>
          <div class="p-4 border-t border-gray-200">
            <div class="bg-blue-50 rounded-lg p-3">
              <div class="flex items-center space-x-2">
                <span class="text-sm bg-gray-50">用户名：</span>
              </div>
              <div class="mt-2 text-sm">
                邮箱：
              </div>
            </div>
          </div>
        </div>
      </el-aside>

      <!-- 右侧容器 -->
      <el-container class="flex-1">
        <!-- 头部 -->
        <el-header
          class="bg-gray-50 border-b border-gray-200 px-6 flex items-center justify-end"
        >
          <!-- 右上角头像下拉菜单 -->
          <div class="flex items-center space-x-4">
            <!-- 用户头像下拉菜单 -->
            <el-dropdown trigger="click">
              <div
                class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
              >
                <el-avatar
                  :size="32"
                  src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
                <el-icon class="text-gray-400">
                  <ArrowDown />
                </el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout" @click="logout">
                    <el-icon class="mr-2"><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="bg-gray-50 p-6">
          <div class="bg-white rounded-lg shadow-sm p-6 min-h-full">
            1
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";
import { ArrowDown, SwitchButton } from "@element-plus/icons-vue";
import BaseMenu from "@/components/BaseMenu/index.vue";

const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
// 确保全局样式
:global(html, body, #app) {
  height: 100%;
  margin: 0;
  padding: 0;
}

.common-layout {
  height: 100vh;
}

// Element Plus 深度样式调整
:deep(.el-container) {
  height: 100%;
}

:deep(.el-aside) {
  overflow: hidden;
}

:deep(.el-main) {
  padding: 0;
}

:deep(.el-header) {
  padding: 0;
  height: 64px;
}

// 响应式设计
@media (max-width: 768px) {
  :deep(.el-aside) {
    width: 60px !important;

    .p-4 {
      padding: 0.5rem;
    }

    span,
    .text-sm,
    .text-xs {
      display: none;
    }
  }
}
</style>
