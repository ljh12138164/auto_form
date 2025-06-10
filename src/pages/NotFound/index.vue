<template>
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <div class="error-message">页面未找到</div>
        <div class="error-description">
          抱歉，您访问的页面不存在或已被删除
        </div>
        <div class="countdown">
          {{ countdown }} 秒后自动返回上一页
        </div>
        <div class="actions">
          <button @click="goBack" class="back-btn">立即返回</button>
          <!-- <button @click="goHome" class="home-btn">返回首页</button> -->
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const countdown = ref(3)
  // @ts-ignore
  let timer: NodeJS.Timeout | null = null
  
  const goBack = () => {
    if (timer) {
      clearInterval(timer)
    }
    // 检查是否有历史记录
    if (window.history.length > 1) {
      router.go(-1)
    } else {
      // 如果没有历史记录，跳转到首页
      router.push('/home')
    }
  }
  
  // const goHome = () => {
  //   if (timer) {
  //     clearInterval(timer)
  //   }
  //   router.push('/home')
  // }
  
  const startCountdown = () => {
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        goBack()
      }
    }, 1000)
  }
  
  onMounted(() => {
    startCountdown()
  })
  
  onUnmounted(() => {
    if (timer) {
      clearInterval(timer)
    }
  })
  </script>
  
  <style lang="scss" scoped>
  .not-found-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Arial', sans-serif;
  }
  
  .not-found-content {
    text-align: center;
    color: white;
    padding: 2rem;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .error-code {
    font-size: 8rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    background: linear-gradient(45deg, #ff6b6b, #feca57);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .error-message {
    font-size: 2rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }
  
  .error-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    line-height: 1.5;
  }
  
  .countdown {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    font-weight: 500;
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .back-btn,
  .home-btn {
    padding: 0.8rem 2rem;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  
  .back-btn {
    background: linear-gradient(45deg, #ff6b6b, #ee5a52);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
    }
  }
  
  .home-btn {
    background: linear-gradient(45deg, #4ecdc4, #44a08d);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(78, 205, 196, 0.4);
    }
  }
  
  @media (max-width: 768px) {
    .error-code {
      font-size: 6rem;
    }
    
    .error-message {
      font-size: 1.5rem;
    }
    
    .not-found-content {
      margin: 1rem;
      padding: 1.5rem;
    }
    
    .actions {
      flex-direction: column;
      align-items: center;
    }
    
    .back-btn,
    .home-btn {
      width: 200px;
    }
  }
  </style>