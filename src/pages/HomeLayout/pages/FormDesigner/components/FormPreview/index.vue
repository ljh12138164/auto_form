<template>
  <div class="form-preview-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="form-preview-container bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden mx-4">
      <!-- 预览头部 -->
      <div class="preview-header px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-gray-800">{{ formConfig.title }}</h2>
          <p v-if="formConfig.description" class="text-sm text-gray-600 mt-1">{{ formConfig.description }}</p>
        </div>
        <el-button @click="$emit('close')" circle>
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
      
      <!-- 预览内容 -->
      <div class="preview-body p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <el-form 
          ref="previewFormRef"
          :model="formData" 
          :label-width="formConfig.labelWidth"
          :size="formConfig.size"
          class="preview-form"
        >
          <!-- 渲染表单项 -->
          <div v-for="(item, index) in formItems" :key="item.id" class="form-item-preview mb-4">
            <!-- 输入框 -->
            <el-form-item 
              v-if="item.type === 'input'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-input 
                v-model="formData[item.field]"
                :placeholder="item.placeholder"
                clearable
              />
            </el-form-item>
            
            <!-- 文本域 -->
            <el-form-item 
              v-else-if="item.type === 'textarea'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-input 
                v-model="formData[item.field]"
                type="textarea"
                :placeholder="item.placeholder"
                :rows="item.rows || 3"
              />
            </el-form-item>
            
            <!-- 数字输入 -->
            <el-form-item 
              v-else-if="item.type === 'number'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-input-number 
                v-model="formData[item.field]"
                :placeholder="item.placeholder"
                :min="item.min"
                :max="item.max"
                :step="item.step"
                :precision="item.precision"
                style="width: 100%"
              />
            </el-form-item>
            
            <!-- 选择器 -->
            <el-form-item 
              v-else-if="item.type === 'select'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-select 
                v-model="formData[item.field]"
                :placeholder="item.placeholder"
                style="width: 100%"
                clearable
              >
                <el-option 
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            
            <!-- 单选框 -->
            <el-form-item 
              v-else-if="item.type === 'radio'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-radio-group v-model="formData[item.field]">
                <el-radio 
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            
            <!-- 多选框 -->
            <el-form-item 
              v-else-if="item.type === 'checkbox'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-checkbox-group v-model="formData[item.field]">
                <el-checkbox 
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.value"
                >
                  {{ option.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            
            <!-- 日期选择 -->
            <el-form-item 
              v-else-if="item.type === 'date'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-date-picker 
                v-model="formData[item.field]"
                type="date"
                :placeholder="item.placeholder"
                style="width: 100%"
              />
            </el-form-item>
            
            <!-- 文件上传 -->
            <el-form-item 
              v-else-if="item.type === 'upload'"
              :label="item.label"
              :prop="item.field"
              :required="item.required"
            >
              <el-upload
                v-model:file-list="formData[item.field]"
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
            </el-form-item>
            
            <!-- 开关 -->
            <el-form-item 
              v-else-if="item.type === 'switch'"
              :label="item.label"
              :prop="item.field"
            >
              <el-switch v-model="formData[item.field]" />
            </el-form-item>
          </div>
        </el-form>
      </div>
      
      <!-- 预览底部操作区 -->
      <div class="preview-footer px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div class="text-sm text-gray-500">
          共 {{ formItems.length }} 个字段
        </div>
        <div class="flex gap-3">
          <el-button @click="handleReset">重置</el-button>
          <el-button @click="$emit('close')">取消</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            提交表单
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- 在 FormPreview 组件的 script 部分添加验证规则 -->
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

interface Props {
  formConfig: any
  formItems: any[]
}

const props = defineProps<Props>()
defineEmits(['close'])

const previewFormRef = ref()
const submitting = ref(false)
const formData = reactive<Record<string, any>>({})

// 初始化表单数据
onMounted(() => {
  initFormData()
})

// 初始化表单数据
const initFormData = () => {
  props.formItems.forEach(item => {
    // 设置默认值
    if (item.type === 'checkbox') {
      formData[item.field] = item.defaultValue || []
    } else if (item.type === 'upload') {
      formData[item.field] = []
    } else if (item.type === 'switch') {
      formData[item.field] = item.defaultValue || false
    } else {
      formData[item.field] = item.defaultValue || ''
    }
  })
}

// 重置表单
const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    previewFormRef.value?.resetFields()
    initFormData()
    ElMessage.success('表单已重置')
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  try {
    // 表单验证
    await previewFormRef.value?.validate()
    
    submitting.value = true
    
    // 模拟提交请求
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 构造提交数据
    const submitData = {
      formTitle: props.formConfig.title,
      formDescription: props.formConfig.description,
      submitTime: new Date().toISOString(),
      formData: { ...formData }
    }
    
    console.log('表单提交数据:', submitData)
    
    ElMessage.success('表单提交成功！')
    
    // 提交成功后可以选择关闭预览或重置表单
    setTimeout(() => {
      ElMessageBox.confirm('表单提交成功！是否继续填写？', '提示', {
        confirmButtonText: '继续填写',
        cancelButtonText: '关闭预览',
        type: 'success'
      }).then(() => {
        handleReset()
      }).catch(() => {
        // 关闭预览
        // $emit('close')
      })
    }, 500)
    
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请检查表单填写是否正确')
  } finally {
    submitting.value = false
  }
}

// 生成表单验证规则
const formRules = computed(() => {
  const rules: Record<string, any[]> = {}
  
  props.formItems.forEach(item => {
    if (item.required) {
      rules[item.field] = [
        {
          required: true,
          message: `请${item.type === 'select' || item.type === 'radio' || item.type === 'checkbox' ? '选择' : '输入'}${item.label}`,
          trigger: item.type === 'select' || item.type === 'radio' || item.type === 'checkbox' ? 'change' : 'blur'
        }
      ]
    }
  })
  
  return rules
})

// 在模板中使用验证规则
// <el-form :rules="formRules" ...>
</script>

<style scoped>
.form-preview-overlay {
  backdrop-filter: blur(4px);
}

.form-preview-container {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.form-item-preview {
  transition: all 0.2s ease;
}

/* .form-item-preview:hover {
  background-color: #f8fafc;
  border-radius: 6px;
  padding: 8px;
  margin: -8px;
} */

.preview-form :deep(.el-form-item) {
  margin-bottom: 20px;
}

.preview-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #374151;
}
</style>