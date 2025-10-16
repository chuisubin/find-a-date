# Find-a-Date

本專案已改為純前端架構，所有檔案皆在根目錄。
資料庫採用 Supabase 雲端服務。

## 專案結構

```
find-a-date/
  index.html
  src/
  package.json
  package-lock.json
  node_modules/
  tailwind.config.js
  postcss.config.cjs
  vite.config.js
  STYLE_GUIDE.md
  README.md
```

## 技術棧

- **Framework:** Vue.js 3
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **Database:** Supabase (PostgreSQL 雲端)

## 安裝與啟動

```powershell
npm install
npm run dev
```

---

如需串接 Supabase，請參考 src/api/supabase.js 範例。

# Find-a-Date Monorepo

This project uses a Monorepo structure with separate `frontend` and `backend` folders.

## Frontend

- **Framework:** Vue.js 3
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

### Setup & Run

```powershell
cd frontend
npm install
npm run dev
```

## Backend

- **Framework:** Node.js (Express.js)

### Setup & Run

```powershell
cd backend
npm install
npm start
```

---

## Folder Structure

```
find-a-date/
  frontend/   # Vue.js + Tailwind
  backend/    # Express.js API
```
