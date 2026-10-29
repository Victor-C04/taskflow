
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsString()
  description!: string;

  @IsIn(['To Do', 'In Progress', 'In Review', 'Completed'])
  status!: string;

  @IsIn(['Low', 'Medium', 'High'])
  priority!: string;

  @IsString()
  @IsNotEmpty()
  assignedTo!: string;

  @IsDateString()
  dueDate!: string;
}
