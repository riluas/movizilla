import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {
    this.userImage = "https://c.tenor.com/lTtlX5xlfmgAAAAC/nyan-cat.gif";
    this.currentUser  ="Alfonso";
    this.userSurname = "Lamar Asis";
    this.email = "prueba@prueba.es";
  }

}
