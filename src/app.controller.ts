import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';
import db from './db';
import { MacskakDto } from './macskak.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('list')
  async listmacskak(@Query('szem_szin') szem_szin = '') {
    const [rows] = await db.execute(
      'SELECT id, szem_szin, suly FROM macskak ORDER BY suly DESC',
    );
    const [rows1] = await db.execute(
      'SELECT suly, szem_szin FROM macskak WHERE szem_szin = ?',
      [szem_szin],
    );
    if (szem_szin == '') {
      return { macskak: rows };
    } else {
      return { macskak: rows1 };
    }
  }

  @Get('macskak/new')
  @Render('form')
  newMacskakForm() {
    return {};
  }

  @Post('macskak/new')
  @Redirect()
  async newMacskak(@Body() macskak: MacskakDto) {
    const [result]: any = await db.execute(
      'INSERT INTO macskak (szem_szin, suly) VALUES (?, ?)',
      [macskak.szem_szin, macskak.suly],
    );
    return {
      url: '/macskak/' + result.insertId,
    };
  }

  @Get('macskak/:id')
  @Render('show')
  async showMacskak(@Param('id') id: number) {
    const [rows] = await db.execute(
      'SELECT id, szem_szin, suly FROM macskak WHERE id = ?',
      [id],
    );
    return { macskak: rows[0] };
  }

  @Post('macskak/:id/delete')
  @Render('')
  async deleteMacskak(@Param('id') id: number) {
    const [rows] = await db.execute('DELETE FROM macskak WHERE id = ?', [id]);
    return {
      url: '/',
    };
  }
}
