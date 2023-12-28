import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { User } from 'src/users/entities/mongodb/user.entity';
import { RequireAuthenticated } from 'src/common/decorators/require-authenticated.decorator';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<User & { token: string }> {
    return this.authService.login(data);
  }

  @Post('change-password')
  @RequireAuthenticated()
  async changePassword(
    @Body() data: ChangePasswordDto,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.authService.changePassword(user, data);
  }

  @Post('/logout')
  @RequireAuthenticated()
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user);
  }
}
