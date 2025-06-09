<template>
    <div class="template-library">
      <div class="template-list space-y-3">
        <div
          v-for="template in filteredTemplates"
          :key="template.id"
          class="template-item p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          @click="handleUseTemplate(template)"
        >
          <div class="flex items-start space-x-3">
            <div class="template-icon flex-shrink-0">
              <el-icon class="text-lg text-blue-500">
                <component :is="getIconComponent(template.icon)" />
              </el-icon>
            </div>
            <div class="template-info flex-1 min-w-0">
              <h5 class="text-sm font-medium text-gray-800 truncate">{{ template.title }}</h5>
              <p class="text-xs text-gray-500 mt-1 line-clamp-2">{{ template.description }}</p>
              <div class="flex items-center mt-2 space-x-2">
                <span class="text-xs text-gray-400">{{ template.usageCount }}次使用</span>
                <div class="flex space-x-1">
                  <el-tag
                    v-for="tag in template.tags.slice(0, 2)"
                    :key="tag"
                    size="small"
                    type="info"
                    effect="plain"
                    class="text-xs"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { formTemplates, type FormTemplate } from '../../data/templates'
  import {
    User,
    ChatDotRound,
    Trophy,
    Postcard
  } from '@element-plus/icons-vue'
  
  const emit = defineEmits<{
    useTemplate: [template: FormTemplate]
  }>()
  
  const searchKeyword = ref('')
  const activeCategory = ref('all')
  
  const iconMap = {
    User,
    ChatDotRound,
    Trophy,
    Postcard
  }
  
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName as keyof typeof iconMap] || User
  }
  
  const filteredTemplates = computed(() => {
    return formTemplates.filter(template => {
      const matchesSearch = !searchKeyword.value || 
        template.title.includes(searchKeyword.value) ||
        template.description.includes(searchKeyword.value)
      
      const matchesCategory = activeCategory.value === 'all' || 
        template.tags.includes(activeCategory.value)
      
      return matchesSearch && matchesCategory
    })
  })
  
  const handleUseTemplate = (template: FormTemplate) => {
    emit('useTemplate', template)
  }
  </script>
  
  <style scoped lang="scss">
  .template-library {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  .category-tag {
    transition: all 0.2s;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
  
  .template-list {
    flex: 1;
    overflow-y: auto;
  }
  
  .template-item {
    user-select: none;
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  </style>