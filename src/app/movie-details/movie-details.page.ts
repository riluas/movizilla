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
  favIcon = false;
  disLikeIcon = false;
  likeIcon = false;
  imageBaseUrl = environment.images;
  movieId: string;
  resFavMovies: any;
  commentsArray: any;
  likesArray = [];
  comments: FormGroup;
  commentsCard = [];
  userImage = "https://c.tenor.com/lTtlX5xlfmgAAAAC/nyan-cat.gif";
  commentsAvatar = [];
  userName: string;

  constructor(private route: ActivatedRoute, private dataService: DataService, private formBuilder: FormBuilder, private auth: Auth,) {
    this.dataService.getLikedMovies().subscribe(res => {
      this.resFavMovies = res;
      this.movieId = this.route.snapshot.paramMap.get('id');
      this.arrayFav(this.movieId, false)
    });
    this.dataService.getUser().subscribe((data) => {
      data.forEach(element => {
        this.commentsAvatar.push({ userId: element[this.auth.currentUser.uid], imageURL: element.imageUrl, userName: element.name });
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
    this.dataService.getCommentsLikes(this.route.snapshot.paramMap.get('id')).subscribe((res) => {
      this.commentsArray = res;
      if (this.commentsArray) {
        console.log(this.commentsArray);
        this.commentsCard = [];
        this.commentsArray.arrayComments.forEach(element => {
          this.commentsCard.push({ userId: element.userId, comment: element.userComment });
        });
      }

      if (this.commentsArray.arrayLikes !== undefined) {
        console.log(this.commentsArray.arrayLikes);
        this.commentsArray.arrayLikes.forEach(element => {
          this.likesArray.push({ userId: element.userId, like: element.like });
        });

        //Filter the incoming array of likes and set the color to the like or dislike button if the user has liked or not.
        this.likesArray.filter((value) => {
          if (value.userId == 12345) {
            if (value.like) {
              this.likeIcon = true;
            }
            if (!value.like) {
              this.disLikeIcon = true;
            }
          }

        });

      }
    });
    this.comments = this.formBuilder.group({
      comment: ['', [Validators.minLength(1)]],
    });
  }

  async userComment() {
    this.dataService.uploadComment(this.comments.value["comment"], this.movieId, this.commentsArray);
  };



  async likeDislike(isLike) {

    //Unselect the like if is already liked.
    if (isLike && this.likeIcon) {
      this.dataService.like_dislike(this.likesArray,false, true);
      this.likeIcon = false;
      console.log("1");
      
      return;
    }

    //Unselect the dislike if is already disliked.
    if (!isLike && this.disLikeIcon) {
      this.dataService.like_dislike(this.likesArray,false, true);
      this.disLikeIcon = false;
      console.log("2");
      
      return;
    }

    //Select like if the like button is pressed and it's already disliked.
    if (isLike && !this.likeIcon) {
      this.dataService.like_dislike(this.likesArray,true, false);
      this.disLikeIcon = false;
      this.likeIcon = true;

      console.log("3");

    }
    //Select dislike if the dislike button is pressed and it's already liked.
    if (!isLike && !this.disLikeIcon) {
      this.dataService.like_dislike(this.likesArray,false, false);
      this.disLikeIcon = true;
      this.likeIcon = false;
      
      console.log("4");
    }

    // if (this.disLikeIcon) {
    //   this.disLikeIcon = false;
    // }
    // if (this.likeIcon) {
    //   this.likeIcon = false;
    //   this.dataService.like_dislike(false);
    // }
    // else {
    //   this.likeIcon = true;
    //   this.dataService.like_dislike(true);
    // }
  }

  // dislike() {
  //   if (this.likeIcon) {
  //     this.likeIcon = false;
  //   }
  //   //if not dislike
  //   if (this.disLikeIcon) {
  //     this.disLikeIcon = false;
  //   }
  //   //if dislike
  //   else {
  //     this.disLikeIcon = true;
  //     this.dataService.like_dislike(false);
  //   }
  // }

  //Set fav or undo fav
  arrayFav(movieId, delet) {

    if (!this.resFavMovies) {
      this.resFavMovies = [];
    }
    if (this.resFavMovies.ids) {
      let index = 0;
      this.resFavMovies.ids.forEach(element => {
        if (element == movieId && delet) {
          this.resFavMovies.ids.splice(index, 1);
        }
        if (element == movieId) {
          this.favIcon = true;
        }
        index++;
      });
    }
    else {
      this.resFavMovies = [];
    }
  }

  fav() {
    if (this.favIcon) {
      //Undo like
      this.arrayFav(this.movieId, true);
      this.dataService.uploadLiked(this.resFavMovies.ids ? this.resFavMovies.ids : this.resFavMovies, this.movieId, false);
      this.favIcon = false;
    }
    else {
      //Like
      this.arrayFav(this.movieId, false);
      this.dataService.uploadLiked(this.resFavMovies.ids ? this.resFavMovies.ids : this.resFavMovies, this.movieId, true);
      this.favIcon = true;
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
