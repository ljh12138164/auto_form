<template>
  <!-- 文件上传 -->
  <el-upload
    :action="element.action || '#'"
    :multiple="element.multiple || false"
    :accept="element.accept || '*'"
    :limit="element.limit || 1"
    :show-file-list="true"
    class="w-full"
    @click.stop
  >
    <el-button type="primary">
      <el-icon><Upload /></el-icon>
      {{ element.buttonText || '选择文件' }}
    </el-button>
    <template #tip>
      <div class="el-upload__tip text-xs text-gray-500">
        {{ element.tip || '请选择要上传的文件' }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue';

defineProps<{
  element: any;
}>();
</script>

<style lang="scss" scoped></style>