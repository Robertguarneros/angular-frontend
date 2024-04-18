import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormsModule, ReactiveFormsModule,FormControl, FormGroup,Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  token: string | null = null;
  loggedIn: boolean = false;

  constructor( public userService: UserService, public authService: AuthService)
{
  
}

loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required])
});

ngOnInit():void{
  this.token = this.authService.getToken();
  console.log('token'+this.token);
  if(this.token){
    this.loggedIn = true;
  }
}

login(){
  if (this.loginForm.value.email && this.loginForm.value.password) {
    console.log('email'+this.loginForm.value.email);
    console.log('password'+this.loginForm.value.password);

    this.userService.loginUser(this.loginForm.value.email, this.loginForm.value.password).subscribe((data) => {
      console.log(data);
      this.authService.setToken(data.token);
      this.authService.setUserId(data._id);
      this.authService.setUserName(data.first_name);
      this.loggedIn = true;
    });
  }
}

logout(){
  this.authService.logout();
  this.loggedIn = false;
}

}
