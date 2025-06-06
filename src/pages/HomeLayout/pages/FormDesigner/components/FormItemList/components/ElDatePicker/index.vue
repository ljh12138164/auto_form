<template>
  <el-date-picker
    :model-value="element.defaultValue"
    :placeholder="element.placeholder"
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
