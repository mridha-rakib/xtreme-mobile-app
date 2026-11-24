import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AccessDeniedState } from '@/components/ui/access-denied-state';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';

describe('Shared UI Foundation Primitives', () => {
  it('renders Button with correct label and handles disabled state', () => {
    const { rerender } = render(<Button>Action Button</Button>);
    expect(screen.getByRole('button', { name: /action button/i })).toBeDefined();

    rerender(<Button disabled>Action Button</Button>);
    expect(screen.getByRole('button', { name: /action button/i })).toHaveProperty('disabled', true);
  });

  it('renders Input with label, helperText, and error message', () => {
    const { rerender } = render(
      <Input label="Staff Email" placeholder="Enter email" helperText="Operational domain only" />,
    );
    expect(screen.getByLabelText(/staff email/i)).toBeDefined();
    expect(screen.getByText('Operational domain only')).toBeDefined();

    rerender(<Input label="Staff Email" error="Email is required" />);
    expect(screen.getByText('Email is required')).toBeDefined();
  });

  it('renders StatusBadge with correct variant and text', () => {
    render(<StatusBadge label="CONFIRMED" variant="success" />);
    expect(screen.getByText('CONFIRMED')).toBeDefined();
  });

  it('renders DataTable with columns, rows, and empty state', () => {
    interface TestRow {
      id: string;
      title: string;
      status: string;
    }

    const columns = [
      { key: 'title', header: 'Mission' },
      { key: 'status', header: 'Status' },
    ];

    const data: TestRow[] = [
      { id: '1', title: 'Airport Transfer VIP', status: 'IN_PROGRESS' },
      { id: '2', title: 'Diplomatic Convoy', status: 'CONFIRMED' },
    ];

    const { rerender } = render(
      <DataTable columns={columns} data={data} keyExtractor={(row) => row.id} />,
    );

    expect(screen.getByText('Mission')).toBeDefined();
    expect(screen.getByText('Airport Transfer VIP')).toBeDefined();
    expect(screen.getByText('Diplomatic Convoy')).toBeDefined();

    rerender(
      <DataTable
        columns={columns}
        data={[] as TestRow[]}
        keyExtractor={(row) => row.id}
        emptyMessage="Zero operations recorded"
      />,
    );
    expect(screen.getByText('Zero operations recorded')).toBeDefined();
  });

  it('renders AccessDeniedState with governance disclaimer', () => {
    render(<AccessDeniedState moduleName="Finance Ledger" roleName="VENDOR" />);
    expect(screen.getByText(/access denied/i)).toBeDefined();
    expect(screen.getByText(/VENDOR/)).toBeDefined();
    expect(screen.getByText(/No protected module or business data is rendered/)).toBeDefined();
  });
});
