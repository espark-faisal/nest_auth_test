import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async create(userDto: LoginUserDto): Promise<User> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userDto.password, saltRounds);

    const user = new User();
    user.username = userDto.username;
    user.password = hashedPassword;
    return this.userRepository.save(user);
  }
}
