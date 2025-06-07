<template>
  <div
    class="component-panel w-64 bg-white border-r border-gray-200 flex flex-col"
  >
    <!-- 返回按钮 -->
     <el-button type="primary w-20">返回</el-button>
    <div class="panel-header px-4 py-4 border-b border-gray-200">
      <h3 class="font-medium text-gray-800 mb-3">组件库</h3>
    </div>
    <div class="panel-body flex-1 overflow-y-auto p-4">
      <!-- 基础组件 -->
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

      <!-- 布局组件 -->
      <!-- <div class="component-group">
        <h4 class="text-sm font-medium text-gray-600 mb-3">布局组件</h4>
        <div class="grid grid-cols-2 gap-3">
          <div
            v-for="component in layoutComponents"
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
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EditPen,
  Select,
  Calendar,
  Switch,
  Grid,
  Postcard,
  // 添加新的图标
  Document,
  Upload,
  Odometer,
  CircleCheck,
  Select as SelectIcon,
} from "@element-plus/icons-vue";

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

// // 布局组件配置
// const layoutComponents = [
//   { type: "grid", label: "栅格", icon: Grid },
//   { type: "card", label: "卡片", icon: Postcard },
// ];

// 拖拽开始
const handleDragStart = (event: DragEvent, component: any) => {
  if (event.dataTransfer) {
    // 设置拖拽数据 component 是拖拽的组件数据 画布区域会通过这个数据渲染组件
    event.dataTransfer.setData("application/json", JSON.stringify(component));
    event.dataTransfer.effectAllowed = "copy";
  }
};
</script>

<style lang="scss" scoped>
.component-item {
  user-select: none;

  &:active {
    transform: scale(0.95);
  }
}
</style>
