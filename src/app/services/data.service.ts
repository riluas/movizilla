import { Injectable } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private firestore:Firestore, private http: HttpClient) { }

  getNotes(){
    const notesRef = collection(this.firestore, 'notes');
    return collectionData(notesRef, {idField: 'id'});
  }

  getTopRatedMovies(): Observable <Object> {
    return this.http.get(`${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}`);
  };
  getMovieDetails() {}
}
