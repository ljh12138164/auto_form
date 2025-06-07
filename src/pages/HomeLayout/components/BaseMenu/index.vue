<template>
  <div class="base-menu">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical"
      background-color="#f9fafb"
      text-color="#374151"
      active-text-color="#3b82f6"
      @select="handleSelect"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.index"
        :index="item.index"
        class="menu-item"
      >
        <el-icon class="mr-2">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  House,
  Edit,
  Document,
  Star,
  DataAnalysis,
  Download,
} from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
// 菜单项数据 - 针对表单设计后台系统
const menuItems = ref([
  {
    index: "1",
    title: "仪表盘",
    icon: House,
    path: "/dashboard",
    description: "数据概览和统计",
  },
  {
    index: "2",
    title: "表单设计器",
    icon: Edit,
    path: "/form-designer",
    description: "拖拽式表单设计",
  },
  {
    index: "3",
    title: "表单管理",
    icon: Document,
    path: "/form-management",
    description: "管理我的表单",
  },
  {
    index: "4",
    title: "模板中心",
    icon: Star,
    path: "/template-center",
    description: "表单模板库",
  },
  {
    index: "5",
    title: "数据管理",
    icon: DataAnalysis,
    path: "/data-management",
    description: "表单数据查看",
  },
  {
    index: "6",
    title: "代码生成",
    icon: Download,
    path: "/code-generator",
    description: "导出Vue3代码",
  },
]);

// 当前激活的菜单项
const activeIndex = computed(() => {
  // 获取当前路由的子路径部分
  let currentPath = route.path;

  // 如果是 /home 根路径，默认为 dashboard
  if (currentPath === "/home") {
    console.log("当前路径是 /home");
    currentPath = "/dashboard";
    console.log("修改后的路径是：", currentPath);
  } else if (currentPath.startsWith("/home/")) {
    // 提取 /home/ 后面的部分
    currentPath = currentPath.replace("/home", "");
  }

  // 处理子路由情况 - 查找匹配的菜单项
  const matchedItem = menuItems.value.find((item) => {
    // 精确匹配
    if (item.path === currentPath) {
      return true;
    }
    // 子路由匹配 - 当前路径以菜单项路径开头
    if (currentPath.startsWith(item.path + "/")) {
      return true;
    }
    return false;
  });

  return matchedItem?.index;
});
onMounted(() => {
  if (route.path === "/home") {
    router.replace("/home/dashboard");
  }
});
// 菜单选择处理
const handleSelect = (index: string) => {
  // 如果点击的是当前激活的菜单项，则不进行跳转
  if (index === activeIndex.value) {
    console.log("当前菜单已激活，无需重复跳转");
    return;
  }

  const selectedItem = menuItems.value.find((item) => item.index === index);
  if (selectedItem) {
    const targetPath = "/home" + selectedItem.path;

    // 检查是否跳转到相同路径
    if (route.path === targetPath) {
      console.log("已在目标路径，无需跳转");
      return;
    }
    console.log("选中菜单:", selectedItem.title, selectedItem.path);
    router.push(targetPath);
  }
};
</script>

<style lang="scss" scoped>
.base-menu {
  width: 100%;
  height: 100%;
}

.el-menu-vertical {
  border-right: none;
  height: 100%;
}

.menu-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #e5e7eb !important;
  }

  &.is-active {
    background-color: #dbeafe !important;
    color: #3b82f6 !important;

    .el-icon {
      color: #3b82f6;
    }
  }
}

:deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;

  &:hover {
    background-color: #e5e7eb;
  }

  &.is-active {
    background-color: #dbeafe;
    color: #3b82f6;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background-color: #3b82f6;
      border-radius: 0 2px 2px 0;
    }
  }
}

:deep(.el-icon) {
  margin-right: 8px;
  font-size: 16px;
}
</style>
