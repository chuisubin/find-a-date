<template>
  <HomePage />
</template>

<script setup>
import HomePage from '../views/HomePage.vue'

// 設定 Home 頁面的 SEO meta 標籤
useSeoMeta({
  title: '擇個吉日',
  ogTitle: '擇個吉日',
  description: '「擇個吉日」是一個方便朋友協作夾日期的工具，靈感來自香港俗語「吉日」，在東方文化中象徵好日子、好時機。這裡的「吉日」不只是風水上的良辰，更是大家能齊聚一堂的美好時刻。讓你和朋友輕鬆選出最適合聚會的日子，讓人多就是吉日！',
  ogDescription: '「擇個吉日」是一個方便朋友協作夾日期的工具，靈感來自香港俗語「吉日」，在東方文化中象徵好日子、好時機。這裡的「吉日」不只是風水上的良辰，更是大家能齊聚一堂的美好時刻。讓你和朋友輕鬆選出最適合聚會的日子，讓人多就是吉日！',
  ogImage: '/mandarin.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>
