import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  /** Landing page — shows the feedback submission form */
  @Get('/')
  @Render('feedback')
  feedback() {
    return {};
  }

  /** Explicit /feedback alias for the submission form */
  @Get('/feedback')
  @Render('feedback')
  feedbackPage() {
    return {};
  }

  /** Admin dashboard — protected by AuthMiddleware, requires active session */
  @Get('/admin')
  @Render('admin')
  admin() {
    return {};
  }
}
