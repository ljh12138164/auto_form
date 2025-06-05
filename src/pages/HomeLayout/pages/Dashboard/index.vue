<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- 个人统计卡片区域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <el-icon class="text-blue-600 text-xl"><Document /></el-icon>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">{{ myForms }}</h3>
                        <p class="text-gray-600 text-sm">我的表单</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <el-icon class="text-green-600 text-xl"><Edit /></el-icon>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">{{ todayCreated }}</h3>
                        <p class="text-gray-600 text-sm">今日新建</p>
                    </div>
                </div>
            </div>
            
            <div class="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div class="flex items-center">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <el-icon class="text-purple-600 text-xl"><View /></el-icon>
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900">{{ myFormViews }}</h3>
                        <p class="text-gray-600 text-sm">表单总提交次数</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- 图表和快捷操作区域 -->
        <div class="flex gap-6 mb-8">
            <!-- 图表区域 -->
            <div class="flex-1">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div class="p-6 border-b border-gray-200">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold text-gray-900">我的表单创建趋势</h3>
                            <el-button type="primary" link>查看详情</el-button>
                        </div>
                    </div>
                    <div class="p-6">
                        <!-- 图表容器 -->
                         <ChartContent></ChartContent>
                    </div>
                </div>
            </div>

            <!-- 快捷操作区域 -->
            <div class="w-80">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">快捷操作</h3>
                    </div>
                    <div class="p-6 h-full">
                        <div class="grid grid-cols-2 gap-4">
                            <div 
                                class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center"
                                @click="createForm"
                            >
                                <el-icon class="text-3xl text-blue-500 mb-3"><Plus /></el-icon>
                                <span class="block text-sm text-gray-700 font-medium">新建表单</span>
                                <span class="block text-xs text-gray-500 mt-1">快速创建新表单</span>
                            </div>
                            <div 
                                class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors flex flex-col items-center justify-center"
                                @click="manageTemplates"
                            >
                                <el-icon class="text-3xl text-green-500 mb-3"><Files /></el-icon>
                                <span class="block text-sm text-gray-700 font-medium">模板管理</span>
                                <span class="block text-xs text-gray-500 mt-1">管理表单模板</span>
                            </div>
                            <div 
                                class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center"
                                @click="viewReports"
                            >
                                <el-icon class="text-3xl text-purple-500 mb-3"><DataAnalysis /></el-icon>
                                <span class="block text-sm text-gray-700 font-medium">数据报表</span>
                                <span class="block text-xs text-gray-500 mt-1">查看数据统计</span>
                            </div>
                            <div 
                                class="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors flex flex-col items-center justify-center"
                                @click="viewMyForms"
                            >
                                <el-icon class="text-3xl text-orange-500 mb-3"><Folder /></el-icon>
                                <span class="block text-sm text-gray-700 font-medium">我的表单</span>
                                <span class="block text-xs text-gray-500 mt-1">查看所有表单</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 最近活动区域 - 独占一行 -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-900">最近活动</h3>
                    <el-button type="primary" link>查看全部</el-button>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center p-4 bg-gray-50 rounded-lg">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <el-icon class="text-blue-600"><component :is="activity.icon" /></el-icon>
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate">{{ activity.title }}</p>
                            <p class="text-xs text-gray-500">{{ activity.time }}</p>
                            <el-tag :type="activity.status === 'success' ? 'success' : 'info'" size="small" class="mt-1">
                                {{ activity.statusText }}
                            </el-tag>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getDashboardStatsAPI } from '@/api'
import {
    DataAnalysis,
    Document,
    Edit,
    Files,
    Folder,
    Plus,
    View
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChartContent from './components/ChartContent/index.vue'
const router = useRouter()

// 个人统计数据
const myForms = ref(0) // 我的表单总数
const todayCreated = ref(0) // 今日新建
const myFormViews = ref(0) // 我的表单总提交次数

// 最近活动数据（只显示当前用户的活动）
const recentActivities = ref([
    {
        id: 1,
        title: '创建了新表单「用户反馈表」',
        time: '2分钟前',
        icon: 'Document',
        status: 'success',
        statusText: '已发布'
    },
    {
        id: 2,
        title: '修改了表单「产品调研表」',
        time: '15分钟前',
        icon: 'Edit',
        status: 'info',
        statusText: '草稿'
    },
    {
        id: 3,
        title: '导出了数据报表',
        time: '1小时前',
        icon: 'DataAnalysis',
        status: 'success',
        statusText: '完成'
    },
    {
        id: 4,
        title: '更新了表单模板',
        time: '2小时前',
        icon: 'Files',
        status: 'success',
        statusText: '已保存'
    }
])

// 快捷操作方法
const createForm = () => {
    router.push('/home/form-designer')
}

const manageTemplates = () => {
    router.push('/home/templates')
}

const viewReports = () => {
    router.push('/home/reports')
}

const viewMyForms = () => {
    router.push('/home/my-forms')
}



// 加载用户仪表盘数据的占位函数
const loadUserDashboardData = async () => {
    const res = await getDashboardStatsAPI()
    console.log(res.data);
    myForms.value = res.data.myForms;
    todayCreated.value = res.data.todaySubmissions;
    myFormViews.value = res.data.totalSubmissions;
    // 这里将来会调用API获取用户的个人数据
    console.log('加载用户仪表盘数据...')
}

onMounted(async () => {
    loadUserDashboardData()
})
</script>

<style lang="scss" scoped>
</style>