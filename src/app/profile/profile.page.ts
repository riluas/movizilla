import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
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
  
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.dataService.getUserProfile().subscribe((data) => {
      this.profile = data;
    });
  }

  ngOnInit() {
    this.userImage = "https://c.tenor.com/lTtlX5xlfmgAAAAC/nyan-cat.gif";
    this.currentUser  ="Alfonso";
    this.userSurname = "Lamar Asis";
    this.email = "prueba@prueba.es";
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
      console.log("Entra");
      const loading = await this.loadingController.create();
      await loading.present();
 
      const result = await this.dataService.uploadImage(image);
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
