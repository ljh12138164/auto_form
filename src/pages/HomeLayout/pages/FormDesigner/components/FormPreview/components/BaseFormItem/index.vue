<template>
  <el-form-item 
    :label="item.label"
    :prop="item.field"
    :required="item.required"
  >
    <component 
      :is="componentMap[item.type]"
      v-model="modelValue"
      :item="item"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import InputField from '../InputField/index.vue'
import TextareaField from '../TextareaField/index.vue'
import NumberField from '../NumberField/index.vue'
import SelectField from '../SelectField/index.vue'
import RadioField from '../RadioField/index.vue'
import CheckboxField from '../CheckboxField/index.vue'
import DateField from '../DateField/index.vue'
import UploadField from '../UploadField/index.vue'
import SwitchField from '../SwitchField/index.vue'

// 定义表单项类型
type FormItemType = 'input' | 'textarea' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'upload' | 'switch'

interface FormItem {
  id: string
  type: FormItemType
  field: string
  label: string
  required?: boolean
  placeholder?: string
  defaultValue?: any
  options?: Array<{ label: string; value: any }>
  // 其他可能的属性
  [key: string]: any
}

interface Props {
  item: FormItem
}

defineProps<Props>()
const modelValue = defineModel<any>()

// 组件映射 - 使用 Record 类型确保类型安全
const componentMap: Record<FormItemType, any> = {
  input: InputField,
  textarea: TextareaField,
  number: NumberField,
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  date: DateField,
  upload: UploadField,
  switch: SwitchField
}
</script>