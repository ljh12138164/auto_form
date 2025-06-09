<template>
  <div class="template-library">
    <div class="template-list space-y-3">
      <div
        v-for="template in templateList"
        :key="template.id"
        class="template-item p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        @click="handleUseTemplate(template)"
      >
        <div class="flex items-start space-x-3">
          <div class="template-info flex-1 min-w-0">
            <h5 class="text-sm font-medium text-gray-800 truncate">
              {{ template.title }}
            </h5>
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">
              {{ template.description }}
            </p>
            <div class="flex items-center mt-2 space-x-2">
              <span class="text-xs text-gray-400"
                >{{ template.usageCount }}次使用</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getTemplateFormAPI, TemplateForm } from "@/api";
import { onMounted, ref } from "vue";

const emit = defineEmits<{
  useTemplate: [template: TemplateForm];
}>();
const templateList = ref<TemplateForm[]>()
const handleUseTemplate = (template: TemplateForm) => {
  emit("useTemplate", template);
};
const getTemplateFormData =async ()=>{
  const res = await getTemplateFormAPI()
  console.log(res.data);
  templateList.value = res.data
}
onMounted(()=>{
  getTemplateFormData()
})
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
