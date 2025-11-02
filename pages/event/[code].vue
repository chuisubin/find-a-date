<template>
  <EventPage :code="code" />
</template>

<script setup>
import EventPage from '~/views/EventPage.vue'
import { useEvent } from '~/composables/useEvent'
import { watch } from 'vue'

const route = useRoute()
const code = route.params.code

// 獲取事件資料用於 SEO
const { event, fetchEvent } = useEvent()

// 初始化時獲取事件資料
await fetchEvent(code)

// 動態設定 Event 頁面的 SEO meta 標籤
const eventTitle = computed(() => event.value?.title ? `${event.value.title} - 擇個吉日` : '擇個吉日')
const eventDescription = computed(() => {
  if (event.value?.description) {
    return `${event.value.description} | 「擇個吉日」是一個方便朋友協作夾日期的工具，讓你和朋友輕鬆選出最適合聚會的日子！`
  }
  return '「擇個吉日」是一個方便朋友協作夾日期的工具，靈感來自香港俗語「吉日」，在東方文化中象徵好日子、好時機。這裡的「吉日」不只是風水上的良辰，更是大家能齊聚一堂的美好時刻。讓你和朋友輕鬆選出最適合聚會的日子，讓人多就是吉日！'
})

useSeoMeta({
  title: eventTitle,
  ogTitle: eventTitle,
  description: eventDescription,
  ogDescription: eventDescription,
  ogImage: '/mandarin.png',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>
