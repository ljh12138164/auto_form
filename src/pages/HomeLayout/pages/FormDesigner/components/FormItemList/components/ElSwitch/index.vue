<template>
  <el-switch :model-value="element.isSwitch" />
</template>

<script setup lang="ts">
defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>
