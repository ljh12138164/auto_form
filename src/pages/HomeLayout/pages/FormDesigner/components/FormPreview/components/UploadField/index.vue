<template>
  <el-upload
    v-model:file-list="modelValue"
    action="#"
    :auto-upload="false"
    :multiple="item.multiple"
    :limit="item.limit"
    :accept="item.accept"
  >
    <el-button>{{ item.buttonText || '选择文件' }}</el-button>
    <template #tip>
      <div class="el-upload__tip text-gray-500 text-sm mt-1">
        {{ item.tip }}
      </div>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
interface Props {
  item: any
}

defineProps<Props>()
const modelValue = defineModel<any[]>()
</script>