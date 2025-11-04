// src/utils/dateFormat.js
export function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateDeadlineText(deadlineDate) {
  if (!deadlineDate) return "";
  const today = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0) return `剩餘 ${diffDays} 天`;
  if (diffDays === 0) return "今天截止";
  return "已截止";
}
