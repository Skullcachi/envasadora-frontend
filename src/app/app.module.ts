import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PubNubAngular } from 'pubnub-angular2'

const rutas: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'newOrder', component: NewOrderComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NewOrderComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(rutas),
    FormsModule,
    HttpClientModule
  ],
  providers: [ PubNubAngular ],
  bootstrap: [AppComponent]
})
export class AppModule { }
