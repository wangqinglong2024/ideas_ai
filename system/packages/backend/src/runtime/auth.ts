import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { failure } from './response.js';
import type { RuntimeEnv } from './env.js';
import type { AdminRole } from '@zhiyu/types';

const AdminRoleSchema = z.enum(['admin', 'editor', 'reviewer', 'cs', 'viewer']);
const AuthContextSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email(),
  role: AdminRoleSchema.optional(),
  kind: z.enum(['user', 'admin']),
  sessionId: z.string().optional(),
  tokenUse: z.enum(['access', 'refresh']).optional()
});

export type AuthContext = z.infer<typeof AuthContextSchema>;

declare global {
  namespace Express {
    interface Request { auth?: AuthContext; requestId?: string }
  }
}

export function signToken(env: RuntimeEnv, context: AuthContext, expiresIn: SignOptions['expiresIn'] = '15m') {
  return jwt.sign(context, env.JWT_SECRET, { expiresIn });
}

export function readToken(req: Request, kind?: 'user' | 'admin') {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice('Bearer '.length);
  if (kind === 'admin') return typeof req.cookies?.zy_admin === 'string' ? req.cookies.zy_admin : null;
  if (kind === 'user') return typeof req.cookies?.zy_session === 'string' ? req.cookies.zy_session : null;
  if (typeof req.cookies?.zy_session === 'string') return req.cookies.zy_session;
  if (typeof req.cookies?.zy_admin === 'string') return req.cookies.zy_admin;
  return null;
}

export function requireAuth(env: RuntimeEnv, kind?: 'user' | 'admin') {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = readToken(req, kind);
    if (!token) return failure(res, 401, 'UNAUTHENTICATED', 'Authentication is required');
    try {
      const decoded = AuthContextSchema.parse(jwt.verify(token, env.JWT_SECRET));
      if (decoded.tokenUse === 'refresh') return failure(res, 401, 'INVALID_TOKEN_USE', 'Refresh token cannot access this resource');
      if (kind && decoded.kind !== kind) return failure(res, 403, 'FORBIDDEN', 'Token kind is not allowed');
      req.auth = decoded;
      return next();
    } catch {
      return failure(res, 401, 'INVALID_TOKEN', 'Session token is invalid or expired');
    }
  };
}

const roleRank: Record<AdminRole, number> = { viewer: 1, cs: 2, reviewer: 3, editor: 4, admin: 5 };

export function requireRole(roles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.auth?.role;
    if (!role) return failure(res, 403, 'ROLE_REQUIRED', 'Admin role is required');
    if (roles.includes(role)) return next();
    return failure(res, 403, 'ROLE_FORBIDDEN', 'Role cannot perform this action', { role, allowed: roles });
  };
}

export function atLeast(role: AdminRole) {
  return (req: Request, res: Response, next: NextFunction) => {
    const current = req.auth?.role;
    if (!current) return failure(res, 403, 'ROLE_REQUIRED', 'Admin role is required');
    if (roleRank[current] >= roleRank[role]) return next();
    return failure(res, 403, 'ROLE_FORBIDDEN', 'Role cannot perform this action', { role: current, required: role });
  };
}