import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateSharedOrderDto, PaySharedOrderDto } from './dto/order.dto';
import { JwtAuthGuard } from '../users/jwt-auth.guard';

@Injectable()
class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(_err: any, user: any) {
    return user || null;
  }
}

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Protected: Logged-in resident generates a shareable bill link
  @UseGuards(JwtAuthGuard)
  @Post('share')
  async createShared(@Req() req: any, @Body() dto: CreateSharedOrderDto) {
    return this.ordersService.createSharedOrder(req.user.userId, dto);
  }

  // Protected: Resident views their own orders
  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async getMyOrders(@Req() req: any) {
    return this.ordersService.getMyOrders(req.user.userId);
  }

  // Public: Mjay opens /share/[orderId] to inspect the bill
  @Get('public/:id')
  async getPublicBill(@Param('id') id: string) {
    return this.ordersService.getPublicOrder(id);
  }

  // Public / Optional Auth: Mjay settles the bill via OPay/Transfer or Paatee
  @UseGuards(OptionalJwtAuthGuard)
  @Post('public/:id/pay')
  async payBill(
    @Param('id') id: string,
    @Body() dto: PaySharedOrderDto,
    @Req() req: any,
  ) {
    return this.ordersService.settleSharedOrder(id, dto, req.user?.userId);
  }
}