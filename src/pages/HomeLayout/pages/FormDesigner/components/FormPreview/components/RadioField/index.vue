<template>
  <el-radio-group v-model="modelValue">
    <el-radio 
      v-for="option in item.options"
      :key="option.value"
      :label="option.value"
    >
      {{ option.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<any>()
</script>