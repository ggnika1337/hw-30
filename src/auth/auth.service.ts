import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailSenderService } from 'src/email-sender/email-sender.service';
import { VerifyUserDto } from './dtos/verify-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private emailSenderService: EmailSenderService,
  ) {}

  async signUp({ age, email, fullName, gender, password }: SignUpDto) {
    const existUser = await this.usersService.findByEmail(email);

    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword: string = await bcrypt.hash(password, 10);

    // VERIFICATION
    const otpCode = Math.random().toString().slice(2, 8);
    const otpCodeExpirationDate = new Date().setTime(
      new Date().getTime() + 5 * 60 * 1000,
    );

    await this.usersService.createAuthUser({
      email,
      age,
      fullName,
      gender,
      password: hashedPassword,
      OTPCode: otpCode,
      OTPCodeExpirationDate: otpCodeExpirationDate,
    });

    await this.emailSenderService.verifyUser(email, otpCode);

    return {
      success: true,
      message: 'user created successfully',
    };
  }

  async signIn({ password, email }: SignInDto) {
    const existUser = await this.usersService.findByEmail(email, true);

    if (!existUser) {
      throw new BadRequestException('Email or password is invalid');
    }

    const isPassEqual = await bcrypt.compare(password, existUser.password);
    if (!isPassEqual) {
      throw new BadRequestException('Email or password is invalid');
    }

    if (!existUser.isVerified) {
      throw new BadRequestException('User is not verified');
    }

    const payLoad = {
      userId: existUser._id,
    };
    const token = await this.jwtService.sign(payLoad, { expiresIn: '1h' });
    return { token };
  }

  async verifyUser({ OTPCode, email }: VerifyUserDto) {
    const existUser = await this.usersService.findByEmail(email, true);
    if (!existUser) throw new BadRequestException('User not found');

    if (existUser.OTPCode !== OTPCode)
      throw new BadRequestException('OTP Code is invalid');

    if (new Date().getTime() > existUser.OTPCodeExpirationDate!) {
      throw new BadRequestException('OTP Code is outdated');
    }

    await this.usersService.findByIdAndUpdate(existUser._id, {
      OTPCode: null,
      OTPCodeExpirationDate: null,
      isVerified: true,
    });

    const payLoad = {
      userId: existUser._id,
    };
    const token = await this.jwtService.sign(payLoad, { expiresIn: '1h' });
    return { token };
  }

  async getCurrentUser(userId: string) {
    return this.usersService.getUserById(userId);
  }
}
