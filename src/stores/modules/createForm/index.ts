import { defineStore } from "pinia";
import { ref } from "vue";

defineStore('create',()=>{
    const createFormInfo = ref({
        title: '',
        description: '',
        createTime: '',
        updateTime: ''
    })
})