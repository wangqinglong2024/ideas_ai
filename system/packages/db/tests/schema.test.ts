import { describe, expect, it } from 'vitest';
import { migrationTables } from '../src/index';

describe('foundation schema table coverage', () => {
  it('covers UA and AD base tables', () => {
    expect(migrationTables).toContain('users');
    expect(migrationTables).toContain('user_preferences');
    expect(migrationTables).toContain('admin_users');
    expect(migrationTables).toContain('admin_audit_logs');
  });
});