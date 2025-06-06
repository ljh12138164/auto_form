<template>
  <div
    class="property-panel w-80 bg-white border-l border-gray-200 flex flex-col"
  >
    <div class="panel-header px-4 py-4 border-b border-gray-200">
      <h3 class="font-medium text-gray-800">
        {{ selectedItem ? `${selectedItem.label} 属性` : '表单属性' }}
      </h3>
    </div>
    <div class="panel-body flex-1 overflow-y-auto p-4">
      <!-- 表单属性配置 - 修复 v-model 问题 -->
      <FormConfig
        v-if="!selectedItem"
        :model-value="formConfig"
        @update:model-value="$emit('update:formConfig', $event)"
        @edit-title="$emit('editTitle')" 
      />
      
      <!-- 组件属性配置 -->
      <ComponentConfig 
        v-else 
        :model-value="selectedItem"
        @update:model-value="$emit('update:selectedItem', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import FormConfig from '../FormConfig/index.vue'
import ComponentConfig from '../ComponentConfig/index.vue'

interface Props {
  formConfig: any
  selectedItem: any
}

defineProps<Props>()
defineEmits(['editTitle', 'update:formConfig', 'update:selectedItem'])
</script>
