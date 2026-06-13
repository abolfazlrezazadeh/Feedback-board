import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class ViewController {
  @Get('/')
  @Render('feedback')
  feedback() {
    return {};
  }

  @Get('/feedback')
  @Render('feedback')
  feedbackPage() {
    return {};
  }

  @Get('/admin')
  @Render('admin')
  admin() {
    return {};
  }
}
