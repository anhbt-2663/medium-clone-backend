import { Controller, Get, Param } from "@nestjs/common";
import { ProfileService } from "./profile.service";

@Controller('profile')
export class ProfileController {
  constructor(private readonly profile: ProfileService) {}

  @Get(':username')
  getUserProfile(@Param('username') username: string) {
    return this.profile.getUserProfile(username);
  }

}