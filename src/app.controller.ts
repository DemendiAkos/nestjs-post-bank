import { Body, Controller, Get, Post, Redirect, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { NewAccountDto } from './newAccount.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }


  #accounts = [
    {
      id: '1421-4213',
      owner: 'Admin',
      balance: 15000
    },
    {
      id: '2765-4325',
      owner: 'Jane Doe',
      balance: 5000
    },
    {
      id: '2765-4325',
      owner: 'John Doe',
      balance: 10000
    },
    {
      id: '2765-4325',
      owner: 'Michael Doe',
      balance: 5000
    }
  ];


  @Get('newAccount')
  @Render('newAccountForm')
  newAccountForm() {
    return {
      errors: [],
      data: {}
    }
  }


  @Post('newAccount')
  newAccount(
    @Body() accountData: NewAccountDto,
    @Res() response: Response) {

    // Hibaüzenetek tárolása egy tömbben.
    const errors: string[] = [];
    if (!accountData.balance || !accountData.id || !accountData.owner) {
      errors.push('All fields are required');
    } //Regex fun
    if (!/^\d{4}-\d{4}$/.test(accountData.id)) {
      errors.push('Invalid account number');
    }
    const balance = parseInt(accountData.balance);
    if (isNaN(balance)) {
      errors.push('Invalid balance');
    }
    if (balance < 0) {  
      errors.push('Balance must be positive');
    }
    if (accountData.owner.length < 0) {
      errors.push('Owner name must be at least 1 character');
    }
    if(this.#accounts.find(account => account.id === accountData.id)) {
      errors.push('Account number is already in use');
    }


    let newAccount = {
      id: accountData.id,
      owner: accountData.owner,
      balance: parseInt(accountData.balance)
    }

    //Hibaüzenetek megjelenítése
    if (errors.length > 0) {
      response.render('newAccountForm', {
        errors,
        data: accountData
      });
      return;
    }

    this.#accounts.push(newAccount);
    // 303 -> /newAccountSuccess
    response.redirect('/newAccountSuccess');
  }


  @Get('newAccountSuccess')
  @Render('success')
  newAccountSuccess() {
    return {
      accounts: this.#accounts.length
    }
  }

}
