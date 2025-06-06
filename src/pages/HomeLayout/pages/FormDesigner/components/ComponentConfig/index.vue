<template>
  <div class="component-config">
    <el-form label-width="80px" size="small">
      <el-form-item label="字段标签">
        <el-input v-model="modelValue.label" />
      </el-form-item>
      <el-form-item label="字段名称">
        <el-input v-model="modelValue.field" />
      </el-form-item>
      <el-form-item label="占位提示">
        <el-input v-model="modelValue.placeholder" />
      </el-form-item>
      <el-form-item label="是否必填">
        <el-switch v-model="modelValue.required" />
      </el-form-item>
      <el-form-item label="默认值">
        <el-input v-model="modelValue.defaultValue" />
      </el-form-item>

      <!-- 选择器特有配置 -->
      <template v-if="modelValue.type === 'select'">
        <el-form-item label="选项配置">
          <div class="space-y-2">
            <div
              v-for="(option, index) in modelValue.options"
              :key="index"
              class="flex gap-2"
            >
              <el-input
                v-model="option.label"
                placeholder="选项文本"
                size="small"
              />
              <el-input
                v-model="option.value"
                placeholder="选项值"
                size="small"
              />
              <el-button @click="removeOption(index)" size="small">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button @click="addOption" size="small" class="w-full"
              >添加选项</el-button
            >
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { Delete } from "@element-plus/icons-vue";

interface Props {
  modelValue: any;
}

const props = defineProps<Props>();
defineEmits(["update:modelValue"]);

// 添加选项
const addOption = () => {
  if (props.modelValue && props.modelValue.type === "select") {
    props.modelValue.options.push({
      label: `选项${props.modelValue.options.length + 1}`,
      value: `${props.modelValue.options.length + 1}`,
    });
  }
};

// 删除选项
const removeOption = (index: number) => {
  if (props.modelValue && props.modelValue.type === "select") {
    props.modelValue.options.splice(index, 1);
  }
};
</script>
