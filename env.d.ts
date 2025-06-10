/// <reference types="vite/client" />

// Element Plus 模块声明
declare module 'element-plus/dist/locale/zh-cn.mjs'

// Vue 组件类型声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Web API 类型补充（如果需要使用蓝牙等API）
declare global {
  interface BluetoothLEScanFilter {
    name?: string;
    namePrefix?: string;
    services?: BluetoothServiceUUID[];
    manufacturerData?: Record<number, DataView>;
    serviceData?: Record<BluetoothServiceUUID, DataView>;
  }
  
  interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
  }
  
  interface BluetoothRemoteGATTServer {
    device: BluetoothDevice;
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
  }
  
  type BluetoothServiceUUID = number | string;
  
  type OrientationLockType = 
    | "any"
    | "natural"
    | "landscape"
    | "portrait"
    | "portrait-primary"
    | "portrait-secondary"
    | "landscape-primary"
    | "landscape-secondary";
}

export {}
