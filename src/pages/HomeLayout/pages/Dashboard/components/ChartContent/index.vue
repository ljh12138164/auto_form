<template>
  <div class="h-80" ref="chartRef"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import * as echarts from "echarts";
import { getDashboardtrendsAPI,type Tchart } from "@/api";

const chartRef = ref();
let chartInstance: echarts.ECharts | null = null;

const { dateRange } = defineProps<{
  dateRange?: Array<string>;
}>();

// 计算默认日期范围（最近一周）
const getDefaultDateRange = () => {
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  return [
    oneWeekAgo.toISOString().split("T")[0],
    today.toISOString().split("T")[0],
  ];
};

// 使用计算属性处理日期范围，如果没有传入则使用默认值
const effectiveDateRange = computed(() => {
  return dateRange && dateRange.length === 2
    ? dateRange
    : getDefaultDateRange();
});

// 存储图表数据
const chartData = ref<Tchart[]>([]);

// 初始化图表
const initChart = (apiData: Tchart[]) => {
  if (!chartRef.value) return;

  chartInstance = echarts.init(chartRef.value);

  let dates = [];
  let values = [];

  if (apiData && apiData.length > 0) {
    // 使用真实的接口数据
    dates = apiData.map((item) => {
      // @ts-ignore
      const date = new Date(item.date);
      return date.toLocaleDateString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
      });
    });
    // @ts-ignore
    values = apiData.map((item) => item.count);
  } else {
    // 如果没有数据，使用默认的模拟数据
    const startDate = new Date(effectiveDateRange.value[0]);
    const endDate = new Date(effectiveDateRange.value[1]);

    const daysDiff = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(
        date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })
      );
      values.push(Math.floor(Math.random() * 8) + 1);
    }
  }

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: ["表单创建数量"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: dates,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "表单创建数量",
        type: "line",
        stack: "Total",
        smooth: true,
        lineStyle: {
          color: "#3b82f6",
        },
        itemStyle: {
          color: "#3b82f6",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "rgba(59, 130, 246, 0.3)",
              },
              {
                offset: 1,
                color: "rgba(59, 130, 246, 0.05)",
              },
            ],
          },
        },
        data: values,
      },
    ],
  };

  chartInstance.setOption(option);

  // 响应式处理
  window.addEventListener("resize", () => {
    chartInstance?.resize();
  });
};

const data = ref({
  startDate: effectiveDateRange.value[0],
  endDate: effectiveDateRange.value[1],
  days: null,
});

const getDashboardtrendsData = async () => {
  try {
    const res = await getDashboardtrendsAPI(data.value);
    console.log("接口返回数据:", res.data);

    // 更新图表数据
    chartData.value = res.data;
    console.log("图表数据:", chartData.value);

    // 重新初始化图表，使用真实数据
    initChart(res.data);
  } catch (error) {
    console.error("获取趋势数据失败:", error);
    // 如果接口失败，使用模拟数据
    initChart([]);
  }
};

watch(
  () => effectiveDateRange.value,
  async (time) => {
    data.value.startDate = time[0];
    data.value.endDate = time[1];
    await getDashboardtrendsData();
  },
  {
    deep: true,
  }
);

onMounted(() => {
  // 先初始化图表（使用模拟数据），然后获取真实数据
  initChart([]);
  getDashboardtrendsData();
});
</script>

<style lang="scss" scoped></style>
