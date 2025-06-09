<template>
  <el-input 
    v-model="modelValue"
    :placeholder="item.placeholder"
    clearable
  />
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<string>()
</script>