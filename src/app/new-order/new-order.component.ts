import { Component, OnInit } from '@angular/core';
import { Order } from "../order";
import { OrderService } from '../services/order.service';
import { PubNubAngular } from 'pubnub-angular2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css'],
  providers: [PubNubAngular]
})
export class NewOrderComponent implements OnInit {

  sizes = ["small", "medium", "big"];
  flavours = ['coke', 'sprite', 'grapete'];
  pubnub: PubNubAngular;
  channel: string;
  channel2: string;
  isLogged: boolean = false;
  isAdmin: boolean = false;
  model = new Order(this.sizes[0], this.flavours[0]);;
  constructor(private orderService:OrderService,
    private route: ActivatedRoute,
    private router: Router,
    pubnub: PubNubAngular) { 
      
      this.channel = 'chan-1';
      this.channel2 = 'chan-2';
      this.pubnub = pubnub;
      
      pubnub.init({
        publishKey: 'pub-c-3aa96857-7752-4d23-a091-6b77dabab285',
        subscribeKey: 'sub-c-d4386422-0012-11ea-80c9-52f2b2dcd554'
        });
        
        this.pubnub.subscribe({
          channels: [this.channel, this.channel2],
          triggerEvents: ['message']
      });

      
    }

  ngOnInit() {
    if (localStorage.getItem("tipoUsuario") != null)
    {
      if(localStorage.getItem("tipoUsuario") == "0")
      {
        this.isLogged = true;
      }
      else if (localStorage.getItem("tipoUsuario") == "1")
      {
        this.isLogged = true;
        this.isAdmin = true;
      }
    }
    else{      
      this.isLogged = false;
      this.router.navigate(["/login"]);
    }
    this.orderService.getOrderTypes().subscribe(data => {
      console.log(data["data"]);
      this.sizes = [];
      data["data"].forEach(element => {
        this.sizes.push(element.size);
      });
      this.model = null;
     this.model = new Order(this.sizes[0], this.flavours[0]);
    }, err => {});
    
    this.orderService.getFlavours().subscribe(data => {
      console.log(data["data"]);
      this.flavours = [];
      data["data"].forEach(element => {
        this.flavours.push(element.flavour);
      });
      this.model = null;
     this.model = new Order(this.sizes[0], this.flavours[0]);
    }, err => {});

    this.orderService.getLastOrder().subscribe(data => {
      let response = data["data"];
      console.log(response);
      if (response.length > 0)
      {
        this.id = response[0].id;
        console.log("last_id: ", this.id);
      }
      else
      {
        this.id = 0;
      }
    }, err => {});

    this.pubnub.getMessage("chan-2", (msg) => {
      console.log("Actualizando orden");
      let id = msg.message
      console.log("id a actualizar: ", id);
      this.orderService.updateOrder(id, "1").subscribe( data => {
        if (data["code"] == "200")
        {
          if(data["changedRows"] == 1)
          {
            console.log("orden actualizada correctamente");
          }
          else
          {
            console.log("no se actualizó el status, se envio mismo dato!");
          }
        }
        else 
        {
          console.log("orden no se pudo actualizar");
        }
      }, err => {});
    });
  }



  submitted = false;

  onSubmit() 
  { 
    this.submitted = true; 
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  id = 0;
  newOrder(form) {
    if (form.value.size == null || form.value.flavour == null)
    {
      alert("Llene los campos requeridos!");
    }
    else 
    {
      if (this.id == 0)
      {
        this.model = new Order(form.value.size, form.value.flavour);
        this.orderService.newOrder(this.model).subscribe( res => {
            console.log("id insertado", res["data"].insertId);
            this.id = res["data"].insertId;
            let parsedRes = res ["data"];
            let jsonAEnviar = '{ "id": "' + res["data"].insertId + '","size": "' + form.value.size + '", "flavour" : "' + form.value.flavour + '"}';
            console.log("lo que voy a enviar", jsonAEnviar);
            this.pubnub.publish({
              channel: this.channel, message: jsonAEnviar
            });
            form.reset();
            
            alert("Orden generada correctamente:");
            /* this.orderService.updateOrder(this.id, "1").subscribe( data => {
              if (data["code"] == "200")
              {
                if(data["changedRows"] == 1)
                {
                  console.log("orden actualizada correctamente");
                }
                else
                {
                  console.log("orden actualizada correctamente!");
                }
              }
              else 
              {
                console.log("orden no se pudo actualizar");
              }
            }, err => {}); */
          }, err => {
            alert(err);
        } );
      }
      else
      {
        this.orderService.getOrderStatus(this.id).subscribe(data => {
          let response = data["data"];
          if (response == null)
          {
            console.log("el id de orden enviado no existe en la base de datos");
          }
          else
          {
            console.log("status", response);
            if (response.status == 0)
            {
              alert ("Aún hay un vaso esperando a ser recogido");
            }
            else
            {
              this.model = new Order(form.value.size, form.value.flavour);
              this.orderService.newOrder(this.model).subscribe( res => {
                console.log(res["data"].insertId);
                this.id = res["data"].insertId;
                let parsedRes = res ["data"];
                let jsonAEnviar = '{ "id": "' + res["data"].insertId + '","size": "' + form.value.size + '", "flavour" : "' + form.value.flavour + '"}';
                console.log("lo que voy a enviar", jsonAEnviar);
                  this.pubnub.publish({
                    channel: this.channel, message: jsonAEnviar
                  });
                  form.reset();
                  
                  alert("Orden generada correctamente:");
                  /* this.orderService.updateOrder(this.id, "1").subscribe( data => {
                    if (data["code"] == "200")
                    {
                      if(data["changedRows"] == 1)
                      {
                        console.log("orden actualizada correctamente");
                      }
                      else
                      {
                        console.log("orden actualizada correctamente");
                      }
                    }
                    else 
                    {
                      console.log("orden no se pudo actualizar");
                    }
                  }, err => {}); */
                }, err => {
                  alert(err);
              } );
            }

          }
        }, err => {
          alert(err);
        });

      }
    }
  }

  
  logOut()
  {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }
}
