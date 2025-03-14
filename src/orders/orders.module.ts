import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TransportModule } from 'src/transport/transport.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [TransportModule],
})
export class OrdersModule {}
