export interface FormItem {
    id: string
    type: string
    label: string
    field: string
    placeholder?: string
    required: boolean
    defaultValue: any
    props?: Record<string, any>
    options?: Array<{ label: string; value: any }>
    labelWidth?: string
  }