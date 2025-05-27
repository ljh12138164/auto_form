<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 导航栏 -->
        <div class="bg-white shadow-sm">
            <div class="container mx-auto px-4 flex justify-between items-center h-16">
                <!-- Logo区域 -->
                <div class="flex items-center">
                    <el-icon class="mr-2"><Document /></el-icon>
                    <span>Auto Form</span>
                </div>

                <!-- 导航链接和按钮 -->
                <div class="flex items-center space-x-4">
                    <el-button text>登录</el-button>
                    <el-button type="primary" class="!bg-[#409eff]">注册</el-button>
                </div>
            </div>
        </div>

        <!-- 其他内容区域 -->
        <div class="container mx-auto px-4 py-16">
            <!-- 标题区域 -->
            <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-3xl sm:text-4xl font-bold text-center mb-6">快速构建专业的表单</h2>

                <p class="text-lg sm:text-xl text-gray-600 mb-8">
                    拖拽式表单设计，让表单制作更简单。无需编码，即可创建完美的表单。
                </p>
                <el-button type="primary" class="!bg-black !rounded-md !h-10 !px-6 hover:!bg-gray-800">
                    免费使用
                </el-button>
            </div>

            <!-- 功能特性区域 -->
            <div class="mt-24 max-w-6xl mx-auto">
                <h2 class="text-3xl sm:text-4xl font-bold text-center mb-6">强大的特性</h2>
                <p class="text-lg sm:text-xl text-center text-gray-600 mb-16">一切你需要的特性功能，都在这里</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                    <!-- 拖拽设计卡片 -->
                    <el-card shadow="hover" class="!border-0 transform hover:-translate-y-1 transition-all duration-300">
                        <div class="text-2xl font-semibold mb-6 flex items-center">
                            <el-icon class="text-3xl mr-3"><Pointer /></el-icon>
                            拖拽设计
                        </div>
                        <p class="text-lg text-gray-600 leading-relaxed">
                            简单拖拽即可完成表单设计，所见即所得的编辑体验
                        </p>
                    </el-card>

                    <!-- 数据管理卡片 -->
                    <el-card shadow="hover" class="!border-0 transform hover:-translate-y-1 transition-all duration-300">
                        <div class="text-2xl font-semibold mb-6 flex items-center">
                            <el-icon class="text-3xl mr-3"><DataLine /></el-icon>
                            数据管理
                        </div>
                        <p class="text-lg text-gray-600 leading-relaxed">
                            实时的数据收集和管理功能，支持多种数据导出
                        </p>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Document, Pointer, DataLine } from '@element-plus/icons-vue'
</script>

<style lang="scss" scoped>
:deep(.el-menu) {
    --el-menu-bg-color: transparent;
}

:deep(.el-card) {
    border-radius: 1rem;
}
</style>