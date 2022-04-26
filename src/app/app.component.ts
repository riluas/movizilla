import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/folder/Home', icon: 'home' },
    { title: 'Followed', url: '/folder/Followed', icon: 'heart' },
    { title: 'Profile', url: '/folder/Profile', icon: 'person-circle' },
  ];
  constructor() {}
}
