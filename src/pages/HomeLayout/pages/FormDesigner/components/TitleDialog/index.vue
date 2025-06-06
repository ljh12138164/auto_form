<template>
  <el-dialog 
    :model-value="modelValue" 
    title="设置表单标题" 
    width="500px" 
    :close-on-click-modal="false"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <el-form :model="formConfig" label-width="100px">
      <el-form-item label="表单标题" required>
        <el-input 
          v-model="formConfig.title" 
          placeholder="请输入表单标题"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="表单描述">
        <el-input 
          v-model="formConfig.description" 
          type="textarea" 
          :rows="3"
          placeholder="请输入表单描述（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:modelValue', false)">取消</el-button>
      <el-button type="primary" @click="confirmTitle">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

interface Props {
  modelValue: boolean
  formConfig: any
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'update:formConfig'])

// 确认标题
const confirmTitle = () => {
  if (!props.formConfig.title.trim()) {
    ElMessage.warning('请输入表单标题')
    return
  }
  emits('update:modelValue', false)
  ElMessage.success('表单标题设置成功')
}
</script>