import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { Auth } from '@angular/fire/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userImage: string;
  currentUser: string;
  userSurname: string;
  email: string;
  profile = null;
  userName: string;
  userLastName:string;
  
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private auth: Auth,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.dataService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
    this.dataService.getUserById().subscribe(res => {
      this.userName = res["name"];
      this.userLastName = res["surname"];
    });
  }

  ngOnInit() {
    
    
    this.userImage = "https://c.tenor.com/lTtlX5xlfmgAAAAC/nyan-cat.gif";
    this.email = this.dataService.getUserData();
  }

  async logout(){
    await this.authService.logout();
    this.router.navigateByUrl('/',{replaceUrl: true }); 
  };
  
  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt!
    });
 
    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.dataService.uploadImage(image, this.userName, this.userLastName);
      loading.dismiss();
 
      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

}
