import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from 'src/user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: LoginUserDto) {
    const user = await this.userService.create(createUserDto);
    return user;
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
  
      return null;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto.username, loginUserDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: { id: user.id, username: user.username,password: `---Not Visible---` },
    };
  }
}
