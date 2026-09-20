import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

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
    const { otpCode, otpCodeExpirationDate } =
      this.emailSenderService.createVerificationCode();

    await this.usersService.createAuthUser({
      email,
      age,
      fullName,
      gender,
      password: hashedPassword,
      OTPCode: otpCode,
      OTPCodeExpirationDate: otpCodeExpirationDate,
    });

    await this.emailSenderService.sendVerificationCode(email, otpCode);

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
    const token = this.jwtService.sign(payLoad, { expiresIn: '1h' });
    return { token };
  }

  async verifyEmail(email: string, OTPCode: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.OTPCode || !user.OTPCodeExpirationDate) {
      throw new BadRequestException('Invalid verification code');
    }

    if (user.isVerified) {
      throw new BadRequestException('User is already verified');
    }

    if (user.OTPCodeExpirationDate < Date.now()) {
      throw new BadRequestException('Verification code has expired');
    }

    if (user.OTPCode !== OTPCode) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.usersService.markEmailVerified(email);

    const token = this.jwtService.sign(
      { userId: user._id },
      { expiresIn: '1h' },
    );

    return {
      success: true,
      message: 'User verified successfully',
      token,
    };
  }

  async getCurrentUser(userId: string) {
    return this.usersService.getUserById(userId);
  }
}
