<template>
  <el-dialog
    v-model="visible"
    title="修改表单名称"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form :model="localFormConfig" label-width="100px">
      <el-form-item label="表单名称" required>
        <el-input
          v-model="localFormConfig.title"
          placeholder="请输入表单名称"
          maxlength="50"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="表单描述">
        <el-input
          v-model="localFormConfig.description"
          type="textarea"
          :rows="3"
          placeholder="请输入表单描述（可选）"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="confirmTitle">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref, watch } from "vue";
// 使用 defineModel 简化双向绑定
const visible = defineModel<boolean>('visibleValue', { default: false });
const formData = defineModel<any>('formConfig', { default: () => ({ title: null, description: null }) });
// 本地表单配置，避免直接修改props
const localFormConfig = ref({
  title: null,
  description: null,
});

// 监听对话框打开，重新初始化本地数据
watch(
  () => visible.value,
  (newVal) => {
    if (newVal) {
      // 深拷贝，避免直接修改原始数据
      localFormConfig.value = JSON.parse(JSON.stringify(formData.value));
    }
  },
  { immediate: true }
);

// 取消操作
const handleCancel = () => {
  visible.value = false;
};

// 确认标题
const confirmTitle = () => {
  // @ts-ignore
  if (!localFormConfig.value.title?.trim()) {
    ElMessage.warning("请输入表单名称");
    return;
  }
  // 只有确认时才更新父组件的数据
  formData.value = localFormConfig.value;
  visible.value = false;
  ElMessage.success("表单名称设置成功");
};
</script>
