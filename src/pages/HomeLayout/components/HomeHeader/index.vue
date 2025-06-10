<template>
  <!-- 右上角头像下拉菜单 -->
  <div class="flex items-center space-x-4">
    <!-- 用户头像下拉菜单 -->
    <el-dropdown trigger="click">
      <div
        class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
      >
        <el-avatar
          alt="用户头像"
          aria-label="用户头像"
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
</template>

<script setup lang="ts">
import { ArrowDown, SwitchButton } from "@element-plus/icons-vue";

const emits = defineEmits<{
  (event: "logout"): void;
}>();
const logout = () => {
  emits("logout");
};
</script>

<style lang="scss" scoped>
:deep(.el-header) {
  padding: 0;
  height: 64px;
}
</style>
