// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: "2025-11-03",
  css: ["~/assets/css/main.css"],
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@vite-pwa/nuxt"],
  tailwindcss: {
    configPath: "tailwind.config.js",
    cssPath: "~/assets/css/main.css",
  },
  alias: {
    "~/src": "./src",
    "@": "./src",
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1000,
    },
  },
  app: {
    head: {
      title: "擇個吉日",
      meta: [
        {
          name: "description",
          content:
            "「擇個吉日」是一個方便朋友協作夾日期的工具，靈感來自香港俗語「吉日」。這裡的「吉日」不只是風水上的良辰，更是大家能齊聚一堂的美好時刻。讓你和朋友輕鬆選出最適合聚會的日子，讓人多就是吉日！",
        },
        {
          property: "og:title",
          content: "擇個吉日",
        },
        {
          property: "og:description",
          content:
            "「擇個吉日」是一個方便朋友協作夾日期的工具，靈感來自香港俗語「吉日」。這裡的「吉日」不只是風水上的良辰，更是大家能齊聚一堂的美好時刻。讓你和朋友輕鬆選出最適合聚會的日子，讓人多就是吉日！",
        },
        {
          property: "og:image",
          content: "/mandarin.png",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "/mandarin.png",
        },
        {
          rel: "apple-touch-icon",
          href: "/mandarin.png",
        },
        {
          rel: "manifest",
          href: "/manifest.webmanifest",
        },
      ],
    },
  },
  pwa: {
    manifest: {
      name: "擇個吉日",
      short_name: "擇個吉日",
      description: "方便朋友協作夾日期的工具",
      lang: "zh-HK",
      display: "standalone",
      background_color: "#fcfcfc",
      theme_color: "#fcfcfc",
      icons: [
        {
          src: "/mandarin.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/mandarin.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ".*",
          handler: "CacheFirst",
          method: "GET",
        },
      ],
    },
  },
});
