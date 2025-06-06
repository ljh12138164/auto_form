<template>
  <div class="design-canvas flex-1 flex flex-col bg-white">
    <!-- 画布头部 -->
    <div class="canvas-header px-6 py-4 border-b border-gray-200 bg-white">
      <div class="flex items-center justify-between">
        <!-- 表单标题显示区域 -->
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-600" @click="$emit('editTitle')">
            {{ formConfig.title }}
            <el-icon class="ml-1 text-sm"><Edit /></el-icon>
          </h2>
          <span v-if="formConfig.description" class="text-sm text-gray-500">{{ formConfig.description }}</span>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center gap-3">
          <el-button size="default" @click="$emit('preview')">
            <el-icon><View /></el-icon>
            预览
          </el-button>
          <el-button size="default" @click="$emit('save')">
            <el-icon><Document /></el-icon>
            保存
          </el-button>
          <el-button type="primary" size="default" @click="$emit('publish')">
            <el-icon><Upload /></el-icon>
            发布
          </el-button>
        </div>
      </div>
    </div>

    <!-- 画布主体 -->
    <div class="canvas-body flex-1 overflow-auto p-8 bg-gray-50">
      <div 
        class="form-canvas bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 min-h-[600px] p-8 mx-auto max-w-4xl"
        :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
        @drop="handleDrop"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <!-- 空状态提示 -->
        <div v-if="formItems.length === 0" class="empty-state text-center py-32">
          <el-icon class="text-8xl text-gray-300 mb-6"><Plus /></el-icon>
          <h3 class="text-xl text-gray-500 mb-2">开始设计您的表单</h3>
          <p class="text-gray-400">从左侧拖拽组件到此处开始设计表单</p>
        </div>

        <!-- 表单项列表 - 修复 v-model 问题 -->
        <FormItemList 
          v-else
          :model-value="formItems"
          :selected-item-id="selectedItemId"
          @update:model-value="$emit('update:formItems', $event)"
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
import { ref } from 'vue'
import { View, Document, Upload, Plus, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import FormItemList from '../FormItemList/index.vue'

interface Props {
  formConfig: any
  formItems: any[]
  selectedItemId: string | null
}

const props = defineProps<Props>()

const emits = defineEmits([
  'editTitle', 'preview', 'save', 'publish',
  'selectItem', 'copyItem', 'deleteItem', 'formItemsChange',
  'update:formItems'
])

// 拖拽状态
const isDragOver = ref(false)

// 拖拽事件处理
const handleDragEnter = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  event.dataTransfer!.dropEffect = 'copy'
}

const handleDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const componentData = event.dataTransfer?.getData('application/json')
  if (componentData) {
    try {
      const component = JSON.parse(componentData)
      const newItem = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: component.type,
        label: component.label,
        field: `field_${props.formItems.length + 1}`,
        placeholder: component.defaultProps?.placeholder || `请输入${component.label}`,
        required: false,
        defaultValue: '',
        props: { ...component.defaultProps },
        options: component.options || []
      }
      
      const newFormItems = [...props.formItems, newItem]
      emits('update:formItems', newFormItems)
      emits('selectItem', newItem)
      
      ElMessage.success(`已添加 ${component.label} 组件`)
    } catch (error) {
      console.error('解析拖拽数据失败:', error)
      ElMessage.error('添加组件失败')
    }
  }
}
</script>

<style lang="scss" scoped>
.form-canvas {
  transition: all 0.2s ease;
  
  &.border-blue-400 {
    border-style: solid;
  }
}

.empty-state {
  pointer-events: none;
}
</style>
