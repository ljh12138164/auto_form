<template>
  <el-checkbox-group v-model="modelValue">
    <el-checkbox 
      v-for="option in item.options"
      :key="option.value"
      :label="option.value"
    >
      {{ option.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<any[]>()
</script>