export const formatKeywordsToArray = (keywords: any): string[] => {
  if (!keywords) return [];

  // If it's already an array, return it
  if (Array.isArray(keywords)) return keywords;

  // If it's a string that looks like a Postgres array literal
  if (
    typeof keywords === "string" &&
    keywords.startsWith("{") &&
    keywords.endsWith("}")
  ) {
    // Remove the curly braces and split by comma
    // Handle quoted and unquoted strings
    return keywords
      .slice(1, -1)
      .split(",")
      .map((k) => k.trim().replace(/^"(.*)"$/, "$1"))
      .filter((k) => k.length > 0);
  }

  // If it's a single string, return it as an array
  if (typeof keywords === "string") {
    return [keywords];
  }

  return [];
};
