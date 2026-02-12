import { AUTO_CAT_KEYWORDS, DEFAULT_CATEGORIES, Category } from '../constants/categories';

export interface DetectionResult {
  cat: string;
  confidence: 'high' | 'low' | 'learned';
  keyword?: string;
}

export function autoDetectCategory(
  text: string,
  categories: Record<string, Category>,
  learnedKeywords: Record<string, string> = {},
  customCatKeywords: Record<string, string[]> = {}
): DetectionResult | null {
  const lower = text.toLowerCase();

  // 1. Check learned keywords first (user corrections)
  for (const [word, catId] of Object.entries(learnedKeywords)) {
    if (lower.includes(word.toLowerCase())) {
      return { cat: catId, confidence: 'learned', keyword: word };
    }
  }

  // 2. Check built-in keywords
  const scores: Record<string, number> = {};
  for (const [catId, keywords] of Object.entries(AUTO_CAT_KEYWORDS)) {
    scores[catId] = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        scores[catId] += kw.length;
      }
    }
  }

  // 3. Check custom category keywords
  for (const [catId, keywords] of Object.entries(customCatKeywords)) {
    if (!scores[catId]) scores[catId] = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        scores[catId] += kw.length;
      }
    }
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0 && sorted[0][1] > 0) {
    return {
      cat: sorted[0][0],
      confidence: sorted[0][1] > 8 ? 'high' : 'low',
    };
  }

  return null;
}

export function detectShopCategory(name: string, shopCategories: Record<string, { keywords: string[] }>): string {
  const lower = name.toLowerCase();
  for (const [catId, catData] of Object.entries(shopCategories)) {
    if (catData.keywords.some(kw => lower.includes(kw))) return catId;
  }
  return 'sonstiges';
}

export function learnCategoryCorrection(
  taskTitle: string,
  newCat: string,
  oldCat: string,
  learnedKeywords: Record<string, string>,
  existingKeywords: string[] = []
): Record<string, string> {
  if (newCat === oldCat) return learnedKeywords;

  const updated = { ...learnedKeywords };
  const words = taskTitle.toLowerCase().split(/\s+/).filter(w => w.length >= 3);

  words.forEach(word => {
    if (!existingKeywords.includes(word)) {
      updated[word] = newCat;
    }
  });

  return updated;
}
