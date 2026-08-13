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
import { ZodSerializerDto } from 'nestjs-zod';
import { ApiCreateState } from './decorators/create-state.decorator';
import { ApiFindAllStates } from './decorators/find-all-states.decorator';
import { ApiFindStateByUf } from './decorators/find-state-by-uf.decorator';
import { ApiRemoveState } from './decorators/remove-state.decorator';
import { ApiUpdateState } from './decorators/update-state.decorator';
import { CreateStateDto } from './dto/create-state.dto';
import { FindAllStatesQueryDto } from './dto/find-all-states-query.dto';
import { StateIdParamDto } from './dto/state-id-param.dto';
import {
  FindAllStatesResponseDto,
  StateResponseDto,
} from './dto/state-response.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { StateService } from './state.service';

@ApiTags('State')
@Controller('states')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Get(':uf')
  @ApiFindStateByUf()
  @ZodSerializerDto(StateResponseDto)
  findByUf(@Param('uf') uf: string) {
    return this.stateService.findByUf(uf);
  }

  @Get('')
  @ApiFindAllStates()
  @ZodSerializerDto(FindAllStatesResponseDto)
  findAll(@Query() query: FindAllStatesQueryDto) {
    return this.stateService.findAll(query);
  }

  @Post('')
  @ApiCreateState()
  @ZodSerializerDto(StateResponseDto)
  create(@Body() createStateDto: CreateStateDto) {
    return this.stateService.create(createStateDto);
  }

  @Patch(':id')
  @ApiUpdateState()
  @ZodSerializerDto(StateResponseDto)
  update(
    @Param() params: StateIdParamDto,
    @Body() updateStateDto: UpdateStateDto,
  ) {
    return this.stateService.update(params.id, updateStateDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiRemoveState()
  remove(@Param() params: StateIdParamDto) {
    return this.stateService.remove(params.id);
  }
}
