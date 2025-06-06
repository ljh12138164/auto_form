<template>
  <!-- 数字输入框 -->
  <el-input-number
    :model-value="element.defaultValue"
    :min="element.min"
    :max="element.max"
    :step="element.step || 1"
    :precision="element.precision"
    :placeholder="element.placeholder"
    style="width: 100%;"
  />
</template>

<script setup lang="ts">
defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>