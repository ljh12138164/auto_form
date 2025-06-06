<template>
  <div class="form-items-container">
    <el-form 
      :model="formData" 
      class="form-items-list"
    >
    <!--    mb-2 -->
      <div
        v-for="(element, index) in modelValue"
        :key="element.id"
        
        class="form-item-wrapper p-3 relative border-transparent border-2 rounded-lg hover:border-blue-300 transition-all duration-200 group"
        :class="{ 
          'border-blue-500 bg-blue-50 transform scale-105 shadow-md': selectedItemId === element.id,
          'hover:shadow-sm': selectedItemId !== element.id 
        }"
        @click="$emit('selectItem', element)"
        draggable="true"
        @dragstart="handleItemDragStart($event, element, index)"
        @dragover="handleItemDragOver($event, index)"
        @drop="handleItemDrop($event, index)"
      >
        <!-- 表单项渲染 -->
        <el-form-item
          :label="element.label"
          :prop="element.field"
          :required="element.required"
          class="mb-0"
        >
          <!-- 输入框 -->
          <template v-if="element.type === 'input'">
            <el-input
              :model-value="element.defaultValue"
              :placeholder="element.placeholder"
              class="w-full"
              @click.stop
            />
          </template>
          
          <!-- 选择器 -->
          <template v-else-if="element.type === 'select'">
            <el-select
              :model-value="element.defaultValue"
              :placeholder="element.placeholder"
              class="w-full"
              @click.stop
            >
              <el-option
                v-for="option in element.options || []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>
          
          <!-- 日期选择器 -->
          <template v-else-if="element.type === 'date'">
            <el-date-picker
              :model-value="element.defaultValue"
              :placeholder="element.placeholder"
              class="w-full"
              @click.stop
            />
          </template>
          
          <!-- 开关 -->
          <template v-else-if="element.type === 'switch'">
            <el-switch
              :model-value="element.defaultValue"
              @click.stop
            />
          </template>
          
          <!-- 其他组件（备用） -->
          <template v-else>
            <el-input
              :model-value="element.defaultValue"
              :placeholder="element.placeholder || '请输入内容'"
              class="w-full"
              @click.stop
            />
          </template>
        </el-form-item>

        <!-- 操作按钮 -->
        <div
          class="item-actions absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <el-button-group size="small">
            <el-button @click.stop="$emit('copyItem', element)" title="复制">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
            <el-button @click.stop="$emit('deleteItem', index)" title="删除">
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-button-group>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { CopyDocument, Delete } from "@element-plus/icons-vue";

interface Props {
  modelValue: any[];
  selectedItemId: string | null;
}

const props = defineProps<Props>();
const emits = defineEmits([
  "selectItem",
  "copyItem",
  "deleteItem",
  "change",
  "update:modelValue",
]);

// 表单数据对象
const formData = computed(() => {
  const data: Record<string, any> = {};
  props.modelValue.forEach(item => {
    if (item.field) {
      data[item.field] = item.defaultValue;
    }
  });
  return data;
});

// 拖拽相关
const draggedItem = ref<any>(null);
const draggedIndex = ref<number>(-1);

const handleItemDragStart = (event: DragEvent, item: any, index: number) => {
  draggedItem.value = item;
  draggedIndex.value = index;
  event.dataTransfer!.effectAllowed = "move";
};

const handleItemDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  event.dataTransfer!.dropEffect = "move";
};

const handleItemDrop = (event: DragEvent, dropIndex: number) => {
  event.preventDefault();

  if (draggedIndex.value !== -1 && draggedIndex.value !== dropIndex) {
    const items = [...props.modelValue];
    const draggedItemData = items.splice(draggedIndex.value, 1)[0];
    items.splice(dropIndex, 0, draggedItemData);
    emits("update:modelValue", items);
    emits("change", {
      moved: {
        element: draggedItemData,
        newIndex: dropIndex,
        oldIndex: draggedIndex.value,
      },
    });
  }

  draggedItem.value = null;
  draggedIndex.value = -1;
};

// 可以移除 getComponentByType 函数，因为现在直接在模板中处理
</script>

<style lang="scss" scoped>
.form-item-wrapper {
  position: relative;

  &:hover {
    .item-actions {
      opacity: 1;
    }
  }
}

.item-actions {
  opacity: 0;
  transition: opacity 0.2s;
}
:deep(.el-form-item) {
  margin: 0;
}
</style>
