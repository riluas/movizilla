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
  meGustaIcon = false;
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
    if (this.resLikedMovies.ids) {
      console.log("aaaa");
      
      let index = 0;
      this.resLikedMovies.ids.forEach(element => {
        if (element == movieId && delet) {
          this.resLikedMovies.ids.splice(index, 1);
          console.log(element);
          console.log("///--//");
          console.log(this.resLikedMovies);
          console.log("///***///");
        }
        if (element == movieId) {
          console.log(element);
          this.meGustaIcon = true;
        }
        index++;
      });
    }
    else {
      this.resLikedMovies = [];
    }

  }

  liked() {

    console.log(this.resLikedMovies.ids);
    
    if (this.meGustaIcon) {
      this.arrayLiked(this.movieId, true);
      this.dataService.uploadLiked(this.resLikedMovies.ids ? this.resLikedMovies.ids : this.resLikedMovies, this.movieId, false);
      this.meGustaIcon = false;
    }
    else {
      this.meGustaIcon = true;
      this.arrayLiked(this.movieId, false);
      console.log("else1");
      console.log(this.resLikedMovies.ids);      
      this.dataService.uploadLiked(this.resLikedMovies.ids ? this.resLikedMovies.ids : this.resLikedMovies, this.movieId, true);
      console.log("else2");
      console.log(this.resLikedMovies.ids);
    }
  };

}
