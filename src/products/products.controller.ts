import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { isEmailProvided } from 'src/guards/is-email-provided.guard';
import { IsAuthGuard } from 'src/guards/isAuth.guard';
import { UserId } from 'src/users/decorators/user.decorator';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 25, ttl: 60000 } })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'New product created successfully' })
  @Post()
  @UseGuards(IsAuthGuard)
  create(@Body() createProductDto: CreateProductDto, @UserId() userId: string) {
    return this.productsService.create(createProductDto, userId);
  }

  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Got all products' })
  @Get()
  @UseGuards(isEmailProvided)
  findAll(@Req() req) {
    return this.productsService.findAll(req.hasDiscount);
  }

  @ApiOperation({ summary: 'Upload image to aws s3' })
  @ApiResponse({ status: 201, description: 'Image created' })
  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.productsService.uploadImage(file);
  }

  @ApiOperation({ summary: 'Upload many images to aws s3' })
  @ApiResponse({ status: 201, description: 'Images created' })
  @Post('upload-many')
  @UseInterceptors(FilesInterceptor('images'))
  uploadMany(@UploadedFiles() files: Array<Express.Multer.File>) {
    return this.productsService.uploadMany(files);
  }

  @ApiOperation({ summary: 'Find specific product' })
  @ApiResponse({ status: 201, description: 'Product found' })
  @Get(':id')
  @UseGuards(isEmailProvided)
  findOne(@Param('id') id: string, @Req() req) {
    return this.productsService.findOne(+id, req.hasDiscount);
  }

  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({ status: 201, description: 'Product updated successfully' })
  @Patch(':id')
  @UseGuards(IsAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UserId() userId: string,
  ) {
    return this.productsService.update(+id, updateProductDto, userId);
  }

  @ApiOperation({ summary: 'Delete specific product' })
  @ApiResponse({ status: 201, description: 'Product deleted successfully' })
  @Delete(':id')
  @UseGuards(IsAuthGuard)
  remove(@Param('id') id: string, @UserId() userId: string) {
    return this.productsService.remove(+id, userId);
  }
}
