import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ChangeOrderStatusDto, PaginationDto } from 'src/common/dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('find_all_orders')
  findAll( @Payload() paginationDto: PaginationDto ) {
    return this.ordersService.findAll( paginationDto );
  }

  @MessagePattern('find_one_order')
  findOne( @Payload('id', ParseUUIDPipe) id: string ) {
    return this.ordersService.findOne( id );
  }

  @MessagePattern('update_order')
  update( @Payload() changeOrderStatusDto: ChangeOrderStatusDto ) {
    return this.ordersService.changeStatus( changeOrderStatusDto )
  }
}
