import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  readonly baseAppUrl: string = 'http://172.16.3.35:3000/';
  readonly codigoApp: string = 'GBW';
  readonly pageSize: Array<number> = [5, 10, 20, 30, 50, 100];
  pageSizeDefault: number =  this.pageSize[0];
  constructor() { }
}
 