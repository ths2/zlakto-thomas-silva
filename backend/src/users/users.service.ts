import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      username: 'admin',
      password: 'admin123',
      role: 'admin',
    },
    {
      id: 2,
      username: 'viewer',
      password: 'viewer123',
      role: 'viewer',
    },
  ];

  findByUsername(username: string) {
    return this.users.find(
      (user) => user.username === username,
    );
  }
}