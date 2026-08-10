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
import { CreateStateDto } from './dto/create-state.dto';
import { FindAllStatesQueryDto } from './dto/find-all-states-query.dto';
import { StateIdParamDto } from './dto/state-id-param.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateService } from './state.service';

@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get(':uf')
  findByUf(@Param('uf') uf: string) {
    return this.stateService.findByUf(uf);
  }

  @Get('')
  findAll(@Query() query: FindAllStatesQueryDto) {
    return this.stateService.findAll(query);
  }

  @Post('')
  create(@Body() createStateDto: CreateStateDto) {
    return this.stateService.create(createStateDto);
  }

  @Patch(':id')
  update(
    @Param() params: StateIdParamDto,
    @Body() updateStateDto: UpdateStateDto,
  ) {
    return this.stateService.update(params.id, updateStateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() params: StateIdParamDto) {
    return this.stateService.remove(params.id);
  }
}
