import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateSharedOrderDto, PaySharedOrderDto } from './dto/order.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    private readonly usersService: UsersService,
  ) {}

  async createSharedOrder(requesterId: string, dto: CreateSharedOrderDto) {
    const requester = await this.usersService.getProfileById(requesterId);

    // 4-hour validity window prevents stale vendor pricing
    const expiresAt = new Date(Date.now() + 4 * 60 * 60 * 1000);

    const created = await this.orderModel.create({
      requesterId: new Types.ObjectId(requesterId),
      requesterName: requester.name,
      requesterPhone: requester.phone,
      vendorId: dto.vendorId,
      vendorName: dto.vendorName,
      category: dto.category,
      items: dto.items,
      totalAmount: dto.totalAmount,
      deliveryLocation: dto.deliveryLocation,
      status: 'PENDING_PAYMENT',
      expiresAt,
    });

    return {
      id: created._id.toString(),
      _id: created._id.toString(),
      status: created.status,
      expiresAt: created.expiresAt,
    };
  }

  async getPublicOrder(orderId: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new NotFoundException('Invalid bill link.');
    }

    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('This bill request was not found.');
    }

    // Automatically mark expired if still unpaid past expiresAt
    if (order.status === 'PENDING_PAYMENT' && new Date() > order.expiresAt) {
      order.status = 'EXPIRED';
      await order.save();
    }

    // Mask requester phone (e.g., 0803***4521) for public privacy
    const maskedPhone =
      order.requesterPhone.length >= 7
        ? `${order.requesterPhone.slice(0, 4)}***${order.requesterPhone.slice(-4)}`
        : order.requesterPhone;

    return {
      id: order._id.toString(),
      requesterName: order.requesterName,
      requesterPhoneMasked: maskedPhone,
      vendorName: order.vendorName,
      category: order.category,
      items: order.items,
      totalAmount: order.totalAmount,
      deliveryLocation: order.deliveryLocation,
      status: order.status,
      paymentMethod: order.paymentMethod,
      payerName: order.payerName,
      paidAt: order.paidAt,
      expiresAt: order.expiresAt,
    };
  }

  async settleSharedOrder(
    orderId: string,
    dto: PaySharedOrderDto,
    authenticatedPayerId?: string,
  ) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new NotFoundException('Invalid bill link.');
    }

    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Bill request not found.');

    if (order.status !== 'PENDING_PAYMENT') {
      throw new ConflictException(
        order.status === 'EXPIRED'
          ? 'This bill link has expired. Ask the sender to generate a fresh link.'
          : 'This bill has already been paid!',
      );
    }

    if (new Date() > order.expiresAt) {
      order.status = 'EXPIRED';
      await order.save();
      throw new BadRequestException('This bill link has expired.');
    }

    const paymentRef =
      dto.transferReference?.trim() ||
      `BTN-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // 1. If paying via Paatee Wallet, require logged-in payer & atomically debit balance
    if (dto.paymentMethod === 'PAATEE_WALLET') {
      if (!authenticatedPayerId) {
        throw new BadRequestException(
          'Please sign in to your Buttns account to pay with your Paatee Wallet.',
        );
      }
      await this.usersService.debitPaateeBalance(
        authenticatedPayerId,
        order.totalAmount,
      );
    }

    // 2. Atomic conditional update prevents double-payment race conditions
    const paidOrder = await this.orderModel.findOneAndUpdate(
      { _id: orderId, status: 'PENDING_PAYMENT' },
      {
        $set: {
          status: 'PAID',
          paymentMethod: dto.paymentMethod,
          paymentReference: paymentRef,
          payerName: dto.payerName.trim(),
          payerPhone: dto.payerPhone.replace(/\s+/g, ''),
          payerEmail: dto.payerEmail?.trim().toLowerCase(),
          paidAt: new Date(),
        },
      },
      { new: true },
    );

    if (!paidOrder) {
      throw new ConflictException('This bill was just settled by someone else.');
    }

    // 3. Silently onboard Mjay so she gets her own Buttns account & magic token
    const payerAuth = await this.usersService.findOrCreateFromSharedBill({
      name: dto.payerName,
      phone: dto.payerPhone,
      email: dto.payerEmail,
      location: order.deliveryLocation,
    });

    return {
      message: 'Payment confirmed! Vendor has been notified.',
      receipt: {
        orderId: paidOrder._id.toString(),
        reference: paymentRef,
        amountPaid: paidOrder.totalAmount,
        vendorName: paidOrder.vendorName,
        requesterName: paidOrder.requesterName,
        paidAt: paidOrder.paidAt,
      },
      payerSession: payerAuth,
    };
  }

  async getMyOrders(userId: string) {
    return this.orderModel
      .find({ requesterId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(30);
  }
}