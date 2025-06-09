<template>
  <div
    class="component-panel w-64 bg-white border-r border-gray-200 flex flex-col"
  >
    <!-- 返回按钮 -->
    <el-button type="primary w-20" @click="goBack">返回</el-button>
    
    <!-- 切换栏 -->
    <div class="panel-header px-4 py-4 border-b border-gray-200 w-full">
      <el-tabs v-model="activeTab" class="panel-tabs">
        <el-tab-pane  label="组件库" name="components">
          <template #label>
            <span class="tab-label">
              <el-icon><Grid /></el-icon>
              组件库
            </span>
          </template>
        </el-tab-pane>
        <el-tab-pane label="模版库" name="templates">
          <template #label>
            <span class="tab-label">
              <el-icon><Document /></el-icon>
              模版库
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
    
    <div class="panel-body flex-1 overflow-y-auto p-3">
      <!-- 组件库内容 -->
      <div v-if="activeTab === 'components'" class="components-content">
        <div class="component-group mb-6">
          <h4 class="text-sm font-medium text-gray-600 mb-3">表单组件</h4>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="component in basicComponents"
              :key="component.type"
              class="component-item p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors text-center"
              draggable="true"
              @dragstart="handleDragStart($event, component)"
            >
              <el-icon class="text-2xl text-gray-600 mb-2">
                <component :is="component.icon" />
              </el-icon>
              <div class="text-xs text-gray-700">{{ component.label }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 模版库内容 -->
      <div v-else-if="activeTab === 'templates'" class="templates-content">
        <TemplateLibrary @use-template="handleUseTemplate" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Calendar,
  CircleCheck,
  Document,
  EditPen,
  Grid,
  Odometer,
  Select,
  Select as SelectIcon,
  Switch,
  Upload
} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import TemplateLibrary from './components/TemplateLibrary/index.vue'
import { TemplateForm } from "@/api";

const router = useRouter();
const activeTab = ref('components');

const emit = defineEmits<{
  useTemplate: [template: TemplateForm]
}>()

// 基础组件配置
const basicComponents = [
  {
    type: "input",
    label: "输入框",
    icon: EditPen,
    defaultProps: { placeholder: "请输入内容" },
  },
  {
    type: "textarea",
    label: "文本域",
    icon: Document,
    defaultProps: { placeholder: "请输入多行文本", rows: 3 },
  },
  {
    type: "number",
    label: "数字输入",
    icon: Odometer,
    defaultProps: { placeholder: "请输入数字", min: 0, max: 100, step: 1 },
  },
  {
    type: "select",
    label: "选择器",
    icon: Select,
    defaultProps: { placeholder: "请选择" },
    options: [
      { label: "选项1", value: "1" },
      { label: "选项2", value: "2" },
    ],
  },
  {
    type: "radio",
    label: "单选框",
    icon: CircleCheck,
    defaultProps: { placeholder: "请选择" },
    options: [
      { label: "选项1", value: "1" },
      { label: "选项2", value: "2" },
    ],
  },
  {
    type: "checkbox",
    label: "多选框",
    icon: SelectIcon,
    defaultProps: { placeholder: "请选择" },
    options: [
      { label: "选项1", value: "1" },
      { label: "选项2", value: "2" },
    ],
  },
  {
    type: "date",
    label: "日期选择",
    icon: Calendar,
    defaultProps: { placeholder: "请选择日期" },
  },
  {
    type: "upload",
    label: "文件上传",
    icon: Upload,
    defaultProps: { 
      buttonText: "选择文件", 
      tip: "请选择要上传的文件",
      accept: "*",
      multiple: false,
      limit: 1
    },
  },
  {
    type: "switch",
    label: "开关",
    isSwitch: false,
    icon: Switch,
    defaultProps: {},
  },
];

const goBack = () => {
  router.back();
};

// 拖拽开始
const handleDragStart = (event: DragEvent, component: any) => {
  if (event.dataTransfer) {
    // 设置拖拽数据 component 是拖拽的组件数据 画布区域会通过这个数据渲染组件
    event.dataTransfer.setData("application/json", JSON.stringify(component));
    console.log(JSON.stringify(component));
    event.dataTransfer.effectAllowed = "copy";
  }
};

// 使用模版
const handleUseTemplate = (template: TemplateForm) => {
  console.log('使用模版:', template);
  // 向父组件传递模版数据
  emit('useTemplate', template);
};
</script>

<style lang="scss" scoped>
.component-item {
  user-select: none;

  &:active {
    transform: scale(0.95);
  }
}

.panel-tabs {
  :deep(.el-tabs__header) {
    margin: 0;
  }
  
  :deep(.el-tabs__nav-wrap) {
    padding: 0;
  }
  
  :deep(.el-tabs__item) {
    padding: 0 16px;
    font-size: 14px;
    flex: 1;
    text-align: center;
  }
  
  :deep(.el-tabs__nav) {
    display: flex;
    width: 100%;
  }
}

.tab-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  
  .el-icon {
    font-size: 16px;
  }
}
</style>