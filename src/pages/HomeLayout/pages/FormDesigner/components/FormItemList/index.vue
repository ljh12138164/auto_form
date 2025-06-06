<template>
  <div class="form-items-container">
    <el-form :model="formData" class="form-items-list">
      <div
        v-for="(element, index) in modelValue"
        :key="element.id"
        class="form-item-wrapper p-3 relative border-transparent border-2 rounded-lg hover:border-blue-300 transition-all duration-200 group cursor-move"
        :class="{
          'border-blue-500 bg-blue-50 transform scale-105 shadow-md':
            selectedItemId === element.id,
          'hover:shadow-sm': selectedItemId !== element.id,
          dragging: draggedIndex === index,
        }"
        @click="$emit('selectItem', element)"
        draggable="true"
        @dragstart="handleItemDragStart($event, element, index)"
        @dragover="handleItemDragOver($event, index)"
        @drop="handleItemDrop($event, index)"
        @dragenter="handleItemDragEnter($event, index)"
        @dragend="handleItemDragEnd($event)"
      >
        <!-- 拖拽指示器 -->
        <div
          class="drag-indicator absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <el-icon class="text-gray-400"><Rank /></el-icon>
        </div>

        <!-- 插入指示线 -->
        <div
          v-if="dragOverIndex === index && draggedIndex !== index"
          class="drop-indicator absolute top-0 left-0 right-0 h-0.5 bg-blue-500 z-10"
        ></div>

        <!-- 表单项渲染 -->
        <el-form-item
          :disabled="true"
          :label-width="element.labelWidth"
          :label="element.label"
          :prop="element.field"
          :required="element.required"
          class="mb-0 ml-6"
        >
          <!-- 文本输入 -->
          <template v-if="element.type === 'input'">
            <ElInput :element @click.stop></ElInput>
          </template>
          <!-- 选择器 -->
          <template v-else-if="element.type === 'select'">
            <ElSelect :element @click.stop></ElSelect>
          </template>
          <!-- 日期选择器 -->
          <template v-else-if="element.type === 'date'">
            <ElDatePicker :element @click.stop></ElDatePicker>
          </template>
          <!-- 开关 -->
          <template v-else-if="element.type === 'switch'">
            <ElSwitch :element @click.stop></ElSwitch>
          </template>
          <!-- 文本域 -->
          <template v-else-if="element.type === 'textarea'">
            <ElTextarea :element @click.stop></ElTextarea>
          </template>
          <!-- 文件上传 -->
          <template v-else-if="element.type === 'upload'">
            <ElUpload :element @click.stop></ElUpload>
          </template>
          <!-- 数字输入框 -->
          <template v-else-if="element.type === 'number'">
            <ElInputNumber :element @click.stop></ElInputNumber>
          </template>
          <!-- 单选框 -->
          <template v-else-if="element.type === 'radio'">
            <ElRadio :element @click.stop></ElRadio>
          </template>
          <!-- 多选框 -->
          <template v-else-if="element.type === 'checkbox'">
            <ElCheckbox :element @click.stop></ElCheckbox>
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
import { CopyDocument, Delete, Rank } from "@element-plus/icons-vue";
import ElInput from "./components/ElInput/index.vue";
import ElSelect from "./components/ElSelect/index.vue";
import ElDatePicker from "./components/ElDatePicker/index.vue";
import ElSwitch from "./components/ElSwitch/index.vue";
import ElTextarea from './components/ElTextarea/index.vue'
import ElUpload from './components/ElUpload/index.vue'
import ElInputNumber from './components/ElInputNumber/index.vue'
import ElRadio from './components/ElRadio/index.vue'
import ElCheckbox from './components/ElCheckbox/index.vue'
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
  props.modelValue.forEach((item) => {
    if (item.field) {
      data[item.field] = item.defaultValue;
    }
  });
  return data;
});

// 拖拽相关
const draggedItem = ref<any>(null);
const draggedIndex = ref<number>(-1);
const dragOverIndex = ref<number>(-1);

const handleItemDragStart = (event: DragEvent, item: any, index: number) => {
  console.log("开始拖拽:", item.label, "index:", index);

  // 阻止事件冒泡到父容器
  event.stopPropagation();

  draggedItem.value = item;
  draggedIndex.value = index;
  event.dataTransfer!.effectAllowed = "move";

  // 设置拖拽数据，使用特殊标识区分内部排序和外部添加
  event.dataTransfer!.setData("text/plain", "internal-sort");
  event.dataTransfer!.setData(
    "application/x-form-item-sort",
    JSON.stringify({
      index,
      item,
    })
  );

  // 添加拖拽样式
  if (event.target instanceof HTMLElement) {
    const wrapper = event.target.closest(".form-item-wrapper") as HTMLElement;
    if (wrapper) {
      wrapper.style.opacity = "0.5";
    }
  }
};

const handleItemDragOver = (event: DragEvent, index: number) => {
  // 检查是否是内部排序
  const isInternalSort = event.dataTransfer?.types.includes(
    "application/x-form-item-sort"
  );
  if (!isInternalSort) return;

  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer!.dropEffect = "move";

  dragOverIndex.value = index;
};

const handleItemDragEnter = (event: DragEvent, index: number) => {
  // 检查是否是内部排序
  const isInternalSort = event.dataTransfer?.types.includes(
    "application/x-form-item-sort"
  );
  if (!isInternalSort) return;

  event.preventDefault();
  event.stopPropagation();
};

const handleItemDragEnd = (event: DragEvent) => {
  // 恢复所有样式
  const draggedElements = document.querySelectorAll(
    '.form-item-wrapper[style*="opacity"]'
  );
  draggedElements.forEach((el: any) => {
    el.style.opacity = "";
  });

  // 重置状态
  draggedItem.value = null;
  draggedIndex.value = -1;
  dragOverIndex.value = -1;
};

const handleItemDrop = (event: DragEvent, dropIndex: number) => {
  // 检查是否是内部排序
  const isInternalSort = event.dataTransfer?.types.includes(
    "application/x-form-item-sort"
  );
  if (!isInternalSort) {
    return; // 让父容器处理外部组件添加
  }

  event.preventDefault();
  event.stopPropagation();

  console.log(
    "FormItemList 内部排序 - 放置到:",
    dropIndex,
    "原位置:",
    draggedIndex.value
  );

  if (draggedIndex.value !== -1 && draggedIndex.value !== dropIndex) {
    const items = [...props.modelValue];
    const draggedItemData = items.splice(draggedIndex.value, 1)[0];
    items.splice(dropIndex, 0, draggedItemData);

    console.log(
      "FormItemList 更新后的数组:",
      items.map((item) => item.label)
    );

    emits("update:modelValue", items);
    emits("change", {
      moved: {
        element: draggedItemData,
        newIndex: dropIndex,
        oldIndex: draggedIndex.value,
      },
    });
  }

  // 重置状态
  dragOverIndex.value = -1;
};
</script>

<style lang="scss" scoped>
.form-item-wrapper {
  position: relative;
  user-select: none;

  &:hover {
    .item-actions {
      opacity: 1;
    }
  }

  &.dragging {
    opacity: 0.5;
  }
}

.item-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.drag-indicator {
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.drop-indicator {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

:deep(.el-form-item) {
  margin: 0;
}

:deep(.el-form-item__content) {
  pointer-events: none;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-date-editor),
:deep(.el-switch) {
  pointer-events: auto;
}
</style>
