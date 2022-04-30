import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{
  movies = [];
  currentPage = 1;

  constructor(private dataService: DataService,private loadingController: LoadingController) {

    this.dataService.getNotes().subscribe(res =>{
     // console.log(res);
    })
   }

   ngOnInit(){
     this.loadMovies();
   }

   async loadMovies(){
    const loading = await this.loadingController.create({
      message: 'Loading..',
      spinner: 'bubbles',
    })
    await loading.present();

    this.dataService.getTopRatedMovies().subscribe(res =>{
      loading.dismiss();
      this.movies = [...this.movies, ...res.results];
      console.log(res);
    })
   }
}
