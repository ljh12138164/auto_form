<template>
  <!-- 文本域 -->
  <el-input
    :model-value="element.defaultValue"
    :placeholder="element.placeholder"
    :rows="element.rows || 3"
    type="textarea"
    class="w-full"
    @click.stop
  />
</template>

<script setup lang="ts">
defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>