import { ElNotification } from "element-plus";
type IType = 'success' | 'info' | 'warning' | 'error'|'primary'

/**
 * @param title 标题
 * @param message 内容
 * @param type 类型 success、info、warning、error、primary
 */
export const notification = (title: string, message: string, type: IType) => {
  ElNotification({
    title: title,
    message: message,
    type: type,
    duration: 1000,
  });
};
