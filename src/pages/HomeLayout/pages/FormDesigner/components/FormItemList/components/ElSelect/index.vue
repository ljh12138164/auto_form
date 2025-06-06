<template>
  <el-select
    :model-value="element.defaultValue"
    :placeholder="element.placeholder"
    class="w-full"
    @click.stop
  >
    <el-option
      v-for="option in element.options || []"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script setup lang="ts">
defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>
