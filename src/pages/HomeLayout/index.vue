<template>
  <div class="common-layout">
    <el-container class="h-screen">
      <!-- 左侧边栏 -->
      <BaseAside></BaseAside>
      <!-- 右侧容器 -->
      <el-container class="flex-1">
        <!-- 头部 -->
        <el-header
          class="bg-gray-50 border-b border-gray-200 px-6 flex items-center justify-end"
        >
          <HomeHeader @logout="logout"></HomeHeader>
        </el-header>
        <!-- 主内容区 -->
        <el-main class="bg-gray-white p-6 h-full">
          <div class="bg-white rounded-lg shadow-sm p-6 h-full">
            <RouterView></RouterView>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/modules/user";
import { useRouter } from "vue-router";
import BaseAside from "./components/BaseAside/index.vue";
import HomeHeader from "./components/HomeHeader/index.vue";
const userStore = useUserStore();
const router = useRouter();

const logout = async () => {
  await userStore.logout();
  router.replace("/login");
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

:deep(.el-main) {
  padding: 0;
}

:deep(.el-header) {
  padding: 0;
  height: 64px;
}
</style>
