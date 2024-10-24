import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  makeCounterProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PrometheusModule.register({ path: '/metrics' }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    makeCounterProvider({
      name: 'get_users_calls',
      help: 'Total number of create user calls',
    }),
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
