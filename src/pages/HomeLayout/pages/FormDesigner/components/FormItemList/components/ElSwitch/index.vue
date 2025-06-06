<template>
  <el-switch :model-value="element.defaultValue" />
</template>

<script setup lang="ts">
defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>
