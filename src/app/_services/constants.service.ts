import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  readonly baseAppUrl: string = 'http://172.16.3.35:3000/';
  readonly codigoApp: string = 'GBW';
  readonly pageSize: Array<number> = [5, 10, 20, 30, 50, 100];
  readonly urlFielWeb: string = 'https://www.fielweb.com/cuenta/login.aspx?tk=';
  readonly token: string = 'CEE1C1EB-FC71-4ADC-BC10-4184A35E868F';
  pageSizeDefault: number = this.pageSize[0];
  constructor() { }
}
