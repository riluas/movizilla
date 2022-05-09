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
  res: any;
  constructor(private route: ActivatedRoute, private dataService: DataService) { 
    this.dataService.getLikedMovies().subscribe(res => {
      this.res = res;
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);
    this.dataService.getMovieDetails(id).subscribe((res) => {
      console.log(res);
      this.movie = res;
    });
  }

  liked() {
    if (this.meGustaIcon) {
      this.meGustaIcon = false;
    }
    else {
      this.meGustaIcon = true;
      this.dataService.getLikedMovies();
      console.log(this.res);
      this.dataService.uploadLiked();
    }
  };

}
