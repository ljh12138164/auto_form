<template>
    <div class="template-card">
      <div class="template-preview" v-if="template.thumbnail">
        <img :src="template.thumbnail" :alt="template.title" />
      </div>
      
      <div class="template-info">
        <h4 class="template-title">{{ template.title }}</h4>
        <p class="template-description">{{ template.description }}</p>
        
        <div class="template-meta">
          <span class="usage-count">
            <el-icon><User /></el-icon>
            {{ template.usageCount }}次使用
          </span>
          <el-tag size="small" type="info">{{ template.category }}</el-tag>
        </div>
        
        <div class="template-actions">
          <el-button 
            type="primary" 
            size="small" 
            @click="$emit('use', template)"
          >
            使用模版
          </el-button>
          <el-button 
            size="small" 
            @click="$emit('preview', template)"
          >
            预览
          </el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    template: any
  }>()
  
  defineEmits(['use', 'preview'])
  </script>
  
  <style scoped lang="scss">
  .template-card {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s;
    background: #fff;
    
    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
    }
  }
  
  .template-preview {
    height: 120px;
    overflow: hidden;
    background: #f5f7fa;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .template-info {
    padding: 12px;
  }
  
  .template-title {
    margin: 0 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }
  
  .template-description {
    margin: 0 0 12px 0;
    font-size: 12px;
    color: #606266;
    line-height: 1.4;
  }
  
  .template-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .usage-count {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #909399;
    }
  }
  
  .template-actions {
    display: flex;
    gap: 8px;
    
    .el-button {
      flex: 1;
    }
  }
  </style>