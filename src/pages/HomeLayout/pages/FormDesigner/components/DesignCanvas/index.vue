<template>
  <div class="design-canvas flex-1 flex flex-col bg-white">
    <div class="canvas-header px-6 py-4 border-b border-gray-200 bg-white">
      <div class="items-center justify-between">
        <div class="flex items-center gap-4">
          <h2
            class="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
            @click="$emit('editTitle')"
          >
            {{ formConfig.title }}
            <!-- 编辑图标 -->
            <el-icon class="ml-1 text-sm"><Edit /></el-icon>
          </h2>
          <!-- 如果有描述，显示表单描述 -->
          <span v-if="formConfig.description" class="text-sm text-gray-500">{{
            formConfig.description
          }}</span>
        </div>

        <!-- 右侧：操作按钮组 -->
        <div class="flex items-center gap-3 mt-2">
          <el-button-group>
            <el-tooltip content="撤销" placement="bottom">
      <el-button
        :disabled="!canUndo"
        @click="$emit('undo')"
        type="default"
        :class="{
          'hover:bg-blue-50 hover:border-blue-300': canUndo,
          'opacity-50 cursor-not-allowed': !canUndo
        }"
      >
        <el-icon><RefreshLeft /></el-icon>
      </el-button>
    </el-tooltip>
    <el-tooltip content="重做" placement="bottom">
      <el-button
        :disabled="!canRedo"
        @click="$emit('redo')"
        type="default"
        :class="{
          'hover:bg-blue-50 hover:border-blue-300': canRedo,
          'opacity-50 cursor-not-allowed': !canRedo
        }"
      >
        <el-icon><RefreshRight /></el-icon>
      </el-button>
    </el-tooltip>
          </el-button-group>
          <!-- 保存按钮 - 最重要的操作，放在最前面 -->
          <el-button type="primary" @click="save">
            <el-icon><DocumentAdd /></el-icon>
            保存
          </el-button>
          <!-- 预览按钮 - 常用功能 -->
          <el-button type="success" @click="$emit('preview')">
            <el-icon><View /></el-icon>
            预览
          </el-button>
          <!-- 导出JSON - 数据操作 -->
          <el-button type="info" @click="$emit('export')">
            <el-icon><Download /></el-icon>
            导出JSON
          </el-button>
          <!-- 导入JSON - 数据操作 -->
          <el-button type="warning" @click="$emit('import')">
            <el-icon><Upload /></el-icon>
            导入JSON
          </el-button>
          <!-- 清空 - 危险操作，放在最后 -->
          <el-button type="danger" @click="$emit('clearAll')">
            <el-icon><Delete /></el-icon>
            清空
          </el-button>
        </div>
      </div>
    </div>

    <!-- 画布主体区域 -->
    <div style="overflow-y: auto;" class="canvas-body flex-1 p-8 bg-gray-50">
      <!-- 表单画布容器，支持拖拽放置 -->
      <div
        class="form-canvas bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 min-h-[600px] p-8 mx-auto max-w-4xl"
        :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- 空状态提示：当没有表单项时显示 -->
        <div
          v-if="!formItems || formItems.length === 0"
          class="empty-state text-center py-32"
        >
          <!-- 大号加号图标 -->
          <el-icon class="text-8xl text-gray-300 mb-6"><Plus /></el-icon>
          <!-- 提示标题 -->
          <h3 class="text-xl text-gray-500 mb-2">开始设计您的表单</h3>
          <!-- 提示说明 -->
          <p class="text-gray-400">从左侧拖拽组件到此处开始设计表单</p>
        </div>

        <FormItemList
          v-else
          v-model:form-items="formItems"
          :selected-item-id="selectedItemId"
          @select-item="$emit('selectItem', $event)"
          @copy-item="$emit('copyItem', $event)"
          @delete-item="$emit('deleteItem', $event)"
          @change="$emit('formItemsChange', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入 Vue 的响应式 API
