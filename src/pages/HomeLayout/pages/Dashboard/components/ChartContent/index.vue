<template>
    <div class="h-80" ref="chartRef">
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts'

const chartRef = ref()
let chartInstance: echarts.ECharts | null = null
// 初始化图表
const initChart = () => {
    if (!chartRef.value) return
    
    chartInstance = echarts.init(chartRef.value)
    
    // 模拟数据 - 最近30天的表单创建趋势
    const dates = []
    const values = []
    const today = new Date()
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
        // 生成随机数据，模拟表单创建数量
        values.push(Math.floor(Math.random() * 8) + 1)
    }
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        legend: {
            data: ['表单创建数量']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            minInterval: 1
        },
        series: [
            {
                name: '表单创建数量',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    color: '#3b82f6'
                },
                itemStyle: {
                    color: '#3b82f6'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(59, 130, 246, 0.3)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(59, 130, 246, 0.05)'
                            }
                        ]
                    }
                },
                data: values
            }
        ]
    }
    
    chartInstance.setOption(option)
    
    // 响应式处理
    window.addEventListener('resize', () => {
        chartInstance?.resize()
    })
}
onMounted(() => {
    initChart()
})
</script>

<style lang="scss" scoped>
</style>