import { FormItem, getCreateFormAPI } from "@/api";
import { defineStore } from "pinia";
import { ref } from "vue";

const useCreateStore = defineStore("create", () => {
  const createFormInfo = ref<FormItem[]>([]);
  const getCreateFormData = async () => {
    const res = await getCreateFormAPI();
    createFormInfo.value = res.data;
  };
  return {
    getCreateFormData,
    createFormInfo
  }
});
export default useCreateStore