<template>
  <div class="component-config">
    <el-form label-width="80px" size="small">
      <el-form-item label="字段标签">
        <el-input v-model="modelValue.label" />
      </el-form-item>
      <el-form-item label="字段名称">
        <el-input v-model="modelValue.field" />
      </el-form-item>
      <el-form-item label="字段宽度">
        <el-input v-model="modelValue.labelWidth" placeholder="如:100px" />
      </el-form-item>
      <el-form-item label="占位提示" v-if="!['switch'].includes(modelValue.type)">
        <el-input v-model="modelValue.placeholder" />
      </el-form-item>
      <el-form-item label="是否必填" v-if="!['switch'].includes(modelValue.type)">
        <el-switch v-model="modelValue.required" />
      </el-form-item>
      <el-form-item label="默认值" v-if="!['switch', 'upload'].includes(modelValue.type)">
        <el-input v-model="modelValue.defaultValue" />
      </el-form-item>

      <!-- 文本域特有配置 -->
      <template v-if="modelValue.type === 'textarea'">
        <el-form-item label="行数">
          <el-input-number v-model="modelValue.rows" :min="2" :max="10" />
        </el-form-item>
      </template>

      <!-- 数字输入框特有配置 -->
      <template v-if="modelValue.type === 'number'">
        <el-form-item label="最小值">
          <el-input-number v-model="modelValue.min" />
        </el-form-item>
        <el-form-item label="最大值">
          <el-input-number v-model="modelValue.max" />
        </el-form-item>
        <el-form-item label="步长">
          <el-input-number v-model="modelValue.step" :min="0.1" :step="0.1" />
        </el-form-item>
        <el-form-item label="精度">
          <el-input-number v-model="modelValue.precision" :min="0" :max="10" />
        </el-form-item>
      </template>

      <!-- 文件上传特有配置 -->
      <template v-if="modelValue.type === 'upload'">
        <el-form-item label="按钮文字">
          <el-input v-model="modelValue.buttonText" />
        </el-form-item>
        <el-form-item label="提示文字">
          <el-input v-model="modelValue.tip" />
        </el-form-item>
        <el-form-item label="文件类型">
          <el-input v-model="modelValue.accept" placeholder="如: .jpg,.png,.pdf" />
        </el-form-item>
        <el-form-item label="多选">
          <el-switch v-model="modelValue.multiple" />
        </el-form-item>
        <el-form-item label="文件数量">
          <el-input-number v-model="modelValue.limit" :min="1" :max="10" />
        </el-form-item>
      </template>

      <!-- 选择器、单选框、多选框特有配置 -->
      <template v-if="['select', 'radio', 'checkbox'].includes(modelValue.type)">
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

      <!-- 开关特有配置 -->
      <template v-if="modelValue.type === 'switch'">
        <el-form-item label="状态">
          <el-switch v-model="modelValue.isSwitch" />
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
  if (props.modelValue && ['select', 'radio', 'checkbox'].includes(props.modelValue.type)) {
    if (!props.modelValue.options) {
      props.modelValue.options = [];
    }
    props.modelValue.options.push({
      label: `选项${props.modelValue.options.length + 1}`,
      value: `${props.modelValue.options.length + 1}`,
    });
  }
};

// 删除选项
const removeOption = (index: number) => {
  if (props.modelValue && ['select', 'radio', 'checkbox'].includes(props.modelValue.type)) {
    props.modelValue.options.splice(index, 1);
  }
};
</script>
