import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

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

  constructor(private dataService: DataService, private loadingController: LoadingController) { }

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

  }

  async loadMovies(event?: InfiniteScrollCustomEvent) {
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
    else {
      console.log("nada");
    }
  }
//Resolver loading more data
  loadMore(event: InfiniteScrollCustomEvent) {
    this.currentPage++;
    this.loadMovies(event);
  }

}
