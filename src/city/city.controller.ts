import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CityService } from './city.service';
import { CityIdParamDto } from './dto/city-id-param.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { FindAllCitiesQueryDto } from './dto/find-all-cities-query.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  findAll(@Query() query: FindAllCitiesQueryDto) {
    return this.cityService.findAll(query);
  }

  @Get(':id')
  findById(@Param() params: CityIdParamDto) {
    return this.cityService.findById(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: CityIdParamDto,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.update(params.id, updateCityDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() params: CityIdParamDto) {
    return this.cityService.remove(params.id);
  }
}
