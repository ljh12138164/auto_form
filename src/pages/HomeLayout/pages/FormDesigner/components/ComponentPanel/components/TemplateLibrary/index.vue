<template>
  <div class="template-library">
    <div class="template-list space-y-3">
      <div
        v-for="template in templateList"
        :key="template.id"
        class="template-item p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
      >
        <div class="flex space-x-3">
          <!-- 模板预览图 -->
          <div 
            class="template-preview cursor-pointer flex-shrink-0"
            @click="showImagePreview(template)"
          >
            <img 
              :src="template.img || '/default-template.png'"
              :alt="template.title"
              class="w-16 h-16 object-cover rounded border border-gray-200 hover:border-blue-400 transition-colors"
            />
            <div class="preview-overlay">
              <el-icon class="preview-icon"><ZoomIn /></el-icon>
            </div>
          </div>
          
          <div class="template-info flex-1 min-w-0">
            <h5 class="text-sm font-medium text-gray-800 truncate">
              {{ template.title }}
            </h5>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">
              {{ template.description }}
            </p>
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs text-gray-400">
                {{ template.usageCount }}次使用
              </span>
              <el-button 
                type="primary" 
                size="large" 
                link
                @click="showConfirmDialog(template)"
              >
                使用模版
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图片预览对话框 -->
    <el-dialog
      v-model="imagePreviewVisible"
      title="模板预览"
      width="1000px"
      :before-close="closeImagePreview"
      class="image-preview-dialog"
      style="position: fixed;left: 50%; transform: translateX(-50%);top: -100px;"
    >
      <div class="image-preview-content">
        <img 
          :src="currentPreviewImage"
          :alt="currentTemplate?.title"
          class="preview-image"
        />
        <div class="image-info mt-4">
          <h3 class="text-lg font-medium text-gray-800">{{ currentTemplate?.title }}</h3>
          <p class="text-sm text-gray-600 mt-2">{{ currentTemplate?.description }}</p>
          <div class="flex items-center justify-between mt-4">
            <span class="text-sm text-gray-500">{{ currentTemplate?.usageCount }}次使用</span>
            <el-button 
              type="primary"
              @click="useTemplateFromPreview"
            >
              使用此模板
            </el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    
    <!-- 确认对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="使用模版确认"
      width="500px"
      :before-close="handleClose"
    >
      <div class="dialog-content">
        <el-icon class="warning-icon"><WarningFilled /></el-icon>
        <div class="warning-text">
          <p class="text-base font-medium mb-2">确认使用模版？</p>
          <p class="text-sm text-gray-600">
            使用模版将会覆盖当前表单的所有内容，此操作不可撤销。
          </p>
          <p class="text-sm text-blue-600 mt-2">
            即将使用：{{ selectedTemplate?.title }}
          </p>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUseTemplate">
            确认使用
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { addTemplateCountAPI, getTemplateFormAPI, TemplateForm } from "@/api";
import { WarningFilled, ZoomIn } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from "vue";

const emit = defineEmits<{
  useTemplate: [template: TemplateForm];
}>();

const templateList = ref<TemplateForm[]>()
const dialogVisible = ref(false)
const selectedTemplate = ref<TemplateForm | null>(null)

// 图片预览相关
const imagePreviewVisible = ref(false)
const currentPreviewImage = ref('')
const currentTemplate = ref<TemplateForm | null>(null)

// 显示图片预览
const showImagePreview = (template: TemplateForm) => {
  currentTemplate.value = template
  currentPreviewImage.value = template.img || '/default-template.png'
  imagePreviewVisible.value = true
}

// 关闭图片预览
const closeImagePreview = () => {
   imagePreviewVisible.value = false
}

// 从预览中使用模板
const useTemplateFromPreview = () => {
  if (currentTemplate.value) {
    showConfirmDialog(currentTemplate.value)
    closeImagePreview()
  }
}

// 显示确认对话框
const showConfirmDialog = (template: TemplateForm) => {
  selectedTemplate.value = template
  dialogVisible.value = true
}

// 确认使用模版
const confirmUseTemplate = async () => {
  if (selectedTemplate.value) {
    emit("useTemplate", selectedTemplate.value);
    ElMessage.success(`已使用模版：${selectedTemplate.value.title}`)
    dialogVisible.value = false
    await addTemplateCountAPI({
      id: selectedTemplate.value.id
    })
    await getTemplateFormData()
  }
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
  selectedTemplate.value = null
}

const getTemplateFormData = async () => {
  const res = await getTemplateFormAPI()
  templateList.value = res.data
}

onMounted(() => {
  getTemplateFormData()
})
</script>

<style scoped lang="scss">
.template-library {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.template-list {
  flex: 1;
  overflow-y: auto;
}

.template-item {
  user-select: none;
}

.template-preview {
  position: relative;
  
  &:hover .preview-overlay {
    opacity: 1;
  }
}

.preview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 4px;
}

.preview-icon {
  color: white;
  font-size: 20px;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dialog-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  .warning-icon {
    color: #e6a23c;
    font-size: 24px;
    margin-top: 2px;
    flex-shrink: 0;
  }
  
  .warning-text {
    flex: 1;
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

// 图片预览对话框样式
:deep(.image-preview-dialog) {
  .el-dialog__body {
    padding: 20px;
  }
}

.image-preview-content {
  text-align: center;

}

.preview-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-info {
  text-align: left;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}
</style>