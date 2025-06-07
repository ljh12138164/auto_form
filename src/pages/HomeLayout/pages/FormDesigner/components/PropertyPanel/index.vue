<template>
  <div
    v-if="selectedItem"
    class="property-panel w-80 bg-white border-l border-gray-200 flex flex-col"
  >
    <div class="panel-header px-4 py-4 border-b border-gray-200">
      <h3 class="font-medium text-gray-800">
        {{ selectedItem.label }} 属性
      </h3>
    </div>
    <div class="panel-body flex-1 overflow-y-auto p-4">
      <!-- 组件属性配置 -->
      <ComponentConfig 
        :model-value="selectedItem"
        @update:model-value="$emit('update:selectedItem', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import ComponentConfig from '../ComponentConfig/index.vue'

interface Props {
  selectedItem: any
}

defineProps<Props>()
defineEmits(['update:selectedItem'])
</script>