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
  import { ref } from 'vue'
  import {
    House,
    Document,
    User,
    DataAnalysis,
    Files,
    Bell
  } from '@element-plus/icons-vue'
  
  // 菜单项数据
  const menuItems = ref([
    {
      index: '1',
      title: '仪表盘',
      icon: House,
      path: '/home'
    },
    {
      index: '2',
      title: '表单管理',
      icon: Document,
      path: '/forms'
    },
    {
      index: '3',
      title: '数据分析',
      icon: DataAnalysis,
      path: '/analytics'
    },
    {
      index: '4',
      title: '文件管理',
      icon: Files,
      path: '/files'
    },
    {
      index: '5',
      title: '用户管理',
      icon: User,
      path: '/users'
    },
    {
      index: '6',
      title: '消息通知',
      icon: Bell,
      path: '/notifications'
    },
  ])
  
  // 当前激活的菜单项
  const activeIndex = ref('1')
  
  // 菜单选择处理
  const handleSelect = (index: string) => {
    activeIndex.value = index
    const selectedItem = menuItems.value.find(item => item.index === index)
    if (selectedItem) {
      console.log('选中菜单:', selectedItem.title, selectedItem.path)
      // 这里可以添加路由跳转逻辑
      // router.push(selectedItem.path)
    }
  }
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
        content: '';
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