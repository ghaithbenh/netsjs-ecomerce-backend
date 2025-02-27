import { Body, Controller,Get,Post,Patch,Param, Delete, UseGuards } from '@nestjs/common';
import { ProductService } from '../product.service';
import { ProductDocument } from './schema/product.Schema';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
    constructor(private productService:ProductService){}

    @Post()
    async createPost(@Body('name') name:string,@Body('price')price:number,@Body('description')description:string):Promise<ProductDocument>{
        return this.productService.create(name,price,description)

    }
    
@Get()
findAllProducts():Promise<ProductDocument[]>{
    return this.productService.findAll()
}

@Get(':id')
findProduct(@Param('id')id:string):Promise<ProductDocument>{
    return this.productService.find(id)
}
@Patch(':id')
updateProduct(@Param('id')id:string,@Body('name') name:string,@Body('price')price:number,@Body('description')description:string):Promise<ProductDocument>{
    return this.productService.update(id,name,price,description)
}
@Delete(':id')
deleteProduct(@Param('id')id:string){
    return this.productService.delete(id)
}
}