<template>
  <div class="form-items-container">
    <div class="form-items-list space-y-4">
      <div
        v-for="(element, index) in modelValue"
        :key="element.id"
        class="form-item-wrapper relative p-4 border-2 border-transparent rounded-lg hover:border-blue-300 transition-all duration-200 group"
        :class="{ 'border-blue-500 bg-blue-50': selectedItemId === element.id }"
        @click="$emit('selectItem', element)"
        draggable="true"
        @dragstart="handleItemDragStart($event, element, index)"
        @dragover="handleItemDragOver($event, index)"
        @drop="handleItemDrop($event, index)"
      >
        <!-- 表单项渲染 -->
        <el-form-item
          :label="element.label"
          :required="element.required"
          class="mb-0"
        >
          <component
            :is="getComponentByType(element.type)"
            v-bind="element.props"
            :model-value="element.defaultValue"
            :placeholder="element.placeholder"
            :disabled="true"
            class="w-full"
          >
            <!-- 选择器选项 -->
            <template v-if="element.type === 'select'">
              <el-option
                v-for="option in element.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </template>
          </component>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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

// 根据类型获取组件
const getComponentByType = (type: string) => {
  const componentMap: Record<string, string> = {
    input: "el-input",
    select: "el-select",
    date: "el-date-picker",
    switch: "el-switch",
  };
  return componentMap[type] || "el-input";
};
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
</style>
