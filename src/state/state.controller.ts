import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateStateDto } from './dto/create-state.dto';
import { StateIdParamDto } from './dto/state-id-param.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateService } from './state.service';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get(':uf')
  findOne(@Param('uf') uf: string) {
    return this.stateService.findOne(uf);
  }

  @Get('')
  findAll() {
    return this.stateService.findAll();
  }

  @Post('')
  create(@Body() createStateDto: CreateStateDto) {
    return this.stateService.create(createStateDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto) {
    return this.stateService.update(+id, updateStateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() params: StateIdParamDto) {
    return this.stateService.remove(params.id);
  }
}
