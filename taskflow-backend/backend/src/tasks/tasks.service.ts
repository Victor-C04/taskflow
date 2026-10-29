
import {
  Injectable,
  NotFoundException
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

import type { AuthenticatedUser } from '../auth/types/authenticated-request.js';

@Injectable()
export class TasksService {

  constructor(private readonly prisma: PrismaService) {}

  // ADMIN sees all tasks; MEMBER sees only own tasks
  findAll(user: AuthenticatedUser) {
    return this.prisma.task.findMany({
      where: user.role === 'ADMIN'
        ? {}
        : { ownerId: user.id },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // ADMIN can view any task; MEMBER only own task
  async findOne(id: number, user: AuthenticatedUser) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        ...(user.role === 'ADMIN'
          ? {}
          : { ownerId: user.id })
      }
    });

    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return task;
  }

  // New tasks belong to their creator
  create(dto: CreateTaskDto, userId: number) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        priority: dto.priority,
        assignedTo: dto.assignedTo,
        dueDate: new Date(dto.dueDate),
        ownerId: userId
      }
    });
  }

  // ADMIN can edit any task; MEMBER only own task
  async update(
    id: number,
    dto: UpdateTaskDto,
    user: AuthenticatedUser
  ) {
    const result = await this.prisma.task.updateMany({
      where: {
        id,
        ...(user.role === 'ADMIN'
          ? {}
          : { ownerId: user.id })
      },
      data: {
        ...dto,
        ...(dto.dueDate
          ? { dueDate: new Date(dto.dueDate) }
          : {})
      }
    });

    if (result.count === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return this.findOne(id, user);
  }

  // ADMIN can delete any task; MEMBER only own task
  async remove(id: number, user: AuthenticatedUser) {
    const result = await this.prisma.task.deleteMany({
      where: {
        id,
        ...(user.role === 'ADMIN'
          ? {}
          : { ownerId: user.id })
      }
    });

    if (result.count === 0) {
      throw new NotFoundException(`Task ${id} not found`);
    }

    return {
      message: `Task ${id} deleted successfully`
    };
  }
}
