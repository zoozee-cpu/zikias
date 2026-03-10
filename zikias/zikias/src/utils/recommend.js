import { PRODUCTS } from '../data/products'

// ─── recommend ────────────────────────────────────────────────────────────────
// Scores each product against the quiz answers and returns top 3 matches

export function recommend(answers) {
  return PRODUCTS
    .map(p => {
      const score = [
        p.mood      === answers.mood,
        p.occasion  === answers.occasion,
        p.family    === answers.family,
        p.intensity === answers.intensity,
      ].filter(Boolean).length

      return { ...p, score }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
