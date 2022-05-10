import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
})
export class MovieDetailsPage implements OnInit {

  movie = null;
  likeIcon = false;
  imageBaseUrl = environment.images;
  movieId: string;
  resLikedMovies: any;

  constructor(private route: ActivatedRoute, private dataService: DataService) {
    this.dataService.getLikedMovies().subscribe(res => {
      this.resLikedMovies = res;
      this.movieId = this.route.snapshot.paramMap.get('id');
      this.arrayLiked(this.movieId, false)
    });
  }

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.dataService.getMovieDetails(this.movieId).subscribe((res) => {
      this.movie = res;
    });
  }

  arrayLiked(movieId, delet) {
    
    if(!this.resLikedMovies){
      this.resLikedMovies = [];
    }
    if (this.resLikedMovies.ids) {
      let index = 0;
      this.resLikedMovies.ids.forEach(element => {
        if (element == movieId && delet) {
          this.resLikedMovies.ids.splice(index, 1);
        }
        if (element == movieId) {
          this.likeIcon = true;
        }
        index++;
      });
    }
    else {
      this.resLikedMovies = [];
    }
  }

  liked() {
    if (this.likeIcon) {
      this.arrayLiked(this.movieId, true);
      this.dataService.uploadLiked(this.resLikedMovies.ids ? this.resLikedMovies.ids : this.resLikedMovies, this.movieId, false);
      this.likeIcon = false;
    }
    else {
      this.arrayLiked(this.movieId, false);
      this.dataService.uploadLiked(this.resLikedMovies.ids ? this.resLikedMovies.ids : this.resLikedMovies, this.movieId, true);
      this.likeIcon = true;
    }
  };

}
