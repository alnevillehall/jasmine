/** Shared Florida warehouse — each customer gets a unique suite code on their label line. */
export const WAREHOUSE = {
  attentionLine: 'Jasmine Shipping Warehouse',
  line1: '1840 NW 79th Ave',
  city: 'Miami',
  state: 'FL',
  postalCode: '33147',
  country: 'United States',
} as const

export function generateSuiteCode(): string {
  const part = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `JGL-${part}`
}

export function formatWarehouseLines(fullName: string, suiteCode: string): string[] {
  return [
    WAREHOUSE.attentionLine,
    WAREHOUSE.line1,
    `Suite ${suiteCode} · Attn: ${fullName}`,
    `${WAREHOUSE.city}, ${WAREHOUSE.state} ${WAREHOUSE.postalCode}`,
    WAREHOUSE.country,
  ]
}
