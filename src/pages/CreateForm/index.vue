<template>
  <div class="create-form-page">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8">创建新表单</h1>
        
        <el-card class="form-card">
          <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
            <el-form-item label="表单标题" prop="title">
              <el-input 
                v-model="formData.title" 
                placeholder="请输入表单标题"
                maxlength="50"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item label="表单描述" prop="description">
              <el-input 
                v-model="formData.description" 
                type="textarea" 
                :rows="4"
                placeholder="请输入表单描述（可选）"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
            
            <el-form-item label="标签宽度">
              <el-input 
                v-model="formData.labelWidth" 
                placeholder="如：100px"
              />
            </el-form-item>
            
            <el-form-item label="表单尺寸">
              <el-select v-model="formData.size" class="w-full">
                <el-option label="大" value="large" />
                <el-option label="默认" value="default" />
                <el-option label="小" value="small" />
              </el-select>
            </el-form-item>
          </el-form>
          
          <div class="text-center mt-8">
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleCreate" :loading="loading">
              创建表单
            </el-button>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref()
const loading = ref(false)

const formData = reactive({
  title: '',
  description: '',
  labelWidth: '100px',
  size: 'default'
})

const rules = {
  title: [
    { required: true, message: '请输入表单标题', trigger: 'blur' },
    { min: 1, max: 50, message: '标题长度在 1 到 50 个字符', trigger: 'blur' }
  ]
}

const handleCancel = () => {
  router.back()
}

const handleCreate = async () => {
  try {
    await formRef.value?.validate()
    loading.value = true
    
    // 这里可以调用API保存表单基本信息
    // const formId = await createFormAPI(formData)
    
    // 跳转到表单设计器，传递表单配置
    router.push({
      name: 'FormDesigner',
      query: {
        formId: 'new', // 或者实际的formId
        title: formData.title,
        description: formData.description,
        labelWidth: formData.labelWidth,
        size: formData.size
      }
    })
    
    ElMessage.success('表单创建成功')
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.form-card {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}
</style>