// Vue 组件模板
export const VueTemplates = {
    // 主模板
    mainTemplate: (componentClassName: string, formName: string, fieldsTemplate: string, formDataTemplate: string) => `<template>
    <div class="${componentClassName}">
      <h2>${formName}</h2>
      <el-form 
        ref="formRef"
        :model="form" 
        label-width="120px"
        class="form-container"
      >
  ${fieldsTemplate}
        
        <el-form-item class="form-actions">
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref } from 'vue'
  import type { FormInstance } from 'element-plus'
  import { ElMessage } from 'element-plus'
  
  // 表单引用
  const formRef = ref<FormInstance>()
  
  // 表单数据
  const form = reactive({
  ${formDataTemplate}
  })
  
  // 提交表单
  const onSubmit = async () => {
    if (!formRef.value) return
    
    try {
      await formRef.value.validate()
      console.log('表单数据:', form)
      ElMessage.success('提交成功！')
      // 在这里添加提交逻辑
    } catch (error) {
      ElMessage.error('请检查表单输入')
    }
  }
  
  // 重置表单
  const onReset = () => {
    formRef.value?.resetFields()
  }
  </script>
  
  <style lang="scss" scoped>
  .${componentClassName} {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  
  .form-container {
    margin-top: 20px;
  }
  
  .form-actions {
    margin-top: 30px;
    text-align: center;
    
    .el-button {
      margin: 0 10px;
      min-width: 100px;
    }
  }
  
  h2 {
    color: #303133;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 500;
  }
  
  :deep(.el-form-item__label) {
    font-weight: 500;
    color: #606266;
  }
  
  :deep(.el-input),
  :deep(.el-date-picker) {
    width: 100%;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 22px;
  }
  </style>`,
  
    // 字段模板
    fieldTemplates: {
      input: (field: any, required: string, fieldName: string) => `      <el-form-item label="${field.label}" prop="${fieldName}"${required}>
          <el-input v-model="form.${fieldName}" placeholder="${field.props?.placeholder || field.placeholder || ''}" />
        </el-form-item>`,
      
      textarea: (field: any, required: string, fieldName: string) => `      <el-form-item label="${field.label}" prop="${fieldName}"${required}>
          <el-input 
            v-model="form.${fieldName}" 
            type="textarea" 
            :rows="${field.props?.rows || 3}"
            placeholder="${field.props?.placeholder || field.placeholder || ''}"
          />
        </el-form-item>`,
      
      date: (field: any, required: string, fieldName: string) => `      <el-form-item label="${field.label}" prop="${fieldName}"${required}>
          <el-date-picker 
            v-model="form.${fieldName}" 
            type="date" 
            placeholder="${field.props?.placeholder || field.placeholder || '请选择日期'}" 
            style="width: 100%"
          />
        </el-form-item>`,
      
      radio: (field: any, required: string, options: string, fieldName: string) => `      <el-form-item label="${field.label}" prop="${fieldName}"${required}>
          <el-radio-group v-model="form.${fieldName}">
  ${options}
          </el-radio-group>
        </el-form-item>`,
      
      checkbox: (field: any, options: string, fieldName: string) => `      <el-form-item label="${field.label}" prop="${fieldName}">
          <el-checkbox-group v-model="form.${fieldName}">
  ${options}
          </el-checkbox-group>
        </el-form-item>`,
      
      default: (field: any, required: string, fieldName: string) => `      <el-form-item label="${field.label}" prop="${fieldName}"${required}>
          <el-input v-model="form.${fieldName}" placeholder="${field.props?.placeholder || field.placeholder || ''}" />
        </el-form-item>`
    },
  
    // 选项模板
    optionTemplates: {
      radio: (option: any) => `          <el-radio label="${option.value}">${option.label}</el-radio>`,
      checkbox: (option: any) => `          <el-checkbox label="${option.value}">${option.label}</el-checkbox>`
    }
  }
  
  // 表单数据初始值模板
  export const FormDataTemplates = {
    checkbox: (fieldName: string) => `  ${fieldName}: []`,
    date: (fieldName: string) => `  ${fieldName}: null`,
    textarea: (fieldName: string) => `  ${fieldName}: ''`,
    default: (fieldName: string) => `  ${fieldName}: ''`
  }