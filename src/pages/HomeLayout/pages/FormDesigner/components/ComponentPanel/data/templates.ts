export interface FormTemplate {
    id: string;
    title: string;
    description: string;
    icon: any;
    usageCount: number;
    tags: string[];
    formData: {
      title: string;
      description: string;
      fields: any[];
    };
  }
  
  export const formTemplates: FormTemplate[] = [
    {
      id: '1',
      title: '用户注册表单',
      description: '包含基本用户信息收集的注册表单模版',
      icon: 'User',
      usageCount: 156,
      tags: ['注册', '用户信息'],
      formData: {
        title: '用户注册表单',
        description: '请填写以下信息完成注册',
        fields: [
          {
            id: 'username',
            type: 'input',
            label: '用户名',
            placeholder: '请输入用户名',
            required: true
          },
          {
            id: 'email',
            type: 'input',
            label: '邮箱',
            placeholder: '请输入邮箱地址',
            required: true
          },
          {
            id: 'password',
            type: 'input',
            label: '密码',
            placeholder: '请输入密码',
            required: true
          },
          {
            id: 'phone',
            type: 'input',
            label: '手机号',
            placeholder: '请输入手机号',
            required: false
          }
        ]
      }
    },
    {
      id: '2',
      title: '客户满意度调查',
      description: '用于收集客户对产品或服务满意度的调查问卷',
      icon: 'ChatDotRound',
      usageCount: 89,
      tags: ['调查', '满意度'],
      formData: {
        title: '客户满意度调查',
        description: '您的反馈对我们很重要',
        fields: [
          {
            id: 'overall_satisfaction',
            type: 'radio',
            label: '总体满意度',
            required: true,
            options: [
              { label: '非常满意', value: '5' },
              { label: '满意', value: '4' },
              { label: '一般', value: '3' },
              { label: '不满意', value: '2' },
              { label: '非常不满意', value: '1' }
            ]
          },
          {
            id: 'feedback',
            type: 'textarea',
            label: '意见建议',
            placeholder: '请输入您的意见和建议',
            required: false
          }
        ]
      }
    },
    {
      id: '3',
      title: '活动报名表',
      description: '适用于各类活动报名的表单模版',
      icon: 'Trophy',
      usageCount: 234,
      tags: ['报名', '活动'],
      formData: {
        title: '活动报名表',
        description: '请填写以下信息完成报名',
        fields: [
          {
            id: 'name',
            type: 'input',
            label: '姓名',
            placeholder: '请输入您的姓名',
            required: true
          },
          {
            id: 'phone',
            type: 'input',
            label: '联系电话',
            placeholder: '请输入联系电话',
            required: true
          },
          {
            id: 'event_date',
            type: 'date',
            label: '参与日期',
            placeholder: '请选择参与日期',
            required: true
          }
        ]
      }
    },
    {
      id: '4',
      title: '产品反馈表',
      description: '收集用户对产品功能和体验的反馈意见',
      icon: 'Postcard',
      usageCount: 67,
      tags: ['反馈', '产品'],
      formData: {
        title: '产品反馈表',
        description: '帮助我们改进产品',
        fields: [
          {
            id: 'product_name',
            type: 'select',
            label: '产品名称',
            placeholder: '请选择产品',
            required: true,
            options: [
              { label: '产品A', value: 'product_a' },
              { label: '产品B', value: 'product_b' },
              { label: '产品C', value: 'product_c' }
            ]
          },
          {
            id: 'rating',
            type: 'radio',
            label: '产品评分',
            required: true,
            options: [
              { label: '5星', value: '5' },
              { label: '4星', value: '4' },
              { label: '3星', value: '3' },
              { label: '2星', value: '2' },
              { label: '1星', value: '1' }
            ]
          },
          {
            id: 'feedback',
            type: 'textarea',
            label: '详细反馈',
            placeholder: '请详细描述您的使用体验和建议',
            required: false
          }
        ]
      }
    }
  ];