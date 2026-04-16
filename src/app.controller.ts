import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import SWAGGER_CONFIG from './constants/swagger';

@ApiTags('General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: SWAGGER_CONFIG.HELLO_API_TITLE })
  @ApiResponse({ status: 200, description:  SWAGGER_CONFIG.HELLO_API_DESCRIPTION  })
  getHello(): string {
    return this.appService.getHello();
  }
}
