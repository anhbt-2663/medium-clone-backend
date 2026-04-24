import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JWTAuthGuard } from "src/auth/jwt-auth.guard";
import { User } from "./user.decorator";
import { UserDto } from "./dto/user.dto";

@Controller('user')
@UseGuards(JWTAuthGuard)
export class UserController {
  constructor(private readonly user: UserService) {}

  @Get()
  getCurrentUser(@User('id') id: number) {
    return this.user.getCurrentUser(id);
  }

  @Put()
  updateUser(@User('id') id: number, @Body() user: UserDto) {
    return this.user.updateUser(id, user);
  }
}