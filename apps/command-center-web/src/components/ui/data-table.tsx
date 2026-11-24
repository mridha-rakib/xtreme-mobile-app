import type React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No records found',
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full rounded-[var(--radius-lg,12px)] border border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)] p-8 text-center">
        <span className="inline-block size-6 animate-spin rounded-full border-2 border-[var(--color-accent-atlantic,#164D53)] border-t-transparent" />
        <p className="mt-2 text-[13px] text-[var(--color-text-secondary,#5B616B)]">
          Loading records...
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full overflow-x-auto rounded-[var(--radius-lg,12px)] border border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-card,#FFFFFF)] shadow-sm',
        className,
      )}
    >
      <table className="w-full text-left border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-[var(--color-border-default,#DDD8CF)] bg-[var(--color-surface-subtle,#EEE9E0)]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={cn(
                  'px-4 py-3 font-semibold text-[var(--color-brand-onyx,#0B0C0E)]',
                  col.align === 'center' && 'text-center',
                  col.align === 'right' && 'text-right',
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[var(--color-text-secondary,#5B616B)]"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-[var(--color-border-default,#DDD8CF)] last:border-b-0 hover:bg-[#FAF8F4] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-3.5 text-[var(--color-text-primary,#0B0C0E)] align-middle',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
