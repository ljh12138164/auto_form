// ECharts 按需引入配置
import * as echarts from 'echarts/core';

// 引入图表类型
import {
    BarChart,
    LineChart,
    PieChart
} from 'echarts/charts';

// 引入组件
import {
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent
} from 'echarts/components';

// 引入渲染器
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必要的组件
// 根据项目需要选择性注册
echarts.use([
  // 图表类型
  LineChart,
  BarChart,
  PieChart,
  
  // 组件
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  ToolboxComponent,
  DataZoomComponent,
  
  // 渲染器和功能
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
]);

export { echarts };
