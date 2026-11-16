import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import { User, UserDocument } from './schemas/user.schema';
import { OnboardUserDto } from './dto/onboard-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // Format user response cleanly for the Next.js frontend
  private formatUserResponse(user: UserDocument) {
    const formattedBalance = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
    }).format(user.paateeBalance || 0);

    return {
      id: user._id.toString(),
      _id: user._id.toString(),
      name: user.name,
      phone: user.phone,
      email: user.email,
      location: user.location,
      paateeBalance: user.paateeBalance || 0,
      walletBalance: formattedBalance, // Matches Next.js AuthContext shape
      magicLoginToken: user.magicLoginToken,
    };
  }

  // 1. Onboard Chigozie (or update if returning resident)
  async onboardResident(dto: OnboardUserDto) {
    const normalizedPhone = dto.phone.replace(/\s+/g, '');
    const normalizedEmail = dto.email.toLowerCase().trim();

    let existing = await this.userModel.findOne({
      $or: [{ phone: normalizedPhone }, { email: normalizedEmail }],
    });

    if (existing) {
      // Update location & name smoothly if re-onboarding
      existing.name = dto.name || existing.name;
      if (dto.location) existing.location = dto.location;
      await existing.save();
      return this.formatUserResponse(existing);
    }

    const magicLoginToken = crypto.randomBytes(20).toString('hex');

    try {
      const created = await this.userModel.create({
        name: dto.name.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        location: dto.location?.trim() || 'Igando, Lagos',
        paateeBalance: 0,
        magicLoginToken,
      });

      return this.formatUserResponse(created);
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException(
          'Phone number or email is already registered.',
        );
      }
      throw error;
    }
  }

  // 2. Quick Sign-In via WhatsApp Phone or Email
  async quickLogin(identifier: string) {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/\s+/g, '');

    const user = await this.userModel.findOne({
      $or: [{ email: cleanId }, { phone: cleanPhone }],
    });

    if (!user) {
      throw new NotFoundException(
        'No resident account found with that phone or email. Please tap "New Resident" to join.',
      );
    }

    return this.formatUserResponse(user);
  }

  // 3. Auto-Register Payer (Mjay) during Shared Bill Checkout
  async findOrCreateFromSharedBill(data: {
    name: string;
    phone: string;
    email: string;
    location?: string;
  }) {
    const normalizedPhone = data.phone.replace(/\s+/g, '');
    const normalizedEmail = data.email.toLowerCase().trim();

    let user = await this.userModel.findOne({
      $or: [{ phone: normalizedPhone }, { email: normalizedEmail }],
    });

    if (!user) {
      user = await this.userModel.create({
        name: data.name.trim(),
        phone: normalizedPhone,
        email: normalizedEmail,
        location: data.location || 'Igando, Lagos',
        paateeBalance: 0,
        magicLoginToken: crypto.randomBytes(20).toString('hex'),
      });
    } else if (!user.magicLoginToken) {
      user.magicLoginToken = crypto.randomBytes(20).toString('hex');
      await user.save();
    }

    return this.formatUserResponse(user);
  }

  // 4. Magic Link Verification (When Mjay clicks her WhatsApp/Email link)
  async loginWithMagicToken(token: string) {
    const user = await this.userModel.findOne({ magicLoginToken: token });
    if (!user) {
      throw new NotFoundException('Invalid or expired sign-in link.');
    }
    return this.formatUserResponse(user);
  }

  // 5. Credit or Debit Paatee Wallet (Used for FirstBank topups & orders)
  async adjustPaateeBalance(userId: string, deltaAmount: number) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $inc: { paateeBalance: deltaAmount } },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');
    return this.formatUserResponse(user);
  }
}