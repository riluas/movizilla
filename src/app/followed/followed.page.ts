import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-followed',
  templateUrl: './followed.page.html',
  styleUrls: ['./followed.page.scss'],
})
export class FollowedPage implements OnInit {

  movies = [];
  currentPage = 1;
  imageBaseUrl = environment.images;
  resLikedMovies: any;

  constructor(private dataService: DataService, private loadingController: LoadingController, private router: Router) { }

  ngOnInit() {
    this.dataService.getLikedMovies().subscribe(res => {
      if (res) {
        this.resLikedMovies = res;
      }
      else {
        this.resLikedMovies = false;
      }
      this.loadMovies();
    });

    console.log(this.router.url);
    

  }

  async loadMovies() {
    const loading = await this.loadingController.create({
      message: 'Loading..',
      spinner: 'bubbles',
    })
    if(this.router.url == "/followed"){
      await loading.present();
    }
    this.movies = [];
    if (this.resLikedMovies != false) {
      if (this.resLikedMovies.ids.length > 0) {
        this.resLikedMovies.ids.forEach(movieId => {
          this.dataService.getMovieDetails(movieId).subscribe(res => {

            this.movies.push(res);
            console.log(res);
          });
        });
      }
    }
    loading.dismiss();
  }
}
