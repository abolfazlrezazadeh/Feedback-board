import {
  Controller,
  Get,
  Post,
  Render,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Controller()
export class AuthController {
  constructor(private configService: ConfigService) {}

  /** Render the login page */
  @Get('/login')
  @Render('login')
  loginPage() {
    return {};
  }

  /**
   * Authenticate admin credentials against env-configurable values.
   * On success, stores user in session and redirects to /admin.
   * On failure, re-renders login with an error message.
   */
  @Post('/login')
  login(
    @Body() body: { username: string; password: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');

    if (
      body.username === adminUsername &&
      body.password === adminPassword
    ) {
      req.session.user = { username: body.username };
      return res.redirect('/admin');
    }

    return res.render('login', { error: 'Invalid username or password' });
  }

  /** Destroy the session and redirect to login */
  @Post('/logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  }
}
