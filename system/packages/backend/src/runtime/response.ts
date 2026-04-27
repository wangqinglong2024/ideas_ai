import type { Response } from 'express';
import type { ApiError, ApiResponse } from '@zhiyu/types';

export function ok<T>(res: Response, data: T, meta: Record<string, unknown> | null = null) {
  const body: ApiResponse<T> = { data, meta, error: null };
  return res.json(body);
}

export function created<T>(res: Response, data: T, meta: Record<string, unknown> | null = null) {
  const body: ApiResponse<T> = { data, meta, error: null };
  return res.status(201).json(body);
}

export function failure(res: Response, status: number, code: string, message: string, details?: Record<string, unknown>) {
  const error: ApiError = { code, message, ...(details ? { details } : {}) };
  const body: ApiResponse<never> = { data: null, meta: null, error };
  return res.status(status).json(body);
}

export function pageMeta(page: number, limit: number, total: number) {
  return { page, limit, total, hasNext: page * limit < total };
}