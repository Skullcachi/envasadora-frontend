import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { User } from '../user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
const apiURL = 'http://ec2-18-222-171-178.us-east-2.compute.amazonaws.com:3000/api/';
/* const apiURL = 'http://localhost:3000/api/'; */
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
@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private http: HttpClient) { }

  login(user: User) {
    console.log(user);
    return this.http.post(apiURL + "login", user, httpOptions)
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
