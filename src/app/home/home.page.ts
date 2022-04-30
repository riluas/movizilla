import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{

  constructor(private dataService: DataService) {
    this.dataService.getNotes().subscribe(res =>{
     // console.log(res);
    })
   }

   ngOnInit(){
    this.dataService.getTopRatedMovies().subscribe(res =>{
      console.log(res);
    })
   }
}
