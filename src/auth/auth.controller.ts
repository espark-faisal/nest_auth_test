import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginUserDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signUp(@Body() createUserDto: LoginUserDto) {
    const existingUser = await this.userService.findByUsername(createUserDto.username);

    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const user = await this.authService.signUp(createUserDto);
    return { id: user.id, username: user.username };
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.authService.login({username:loginUserDto.username, password:loginUserDto.password});

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    return user;
  }
}
