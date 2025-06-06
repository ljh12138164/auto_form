<template>
  <!-- 多选框组 -->
  <el-checkbox-group
    :model-value="element.defaultValue || []"
    class="w-full"
    @click.stop
  >
    <el-checkbox
      v-for="option in element.options || []"
      :key="option.value"
      :label="option.value"
    >
      {{ option.label }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script setup lang="ts">
defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>