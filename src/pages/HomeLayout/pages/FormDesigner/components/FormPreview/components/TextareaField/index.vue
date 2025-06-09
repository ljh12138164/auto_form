<template>
  <el-input 
    v-model="modelValue"
    type="textarea"
    :placeholder="item.placeholder"
    :rows="item.rows || 3"
  />
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<string>()
</script>