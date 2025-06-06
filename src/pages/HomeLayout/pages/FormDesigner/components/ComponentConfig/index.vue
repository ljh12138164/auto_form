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
        <el-input placeholder="请输入默认值" v-if="modelValue.type !== 'number'" v-model="modelValue.defaultValue" />
        <el-input v-else placeholder="请输入数字" v-model="modelValue.defaultValue" type="number" />
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
              class="flex gap-2 items-center"
            >
              <!-- 默认值选择框 -->
              <div class="flex-shrink-0">
                <!-- 单选框类型使用 radio -->
                <el-radio
                  v-if="modelValue.type === 'radio' || modelValue.type === 'select'"
                  :model-value="modelValue.defaultValue"
                  :label="option.value"
                  @change="setDefaultValue(option.value)"
                  size="small"
                >
                </el-radio>
                <!-- 多选框类型使用 checkbox -->
                <el-checkbox
                  v-else-if="modelValue.type === 'checkbox'"
                  :model-value="isDefaultSelected(option.value)"
                  @change="toggleDefaultValue(option.value)"
                  size="small"
                >
                </el-checkbox>
              </div>
              
              <!-- 选项文本输入 -->
              <el-input
                v-model="option.label"
                placeholder="选项文本"
                size="small"
                class="flex-1"
              />
              
              <!-- 选项值输入 -->
              <el-input
                v-model="option.value"
                placeholder="选项值"
                size="small"
                class="flex-1"
                @input="updateOptionValue(index, $event)"
              />
              
              <!-- 删除按钮 -->
              <el-button @click="removeOption(index)" size="small" class="flex-shrink-0">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            
            <!-- 添加选项按钮 -->
            <el-button @click="addOption" size="small" class="w-full">
              添加选项
            </el-button>
            
            
            <!-- 默认值提示 -->
            <div class="text-xs text-gray-500 mt-2">
              <template v-if="modelValue.type === 'radio' || modelValue.type === 'select'">
                点击前面的圆圈选择默认选中项
              </template>
              <template v-else-if="modelValue.type === 'checkbox'">
                勾选前面的方框设置默认选中项（可多选）
              </template>
            </div>
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
    const newIndex = props.modelValue.options.length + 1;
    props.modelValue.options.push({
      label: `选项${newIndex}`,
      value: `${newIndex}`,
    });
  }
};

// 删除选项
const removeOption = (index: number) => {
  if (props.modelValue && ['select', 'radio', 'checkbox'].includes(props.modelValue.type)) {
    const removedOption = props.modelValue.options[index];
    props.modelValue.options.splice(index, 1);
    
    // 如果删除的选项是默认值，需要清除默认值
    if (props.modelValue.type === 'checkbox') {
      if (Array.isArray(props.modelValue.defaultValue)) {
        const valueIndex = props.modelValue.defaultValue.indexOf(removedOption.value);
        if (valueIndex > -1) {
          props.modelValue.defaultValue.splice(valueIndex, 1);
        }
      }
    } else if (props.modelValue.defaultValue === removedOption.value) {
      props.modelValue.defaultValue = '';
    }
  }
};

// 设置默认值（单选类型）
const setDefaultValue = (value: string) => {
  props.modelValue.defaultValue = value;
};

// 切换默认值（多选类型）
const toggleDefaultValue = (value: string) => {
  if (!Array.isArray(props.modelValue.defaultValue)) {
    props.modelValue.defaultValue = [];
  }
  
  const index = props.modelValue.defaultValue.indexOf(value);
  if (index > -1) {
    // 如果已选中，则取消选中
    props.modelValue.defaultValue.splice(index, 1);
  } else {
    // 如果未选中，则添加到选中列表
    props.modelValue.defaultValue.push(value);
  }
};

// 检查是否默认选中（多选类型）
const isDefaultSelected = (value: string) => {
  if (!Array.isArray(props.modelValue.defaultValue)) {
    return false;
  }
  return props.modelValue.defaultValue.includes(value);
};

// 更新选项值时，同步更新默认值
const updateOptionValue = (index: number, newValue: string) => {
  const oldValue = props.modelValue.options[index].value;
  props.modelValue.options[index].value = newValue;
  
  // 更新默认值中的对应值
  if (props.modelValue.type === 'checkbox') {
    if (Array.isArray(props.modelValue.defaultValue)) {
      const valueIndex = props.modelValue.defaultValue.indexOf(oldValue);
      if (valueIndex > -1) {
        props.modelValue.defaultValue[valueIndex] = newValue;
      }
    }
  } else if (props.modelValue.defaultValue === oldValue) {
    props.modelValue.defaultValue = newValue;
  }
};
</script>

<style scoped>
.space-y-2 > * + * {
  margin-top: 0.5rem;
}
</style>
