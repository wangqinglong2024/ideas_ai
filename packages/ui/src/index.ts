export interface BrandBadgeOptions {
  productName: string;
  environment: string;
}

export function formatBrandBadge(options: BrandBadgeOptions): string {
  return `${options.productName} / ${options.environment}`;
}

export function noop(): void {
  return undefined;
}
