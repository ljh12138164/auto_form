<template>
  <!-- 单选框组 -->
  <el-radio-group
    :model-value="element.defaultValue"
    class="w-full"
    @click.stop
  >
    <el-radio
      v-for="option in element.options || []"
      :key="option.value"
      :label="option.value"
    >
      {{ option.label }}
    </el-radio>
  </el-radio-group>
</template>

<script setup lang="ts">
defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>