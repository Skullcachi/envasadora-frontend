import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  ordenes:any = [];
  
  constructor(private orderService:OrderService) { }

  ngOnInit() {
    this.orderService.getOrders().subscribe(data => {
      this.ordenes = data["data"];
      console.log(this.ordenes);

    },err => {
      console.error(err);
    })
  }

}
