<template>
    <div class="min-h-screen bg-gray-50">
        <!-- 导航栏 -->
        <div class="bg-white shadow-sm">
            <div class="container mx-auto px-4 flex justify-between items-center h-16">
                <!-- Logo区域 -->
                <div class="flex items-center">
                    <img width="28" src="@/assets/img/jianada.png" alt="">
                    <span class="ml-2 text-xl font-semibold text-gray-800">AUTO FORM</span>
                </div>
            </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="container mx-auto px-4 py-16">
            <!-- 标题区域 -->
            <div class="text-center max-w-3xl mx-auto">
                <h2 class="text-3xl sm:text-4xl font-bold text-center mb-6">智能表单设计平台</h2>

                <p class="text-lg sm:text-xl text-gray-600 mb-8">
                    基于 Vue3 + TypeScript 的可视化表单构建工具，拖拽设计，一键生成代码
                </p>
                <el-button @click="goLoginPage" type="primary" class="!bg-blue-600 !rounded-md !h-10 !px-6 hover:!bg-blue-700">
                    开始使用
                </el-button>
            </div>

            <!-- 功能特性区域 -->
            <div class="mt-24 max-w-6xl mx-auto">
                <h2 class="text-3xl sm:text-4xl font-bold text-center mb-6">核心功能</h2>
                <p class="text-lg sm:text-xl text-center text-gray-600 mb-16">完整的表单解决方案</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
                    <!-- 可视化设计 -->
                    <el-card shadow="hover" class="!border-0 transform hover:-translate-y-1 transition-all duration-300">
                        <div class="text-2xl font-semibold mb-6 flex items-center">
                            <el-icon class="text-3xl mr-3 text-blue-500"><Pointer /></el-icon>
                            可视化设计
                        </div>
                        <p class="text-lg text-gray-600 leading-relaxed">
                            拖拽式表单设计，丰富的组件库，所见即所得的编辑体验
                        </p>
                    </el-card>

                    <!-- 代码生成 -->
                    <el-card shadow="hover" class="!border-0 transform hover:-translate-y-1 transition-all duration-300">
                        <div class="text-2xl font-semibold mb-6 flex items-center">
                            <el-icon class="text-3xl mr-3 text-green-500"><Document /></el-icon>
                            代码生成
                        </div>
                        <p class="text-lg text-gray-600 leading-relaxed">
                            自动生成高质量的 Vue3 组件代码，支持 TypeScript 和最佳实践
                        </p>
                    </el-card>

                    <!-- 数据管理 -->
                    <el-card shadow="hover" class="!border-0 transform hover:-translate-y-1 transition-all duration-300">
                        <div class="text-2xl font-semibold mb-6 flex items-center">
                            <el-icon class="text-3xl mr-3 text-purple-500"><DataLine /></el-icon>
                            数据管理
                        </div>
                        <p class="text-lg text-gray-600 leading-relaxed">
                            实时数据收集和管理功能，支持多种数据导出和可视化
                        </p>
                    </el-card>
                </div>

                <!-- 技术栈展示 -->
                <div class="mt-20">
                    <h3 class="text-2xl font-bold text-center mb-12">技术栈</h3>
                    <div class="flex flex-wrap justify-center items-center gap-8">
                        <div class="bg-white rounded-lg p-4 shadow-sm border">
                            <span class="text-lg font-medium text-gray-700">Vue 3</span>
                        </div>
                        <div class="bg-white rounded-lg p-4 shadow-sm border">
                            <span class="text-lg font-medium text-gray-700">TypeScript</span>
                        </div>
                        <div class="bg-white rounded-lg p-4 shadow-sm border">
                            <span class="text-lg font-medium text-gray-700">Tailwind CSS</span>
                        </div>
                        <div class="bg-white rounded-lg p-4 shadow-sm border">
                            <span class="text-lg font-medium text-gray-700">Element Plus</span>
                        </div>
                        <div class="bg-white rounded-lg p-4 shadow-sm border">
                            <span class="text-lg font-medium text-gray-700">Vite</span>
                        </div>
                        <div class="bg-white rounded-lg p-4 shadow-sm border">
                            <span class="text-lg font-medium text-gray-700">Express.js</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Document, Pointer, DataLine } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const goLoginPage = () => {
    router.push('/login')
}
</script>

<style lang="scss" scoped>
:deep(.el-menu) {
    --el-menu-bg-color: transparent;
}

:deep(.el-card) {
    border-radius: 1rem;
}
</style>