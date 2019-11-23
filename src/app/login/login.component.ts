import { Component, OnInit } from '@angular/core';
import { User } from "../user";
import { UserServiceService } from '../services/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model = new User('','');
  constructor(private userService:UserServiceService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("tipoUsuario") != null)
    {
      if(localStorage.getItem("tipoUsuario") == "0")
      {
        this.router.navigate(["/newOrder"]);
      }
    }
    
  }

  submitted = false;

  onSubmit() 
  { 
    this.submitted = true; 
  }

  login(form) {
    console.log(form.value.username);
    if (form.value.username == null || form.value.password == null)
    {
      alert("Llene los campos requeridos!");
    }
    else 
    {
      this.model = new User(form.value.username, form.value.password);
      console.log("usuario a enviar: " + this.model)
        this.userService.login(this.model).subscribe( res => {
          if (res["data"] != null)
            console.log("id insertado", res["data"].username);
            console.log("id insertado", res["data"].userType);
            //this.id = res["data"].insertId;
            if (res["data"].userType == 0)
            {
              localStorage.setItem("tipoUsuario", "0");
              this.router.navigate(["/newOrder"]);
            }
            else if (res["data"].userType == 1)
            {
              localStorage.setItem("tipoUsuario", "1");
              this.router.navigate(["/dashboard"]);
            }
            let parsedRes = res ["data"];
            let jsonAEnviar = '{ "id": "' + res["data"].insertId + '","size": "' + form.value.size + '", "flavour" : "' + form.value.flavour + '"}';
            
            
            
          }, err => {
            alert(err);
        } );
    }
  }
}
