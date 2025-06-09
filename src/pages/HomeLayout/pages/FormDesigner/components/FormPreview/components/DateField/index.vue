<template>
  <el-date-picker 
    v-model="modelValue"
    type="date"
    :placeholder="item.placeholder"
    style="width: 100%"
  />
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<Date>()
</script>