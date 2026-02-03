import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Utilisateur } from '../../modules/utilisateur/entities/utilisateur.entity';

/**
 * CurrentUser decorator fallback for development.
 *
 * Behavior:
 * - If authentication middleware/guard has populated req.user, return it.
 * - Otherwise, read 'x-user-id' header and return a minimal user object { id: number }.
 *
 * This lets controllers accept a `Utilisateur` while you implement auth later.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Partial<Utilisateur> | null => {
    const req = ctx.switchToHttp().getRequest();
    // If some auth guard set req.user, return it directly
    if (req.user) return req.user as Utilisateur;

    // Fallback: read x-user-id header (useful for dev/testing)
    const header = req.headers['x-user-id'] || req.headers['x_user_id'];
    if (!header) return null;
    const id = Array.isArray(header) ? header[0] : header;
    const num = Number(id);
    if (Number.isNaN(num)) return null;
    return { id: num } as Partial<Utilisateur>;
  },
);
