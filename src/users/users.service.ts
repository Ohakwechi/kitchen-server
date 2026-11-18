import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { OnboardUserDto, LoginUserDto } from './dto/onboard-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  private buildAuthResponse(user: UserDocument) {
    const formattedBalance = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(user.paateeBalance || 0);

    const payload = {
      sub: user._id.toString(),
      phone: user.phone,
      role: user.role || 'resident',
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        phone: user.phone,
        email: user.email,
        location: user.location,
        paateeBalance: user.paateeBalance || 0,
        walletBalance: formattedBalance,
      },
    };
  }

  async onboardResident(dto: OnboardUserDto) {
    const normalizedPhone = dto.phone.replace(/\s+/g, '');
    const normalizedEmail = dto.email.toLowerCase().trim();

    const existing = await this.userModel.findOne({
      $or: [{ phone: normalizedPhone }, { email: normalizedEmail }],
    });

    if (existing) {
      throw new ConflictException(
        'An account with this phone or email already exists. Switch to Sign In and enter your 4-digit PIN.',
      );
    }

    const pinHash = await bcrypt.hash(dto.pin, 10);
    const magicLoginToken = crypto.randomBytes(20).toString('hex');

    const created = await this.userModel.create({
      name: dto.name.trim(),
      phone: normalizedPhone,
      email: normalizedEmail,
      location: dto.location?.trim() || 'Igando, Lagos',
      pinHash,
      paateeBalance: 0,
      magicLoginToken,
    });

    return this.buildAuthResponse(created);
  }

  async loginWithPin(dto: LoginUserDto) {
    const cleanId = dto.identifier.trim().toLowerCase();
    const cleanPhone = dto.identifier.replace(/\s+/g, '');

    const user = await this.userModel
      .findOne({ $or: [{ email: cleanId }, { phone: cleanPhone }] })
      .select('+pinHash');

    if (!user) {
      throw new NotFoundException(
        'No resident account found. Tap "New Resident" to join your estate.',
      );
    }

    // Backwards-compatibility: if an old test account had no PIN yet, set it now
    if (!user.pinHash) {
      user.pinHash = await bcrypt.hash(dto.pin, 10);
      await user.save();
      return this.buildAuthResponse(user);
    }

    const isPinValid = await bcrypt.compare(dto.pin, user.pinHash);
    if (!isPinValid) {
      throw new UnauthorizedException('Incorrect 4-digit PIN. Please try again.');
    }

    return this.buildAuthResponse(user);
  }

  async getProfileById(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found.');
    return this.buildAuthResponse(user).user;
  }

  async loginWithMagicToken(token: string) {
    const user = await this.userModel.findOne({ magicLoginToken: token });
    if (!user) throw new NotFoundException('Invalid or expired sign-in link.');
    return this.buildAuthResponse(user);
  }

  // Atomic debit so Paatee balance can never go negative
  async debitPaateeBalance(userId: string, amount: number) {
    if (amount <= 0) throw new BadRequestException('Invalid amount');
    const updated = await this.userModel.findOneAndUpdate(
      { _id: userId, paateeBalance: { $gte: amount } },
      { $inc: { paateeBalance: -amount } },
      { new: true },
    );
    if (!updated) {
      throw new BadRequestException('Insufficient Paatee wallet balance.');
    }
    return updated;
  }

  // READ ALL (Admin only)
  async findAllUsers() {
    const users = await this.userModel.find().sort({ createdAt: -1 });
    return users.map((u) => this.buildAuthResponse(u).user);
  }

  // UPDATE (Resident updates own name/location, or Admin updates any user)
  async updateUser(userId: string, updates: { name?: string; location?: string }) {
    const allowed: Partial<User> = {};
    if (updates.name?.trim()) allowed.name = updates.name.trim();
    if (updates.location?.trim()) allowed.location = updates.location.trim();

    const updated = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: allowed },
      { new: true },
    );
    if (!updated) throw new NotFoundException('User not found.');
    return this.buildAuthResponse(updated).user;
  }

  // DELETE (Admin only)
  async deleteUser(userId: string) {
    const deleted = await this.userModel.findByIdAndDelete(userId);
    if (!deleted) throw new NotFoundException('User not found.');
    return { deleted: true, id: userId };
  }

  // Silent viral onboarding when a guest settles someone's shared bill
  async findOrCreateFromSharedBill(data: {
    name: string;
    phone: string;
    email?: string;
    location?: string;
  }) {
    const normalizedPhone = data.phone.replace(/\s+/g, '');
    const normalizedEmail = (
      data.email?.trim() || `${normalizedPhone}@guest.pushtechbuttons.com`
    ).toLowerCase();

    let user = await this.userModel.findOne({
      $or: [{ phone: normalizedPhone }, { email: normalizedEmail }],
    });

    if (!user) {
      const tempPinHash = await bcrypt.hash(crypto.randomBytes(6).toString('hex'), 10);
      const magicLoginToken = crypto.randomBytes(20).toString('hex');

      user = await this.userModel.create({
        name: data.name.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        location: data.location || 'Igando, Lagos',
        pinHash: tempPinHash,
        paateeBalance: 0,
        magicLoginToken,
      });
    }

    return this.buildAuthResponse(user);
  }
}