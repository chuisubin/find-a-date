if ("navigation" in window) {
  window.navigation.addEventListener("navigate", (event) => {
    const url = new URL(event.destination.url);
    console.log("Navigated to:", url.href);

    // 在這裡處理特定的路由邏輯
    if (url.pathname.startsWith("/event")) {
      // 例如：導航到事件頁面
      window.location.href = url.href;
    }
  });
}
