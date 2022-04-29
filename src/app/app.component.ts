import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Followed', url: '/followed', icon: 'heart' },
    { title: 'Profile', url: '/profile', icon: 'person-circle' },
  ];
  constructor() {}
}
