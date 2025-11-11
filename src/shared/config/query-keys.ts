export const QK = {
  dashboard: () => ['dashboard'] as const,
  docs: (f: object) => ['docs', 'list', f] as const,
  docDetail: (id: string) => ['docs', 'detail', id] as const,
};
