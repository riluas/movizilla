import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
})
export class SingUpPage implements OnInit {
  singUpCredentials: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private dataService: DataService,
    private router: Router
  ) { }

  get email(){
    return this.singUpCredentials.get('email');
  }

  get password(){
    return this.singUpCredentials.get('password');
  }
  
  get name(){
    return this.singUpCredentials.get('name');
  }
  get surname(){
    return this.singUpCredentials.get('surname');
  }

  ngOnInit() {
    this.singUpCredentials = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]]
    });

    
  }

    async register() {
    const loading = await this.loadingController.create();
    await loading.present();
    const user = await this.authService.register(this.singUpCredentials.value);
    await loading.dismiss();

    if(user){
      this.router.navigateByUrl('/home', {replaceUrl: true});
      this.dataService.uploadUserData(this.singUpCredentials.value);
    } else{
      this.showAlert('Registration failed', 'Please try again!');
    }
  };

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  };

}
