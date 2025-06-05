<template>
  <el-aside width="220px" class="bg-gray-50 border-r border-gray-200">
    <div class="h-full flex flex-col">
      <h5 class="h-[64px] flex justify-center items-center">AUTO FORM</h5>
      <!-- 菜单 -->
      <BaseMenu></BaseMenu>
      <div class="p-4 border-t border-gray-200">
        <div class="bg-blue-50 rounded-lg p-3">
          <div class="flex text-sm items-center space-x-2">
            用户名：
            <span class="text-sm bg-gray-50">{{
              userStore.userInfo?.username
            }}</span>
          </div>
          <div
            class="mt-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
          >
            邮箱：<span :title="userStore.userInfo?.email">{{
              userStore.userInfo?.email
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </el-aside>
</template>

<script setup lang="ts">
import BaseMenu from "../../components/BaseMenu/index.vue";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
</script>

<style lang="scss" scoped>
:deep(.el-aside) {
  overflow: hidden;
}
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
