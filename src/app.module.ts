import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { TransportModule } from './transport/transport.module';

@Module({
  imports: [OrdersModule, TransportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
