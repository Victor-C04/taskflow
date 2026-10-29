
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Module({
  imports: [JwtModule.register({})],
  controllers: [TasksController],
  providers: [TasksService, JwtAuthGuard]
})
export class TasksModule {}
