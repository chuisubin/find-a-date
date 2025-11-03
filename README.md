# Find-a-Date

本專案已改為純前端架構，所有檔案皆在根目錄。
資料庫採用 Supabase 雲端服務。

## 專案說明

「擇個吉日」是一個幫助朋友之間快速協調聚會日期的工具。免註冊、簡單上手，讓聚會安排變得輕鬆。

### 功能特色

- 快速生成聚會活動。
- 創建自己的角色，選擇可行日期。
- 創建者確認最終日期，生成邀請函。

## 使用方法

1. 生成聚會活動。
2. 創建自己的角色，選擇自己可行的日期。
3. 最後由創建者確認最終日期，生成邀請函。

## 專案結構

```
find-a-date/
  app.vue
  index.html
  nuxt.config.ts
  package.json
  package-lock.json
  node_modules/
  tailwind.config.js
  jsconfig.json
  STYLE_GUIDE.md
  README.md
```

## 技術棧

- **Framework:** Nuxt 3 (基於 Vue.js 3)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL 雲端)

## 安裝與啟動

```powershell
npm install
npm run dev
```

---

如需串接 Supabase，請參考 `api/supabase.js` 範例。
