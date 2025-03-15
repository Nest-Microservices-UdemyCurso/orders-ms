import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from 'src/config/envs';
import { NATS_SERVICE } from 'src/config/services';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER || 'nats://nats-server:4222'], // Esto es para desplegar
          // servers: envs.natsServers // Para local
        },
      },
    ]),
  ],
  exports: [
    ClientsModule.register([
      {
        name: NATS_SERVICE,
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_SERVER || 'nats://nats-server:4222'], // Esto es para desplegar
          // servers: envs.natsServers
        },
      },
    ]),
  ],
})
export class TransportModule {}
