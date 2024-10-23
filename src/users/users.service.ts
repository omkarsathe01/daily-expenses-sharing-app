import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { EmailDto } from './dto/email.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async createUserByEmail(emailDto: EmailDto): Promise<User> {
    const newUser: DeepPartial<User> = {
      email: emailDto.email,
      isActive: false,
      balance: 0,
      transaction_history: [],
      dues: []
    }

    return await this.usersRepository.save(newUser);
  }

  private async checkIfUserExists(email: string): Promise<boolean> {
    const user =  await this.usersRepository.findOneBy({ email });
    
    if (user) {
      return true;
    } else {
      return false;
    }
  };
  
  async create(createUserDto: CreateUserDto) {
    const user = await this.checkIfUserExists(createUserDto.email);
    
    if (user) {
      throw new UnprocessableEntityException({message: 'User with the same email already exists.'});
    }

    const lastInsertedUser = await this.usersRepository.findOne({
      order: {
        created_at: 'DESC'
      }
    })

    const newUser: DeepPartial<User> = {
      name: createUserDto.name,
      email: createUserDto.email,
      mobile: createUserDto.mobile,
      balance: createUserDto.balance || 0,
      dues: [],
      transaction_history: [],
      isActive: true
    }

    newUser.user_id = (lastInsertedUser?.user_id || 99) + 1;

    const savedUser = await this.usersRepository.save(newUser);

    const response: UserResponseDto = {
      user_id: savedUser.user_id,
      name: savedUser.name,
      email: savedUser.email,
      mobile: savedUser.mobile,
      balance: savedUser.balance,
      dues: savedUser.dues,
      transaction_history: savedUser.transaction_history
    }

    return response;
  }

  async findAll(): Promise<UserResponseDto[]> {
    // const users = await this.usersRepository.find();

    // const userResponses: UserResponseDto[] = users.map((user) => {
    //   const userResponse: UserResponseDto = {
    //     user_id: user.user_id,
    //     name: user.name,
    //     email: user.email,
    //     mobile: user.mobile,
    //     balance: user.balance,
    //     dues: user.dues,
    //     transaction_history: user.transaction_history
    //   }
    //   return userResponse;
    // });

    return await this.usersRepository.find();
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    // if (user?.isActive === false) {
    //   console.log('if')
    //   throw new BadRequestException(`${email} exists but need to activate an account.`);
    // } else {
    //   console.log('else')
    return user;
    // }
  }

  public async findOne(user_id: number) {
    const user = await this.usersRepository.findOneBy({ user_id });

    if(user === null) {
      return { message: 'User does not exists.'}
    }

    const response: UserResponseDto = {
      user_id: user.user_id,
      name: user.name,
      email: user.name,
      mobile: user.mobile,
      balance: user.balance,
      dues: user.dues,
      transaction_history: user.transaction_history
    }

    return response;
  }

  public update(email: string, updateUserDto: any) {
    return this.usersRepository.update({ email }, updateUserDto);
  }

  async remove(emailDto: EmailDto): Promise<DeleteResult> {
    return await this.usersRepository.delete({ email: emailDto.email })
  }
}
