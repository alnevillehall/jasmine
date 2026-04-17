import type { ContentCategory } from './types'

export const CONTENT_CATEGORY_OPTIONS: { id: ContentCategory; label: string; hint: string }[] = [
  { id: 'grocery', label: 'Grocery', hint: 'Dry goods, snacks, staples…' },
  { id: 'household', label: 'Household', hint: 'Cleaning, paper goods, small appliances…' },
  { id: 'construction', label: 'Construction', hint: 'Tools, fixtures, building supplies…' },
  { id: 'clothing', label: 'Clothing', hint: 'Sizes, styles, quantities…' },
  { id: 'decor', label: 'Decor', hint: 'Art, linens, seasonal items…' },
  { id: 'vacation', label: 'Vacation', hint: 'Travel gear, beach, leisure…' },
  { id: 'event', label: 'Event', hint: 'Party, wedding, gifts…' },
  { id: 'other', label: 'Other', hint: 'Anything that doesn’t fit above…' },
]

export function contentCategoryLabel(id: ContentCategory): string {
  return CONTENT_CATEGORY_OPTIONS.find((o) => o.id === id)?.label ?? id
}
