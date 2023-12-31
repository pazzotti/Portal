import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DevagramApiService {

  constructor(protected http: HttpClient, 
    @Inject('LOGIN_URL_API') private loginUrlApi: string ) { }

    public post(url: string,body: any): Promise<any> {
      console.log(body)
      // debugger
      return new Promise((resolve, reject) => {
        this.http.post(
          this.obterUrl(url),
          body
        ).subscribe({
          next: v => resolve(v),
          error: e => reject(e)
        })
      })
    }
    
    public get(url: string): Promise<any> {
      return new Promise((resolve,reject) => {
        this.http.get(
          this.obterUrl(url)
        ).subscribe({
          next: v => resolve(v),
          error: e => reject(e)
        })
      });
    }

  private obterUrl(url: string){
    return `${this.loginUrlApi}/${url}`
  }
}

