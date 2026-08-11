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
import { ApiTags } from '@nestjs/swagger';
import { CityService } from './city.service';
import { ApiCreateCity } from './decorators/create-city.decorator';
import { ApiFindAllCities } from './decorators/find-all-cities.decorator';
import { ApiFindCityById } from './decorators/find-city-by-id.decorator';
import { ApiRemoveCity } from './decorators/remove-city.decorator';
import { ApiUpdateCity } from './decorators/update-city.decorator';
import { CityIdParamDto } from './dto/city-id-param.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { FindAllCitiesQueryDto } from './dto/find-all-cities-query.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@ApiTags('City')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @ApiCreateCity()
  create(@Body() createCityDto: CreateCityDto) {
    return this.cityService.create(createCityDto);
  }

  @Get()
  @ApiFindAllCities()
  findAll(@Query() query: FindAllCitiesQueryDto) {
    return this.cityService.findAll(query);
  }

  @Get(':id')
  @ApiFindCityById()
  findById(@Param() params: CityIdParamDto) {
    return this.cityService.findById(params.id);
  }

  @Patch(':id')
  @ApiUpdateCity()
  update(
    @Param() params: CityIdParamDto,
    @Body() updateCityDto: UpdateCityDto,
  ) {
    return this.cityService.update(params.id, updateCityDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiRemoveCity()
  remove(@Param() params: CityIdParamDto) {
    return this.cityService.remove(params.id);
  }
}
