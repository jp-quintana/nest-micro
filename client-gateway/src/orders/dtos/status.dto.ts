import { IsEnum } from 'class-validator';
import { OrderStatus, OrderStatusList } from '../enums';

export class StatusDto {
  @IsEnum(OrderStatusList, {
    message: `Possible status values are: ${OrderStatusList}`,
  })
  status: OrderStatus;
}
