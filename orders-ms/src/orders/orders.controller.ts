import {
  Controller,
  NotImplementedException,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_order')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('find_all_orders')
  findAll() {
    return this.ordersService.findAll();
  }

  @MessagePattern('find_one_order')
  findOne(@Payload('id', ParseIntPipe) id: number) {
    console.log(id);
    return this.ordersService.findOne(id);
  }

  @MessagePattern('change_order_status')
  changeOrderStatus(@Payload() id: number) {
    // return this.ordersService.changeStatus(id);
    throw new NotImplementedException();
  }
}