import { ref } from "vue";
// 导入 Element Plus 图标组件
// 导入 Element Plus 图标组件
import { Delete, Edit, Plus, View, RefreshLeft, RefreshRight } from "@element-plus/icons-vue";// 导入 Element Plus 消息提示组件
import { ElMessage } from "element-plus";
// 导入表单项列表子组件
import {type FormItem } from "@/types";
import FormItemList from "../FormItemList/index.vue";
// 定义组件的 Props 类型接口
interface Props {
  formConfig: any; // 表单配置对象
  selectedItemId: string | null; // 当前选中的表单项ID
  canUndo: boolean;
  canRedo: boolean;
  saveToHistory: () => void;
}
// 接收父组件传递的 props
const props = defineProps<Props>();

// 使用 defineModel 并添加类型定义
const formItems = defineModel<FormItem[]>("form-items", {
  default: () => [],
});

// 定义组件向父组件发射的事件
const emits = defineEmits([
  "editTitle", // 编辑标题事件
  "preview", // 预览事件
  "save", // 保存事件
  "publish", // 发布事件
  "selectItem", // 选中表单项事件
  "copyItem", // 复制表单项事件
  "deleteItem", // 删除表单项事件
  "formItemsChange", // 表单项变化事件
  "clearAll", // 清空表单事件
  "export", // 导出表单事件
  "import",
  "undo",
  "redo",
]);
// 保存
const save = () => {
  emits("save");
};

// 拖拽状态：标记是否正在拖拽悬停
const isDragOver = ref(false);

// 拖拽进入事件处理函数
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault(); // 阻止默认行为
  isDragOver.value = true; // 设置拖拽悬停状态为 true
};

// 拖拽离开事件处理函数
const handleDragLeave = (event: DragEvent) => {
  event.preventDefault(); // 阻止默认行为
  isDragOver.value = false; // 设置拖拽悬停状态为 false
};

// 拖拽经过事件处理函数
const handleDragOver = (event: DragEvent) => {
  event.preventDefault(); // 阻止默认行为，允许放置
  event.dataTransfer!.dropEffect = "copy"; // 设置拖拽效果为复制
};

// 拖拽放置事件处理函数
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
  
  const componentData = event.dataTransfer?.getData("application/json");
  if (componentData) {
    try {
      const component = JSON.parse(componentData);
      
      // 安全获取当前表单项数量
      const currentLength = formItems.value?.length || 0;
      
      const newItem = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: component.type,
        label: component.label,
        field: `field_${currentLength + 1}_${Date.now()}`, // 添加时间戳避免重复
        placeholder: component.defaultProps?.placeholder || `请输入${component.label}`,
        required: false,
        defaultValue: "",
        props: { ...component.defaultProps },
        options: component.options || [],
        labelWidth: "",
      };
      
      // 安全的数组操作
      const currentItems = formItems.value || [];
      const newFormItems = [...currentItems, newItem];
      formItems.value = newFormItems;
      
      console.log("newFormItems", newFormItems);
      props.saveToHistory();
      emits("selectItem", newItem);
      ElMessage.success(`已添加 ${component.label} 组件`);
    } catch (error) {
      console.error("解析拖拽数据失败:", error);
      ElMessage.error("添加组件失败");
    }
  }
};
</script>

<style lang="scss" scoped>
/* 表单画布样式 */
.form-canvas {
  transition: all 0.2s ease; /* 添加过渡动画效果 */

  /* 拖拽悬停时的边框样式 */
  &.border-blue-400 {
    border-style: solid; /* 将虚线边框改为实线 */
  }
}

/* 空状态提示样式 */
.empty-state {
  pointer-events: none; /* 禁用鼠标事件，避免干扰拖拽 */
}

.form-item-wrapper {
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.form-control {
  pointer-events: none; /* 禁用表单控件的交互，仅用于预览 */
}
</style>
