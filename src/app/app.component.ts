import { Component } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';
import { OrderService } from './services/order.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[ PubNubAngular ]
})
export class AppComponent {
  title = 'embasadora';
  pubnub: PubNubAngular;
  channel: string;
  constructor(private orderService:OrderService,
    pubnub: PubNubAngular)
    {
      this.channel = 'chan-2';
      this.pubnub = pubnub;
      pubnub.init({
        publishKey: 'pub-c-3aa96857-7752-4d23-a091-6b77dabab285',
        subscribeKey: 'sub-c-d4386422-0012-11ea-80c9-52f2b2dcd554'
        });
        
        this.pubnub.subscribe({
          channels: [this.channel],
          triggerEvents: ['message']
      });
    }

    ngOnInit()
    {      
      this.pubnub.getMessage(this.channel, function (msg) {
        //console.log("RBPI:", msg);
        let id = msg.message
        console.log("id a actualizar: ", id);
        /* this.orderService.updateOrder(id, "1").subscribe( data => {
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
        }, err => {}); */
      });
    }
}
