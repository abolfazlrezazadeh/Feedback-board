import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/** Redirect unauthenticated users to /login; allow authenticated requests through */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.session?.user) {
      next();
    } else {
      res.redirect('/login');
    }
  }
}
