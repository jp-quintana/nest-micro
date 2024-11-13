import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');
  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    return this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const total = await this.product.count({ where: { available: true } });
    const totalPages = Math.ceil(total / limit);

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: limit * (page - 1),
        take: limit,
      }),
      meta: {
        total,
        page,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product)
      throw new NotFoundException(`Product with id #${id} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _, ...data } = updateProductDto;
    await this.findOne(id);

    return await this.product.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);

    return await this.product.update({
      where: { id },
      data: { available: false },
    });
  }
}
