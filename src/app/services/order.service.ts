import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Order } from '../order';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
const apiURL = 'http://http://ec2-18-219-165-244.us-east-2.compute.amazonaws.com:3000/api/';
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': '*',
    'Accept':  'application/json',
    'Content-Type': 'application/json',
  })
};
@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }

  getOrders(){
    return this.http.get(apiURL + "getOrders", httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getFlavours(){
    return this.http.get(apiURL + "getFlavours", httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrderTypes(){
    return this.http.get(apiURL + "getOrderTypes", httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrderStatus(id){
    return this.http.get(apiURL + "getOrderStatus/" + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLastOrder(){
    return this.http.get(apiURL + "getLastOrder/", httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  newOrder(order: Order) {
    console.log(order);
    return this.http.post(apiURL + "newOrder", order, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateOrder(id, status)
  {
    return this.http.post(apiURL + "updateOrder", {"id": id, "status": status}, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) 
	{
		console.log(error);
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error(
			`Backend returned code ${error.status}, ` +
			`body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		/* return throwError('Something bad happened; please try again later.'); */
		return throwError(error.error.error);
	};

}
