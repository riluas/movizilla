import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import {InfiniteScrollCustomEvent, LoadingController} from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit{
  movies = [];
  currentPage = 1;
  imageBaseUrl = environment.images;

  constructor(private dataService: DataService,private loadingController: LoadingController) {

    this.dataService.getNotes().subscribe(res =>{
     // console.log(res);
    })
   }

   ngOnInit(){
     this.loadMovies();
   }

   async loadMovies(event?: InfiniteScrollCustomEvent){
    const loading = await this.loadingController.create({
      message: 'Loading..',
      spinner: 'bubbles',
    })
    await loading.present();

    this.dataService.getTopRatedMovies(this.currentPage).subscribe(res =>{
      loading.dismiss();
      this.movies.push(...res.results);
      console.log(res);

      event?.target.complete();
      if(event){
        event.target.disabled = res.total_pages === this.currentPage;
      };
    })
   }

   loadMore(event: InfiniteScrollCustomEvent){
    this.currentPage++;
    this.loadMovies(event);
   }
}
