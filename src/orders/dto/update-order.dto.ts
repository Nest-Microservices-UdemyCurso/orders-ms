import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsEnum(OrderStatus, { message: `Possible status values are ${OrderStatus}` })
  @IsOptional()
  status: OrderStatus;
}
