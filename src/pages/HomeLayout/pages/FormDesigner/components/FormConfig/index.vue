<template>
  <div class="form-config">
    <el-form label-width="100px" size="default" style="font-size: 16px;">
      <el-form-item label="表单名称">
        <el-input
          v-model="modelValue.title"
        />
      </el-form-item>
      <el-form-item label="表单描述">
        <el-input v-model="modelValue.description" type="textarea" :rows="3" />
      </el-form-item>
      <el-form-item label="标签宽度">
        <el-input v-model="modelValue.labelWidth" placeholder="如：100px" />
      </el-form-item>
      <el-form-item label="表单尺寸">
        <el-select v-model="modelValue.size" class="w-full">
          <el-option label="大" value="large" />
          <el-option label="默认" value="default" />
          <el-option label="小" value="small" />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: any;
}

defineProps<Props>();
defineEmits(["editTitle", "update:modelValue"]);
</script>
