import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  comments: FormGroup;

  constructor(private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder,) {
    this.dataService.getLikedMovies().subscribe(res => {
      this.resLikedMovies = res;
      this.movieId = this.route.snapshot.paramMap.get('id');
      this.arrayLiked(this.movieId, false)
    });
  }

  get comment(){
    return this.comments.get('comment');
  }

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.dataService.getMovieDetails(this.movieId).subscribe((res) => {
      this.movie = res;
    });
    this.comments = this.formBuilder.group({
      comment: ['', [Validators.minLength(1)]],
    });
  }


  async userComment() {
    this.dataService.uploadComment(this.comments.value["comment"],this.movieId)
  };

  
  //Set like or undo like
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
      //Undo like
      this.arrayLiked(this.movieId, true);
      this.dataService.uploadLiked(this.resLikedMovies.ids ? this.resLikedMovies.ids : this.resLikedMovies, this.movieId, false);
      this.likeIcon = false;
    }
    else {
       //Like
      this.arrayLiked(this.movieId, false);
      this.dataService.uploadLiked(this.resLikedMovies.ids ? this.resLikedMovies.ids : this.resLikedMovies, this.movieId, true);
      this.likeIcon = true;
    }
  };

}
