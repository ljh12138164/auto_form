<template>
  <el-select 
    v-model="modelValue"
    :placeholder="item.placeholder"
    style="width: 100%"
    clearable
  >
    <el-option 
      v-for="option in item.options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<any>()
</script>