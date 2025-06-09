<template>
  <el-input-number 
    v-model="modelValue"
    :placeholder="item.placeholder"
    :min="item.min"
    :max="item.max"
    :step="item.step"
    :precision="item.precision"
    style="width: 100%"
  />
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<number>()
</script>