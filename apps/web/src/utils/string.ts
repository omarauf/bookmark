export function detectLanguage(text: string) {
  const arabicRegex = /[\u0600-\u06FF]/;
  const englishRegex = /[A-Za-z]/;

  const hasArabic = arabicRegex.test(text);
  const hasEnglish = englishRegex.test(text);

  if (hasArabic && hasEnglish) {
    return "mixed";
  }
  if (hasArabic) {
    return "arabic";
  }
  if (hasEnglish) {
    return "english";
  }
  return "unknown";
}
