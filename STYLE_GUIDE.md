# Find-a-Date Frontend Style Guide

## 設計理念

- 年輕、趣味、鮮艷
- 支援 Light/Dark Mode
- 統一元件風格，減少 inline class

## 主要色彩

- 主色（primary）：藍色
- 強調色（accent）：橙色/黃色
- 卡片（card）：白色 / 深灰
- 標題（heading）：紅色 / 粉紅
- 輸入框（input）：淺灰 / 深灰

## 字型

- Baloo 2, cursive, sans-serif

## Tailwind Custom Class

### Button

```html
<button class="btn">按鈕</button>
```

- 支援 dark mode: `<button class="btn dark">` ...

### Input

```html
<input class="input" />
```

- 支援 dark mode: `<input class="input dark" />`

### Card

```html
<div class="card">內容</div>
```

- 支援 dark mode: `<div class="card dark">` ...

### Heading

```html
<h1 class="heading">標題</h1>
```

- 支援 dark mode: `<h1 class="heading dark">` ...

## 使用方式

- 直接在元件中使用上述 class，無需重複寫多行 Tailwind class。
- dark mode 由 `<html class="dark">` 控制，元件加上 `dark` class 會自動切換顏色。

## 色彩一覽

| 類型   | Light Mode     | Dark Mode      |
| ------ | -------------- | -------------- |
| 主色   | #3b82f6 (藍)   | #60a5fa (淺藍) |
| 強調色 | #f59e42 (橙)   | #fbbf24 (黃)   |
| 卡片   | #fff (白)      | #1e293b (深灰) |
| 標題   | #ef4444 (紅)   | #f472b6 (粉)   |
| 輸入框 | #f3f4f6 (淺灰) | #334155 (深灰) |

## 其他

- 可依需求擴充更多元件 class
- 建議所有互動元件都用 btn/input/card/heading class
