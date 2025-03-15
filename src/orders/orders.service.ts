import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaClient, OrderStatus } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ChangeOrderStatusDto, PaginationDto } from 'src/common/dto';
import { NATS_SERVICE } from 'src/config/services';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('OrdersService');

  constructor(
    @Inject(NATS_SERVICE) private readonly productsClient: ClientProxy,
  ) {
    super();
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async create(createOrderDto: CreateOrderDto) {
    try {
      const productsIds = createOrderDto.items.map((item) => item.productId);

      const products: any[] = await firstValueFrom(
        this.productsClient.send('validate_products', productsIds),
      );

      const totalAmount = createOrderDto.items.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.productId);

        return acc + product?.price * item.quantity;
      }, 0);

      const totalItems = createOrderDto.items.reduce(
        (acc, item) => acc + item.quantity,
        0,
      );

      const order = await this.order.create({
        data: {
          totalAmount,
          totalItems,
          status: OrderStatus.PENDING,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });

      return {
        ...order,
      };
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { page, limit, status } = paginationDto;
      const totalPages = await this.order.count();
      const lastPage = Math.ceil(totalPages / limit);

      const statusFilter = status ? { status: status } : {};

      return {
        data: await this.order.findMany({
          skip: (page - 1) * limit,
          take: limit,
          where: {
            ...statusFilter,
          },
        }),
        meta: {
          total: totalPages,
          lastPage: lastPage,
          page: page,
        },
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findOne(id: string) {
    const productById = await this.order.findFirst({
      where: {
        id,
      },
    });

    if (!productById) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id #${id} not found`,
      });
    }

    return productById;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { id, status } = changeOrderStatusDto;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: { status: status },
    });
  }
}
