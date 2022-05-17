import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DataService } from '../services/data.service';
import { Auth } from '@angular/fire/auth';
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
  commentsArray: any;
  comments: FormGroup;
  commentsCard = [];
  userImage = "https://c.tenor.com/lTtlX5xlfmgAAAAC/nyan-cat.gif";
  commentsAvatar = [];
  userName: string;

  constructor(private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private auth: Auth,) {
    this.dataService.getLikedMovies().subscribe(res => {
      this.resLikedMovies = res;
      this.movieId = this.route.snapshot.paramMap.get('id');
      this.arrayLiked(this.movieId, false)
    });
    this.dataService.getUser().subscribe((data) => {
      data.forEach(element => {
        this.commentsAvatar.push({ userId: element[this.auth.currentUser.uid], imageURL: element.imageUrl, userName: element.name});
      });
    });
  }

  get comment() {
    return this.comments.get('comment');
  }

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.dataService.getMovieDetails(this.movieId).subscribe((res) => {
      this.movie = res;
    });
    this.dataService.getComments(this.route.snapshot.paramMap.get('id')).subscribe((res) => {
      this.commentsArray = res;
      if (this.commentsArray) {
        this.commentsCard = [];
        this.commentsArray.arrayComments.forEach(element => {
          this.commentsCard.push({ userId: element.userId, comment: element.userComment });
        });
      } else {
        console.log("Ta basio");
      }
    });
    this.comments = this.formBuilder.group({
      comment: ['', [Validators.minLength(1)]],
    });
  }

  async userComment() {
    this.dataService.uploadComment(this.comments.value["comment"], this.movieId, this.commentsArray);
  };


  //Set like or undo like
  arrayLiked(movieId, delet) {

    if (!this.resLikedMovies) {
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

  //Get the avatar from the userId of the comment
  getCommentUserPhoto(userId) {
    let filtered;
    filtered = this.commentsAvatar.filter((value) => {
      return value.userId == userId;
    });

    if (filtered[0] == undefined) {
      return "https://c.tenor.com/lTtlX5xlfmgAAAAC/nyan-cat.gif";
    }
    else {
      return filtered[0].imageURL;
    }
  }

    //Get the name from the userId of the comment
    getUserName(userId) {
    let filtered;
    filtered = this.commentsAvatar.filter((value) => {
      return value.userId == userId;
    });
    if (filtered[0] == undefined) {
      return "Noname";
    }
    else {
      return filtered[0].userName;
    }
    }
}
