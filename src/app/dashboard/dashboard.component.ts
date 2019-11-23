import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isLogged: boolean = false;
  ordenes:any = [];
  flavours:any = [];
  
  constructor(private orderService:OrderService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    
    if (localStorage.getItem("tipoUsuario") != null)
    {
      if(localStorage.getItem("tipoUsuario") == "0")
      {
        this.router.navigate(["/newOrder"]);
      }
      else if(localStorage.getItem("tipoUsuario") == "1")
      {
        this.isLogged = true;
        this.orderService.getOrders().subscribe(data => {
          this.ordenes = data["data"];
          console.log(this.ordenes);
    
        },err => {
          console.error(err);
        })
        this.orderService.getFlavours().subscribe(data => {
          this.flavours = data["data"];
          console.log(this.flavours);
    
        },err => {
          console.error(err);
        })
      }
    }
    else{
      this.isLogged = false;
      this.router.navigate(["/login"]);
    }
  }

  logOut()
  {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

}
