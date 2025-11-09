# 全站設計風格指南

## 響應式設計

- 使用 Tailwind CSS，`lg:` 以上為桌面版，以下為手機版。
- 所有頁面、Popup、按鈕皆需適配手機與桌面，確保內容自動排版、字體大小適中。
- 主要排版建議：
  - 桌面：多欄、寬度最大不超過 1200px。
  - 手機：單欄、間距加大，按鈕易點擊。

## Popup 彈窗

- 使用固定寬度（如 w-96）桌面，手機則 w-full px-4。
- 內容垂直居中，按鈕橫向排列，手機時可改為縱向。
- 關閉按鈕、確認、取消等皆需明顯易操作。

## 按鈕統一風格

- 按鈕圓角（rounded），字體中等（text-base），padding 統一（px-3 py-1）。
- 主要操作（確認、保存）：綠色（bg-green-500 text-white）。
- 取消、關閉：灰色（bg-gray-400 text-white）。
- 危險操作（刪除、關閉聚會）：紅色（bg-red-500 text-white）。
- 編輯類按鈕可用筆 icon（Font Awesome），不需文字。

## Icon 樣式

- 全站統一使用 Font Awesome。
- 引入方式：`@fortawesome/fontawesome-free`。
- 按鈕、Popup、Header、重要操作皆可用 icon 輔助。
- 例如：編輯（fa-pen）、侏存（fa-check）、取消（fa-xmark）、關閉（fa-times）、日曆（fa-calendar-days）。

## 色彩建議

- 主色：綠色、藍色、黃色，明亮、溫暖。
- 輔助色：灰色、白色。
- 禁用/不可操作：低飽和灰色。

## 字體

- 使用系統字體，確保跨平台一致性。
- 標題字重（font-bold），內容字體（font-normal）。

## 其他

- 所有互動元素 hover 狀態需明顯。
- 手機優先設計，桌面優化排版。

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
