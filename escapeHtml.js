export function escapeHtml(text) {
  return text
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
