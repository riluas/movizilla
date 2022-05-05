import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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

}
