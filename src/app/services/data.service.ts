import { Injectable } from '@angular/core';
import { collection } from '@firebase/firestore';
import { HttpClient } from '@angular/common/http';
import { empty, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { collectionData, doc, docData, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import {
  getDownloadURL,
  ref,
  Storage,
  uploadString,
} from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';


export interface ApiResult {
  page: number;
  results: any[];
  total_pages: number;
  total_results: number;
}

export interface User {
  id?: string;
  name: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firestore: Firestore,
    private http: HttpClient,
    private auth: Auth,
    private storage: Storage
  ) { }

  getNotes() {
    const notesRef = collection(this.firestore, 'notes');
    return collectionData(notesRef, { idField: 'id' });
  }

  getLikedMovies() {
    const likedDocRef = doc(this.firestore, `users/${this.auth.currentUser.uid}/fav/movieId`);
    return docData(likedDocRef)
  }

  getCommentsLikes(movieId) {
    const likedDocRef = doc(this.firestore, `comments/${movieId}`);
    return docData(likedDocRef)
  }
  //Load the collection of the user
  getUser() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: this.auth.currentUser.uid });
  }

  getUserById(userId): Observable<User> {
    const userDocRef = doc(this.firestore, `users/${userId}`);
    return docData(userDocRef, { idField: 'id' }) as Observable<User>
  }

  getUserData() {
    const logedUser = this.auth.currentUser;
    const email = logedUser.email;
    return email;
  }

  getTopRatedMovies(page = 1): Observable<ApiResult> {
    return this.http.get<ApiResult>(
      `${environment.baseUrl}/movie/popular?api_key=${environment.apiKey}&page=${page}`
    );
  };
  getMovieDetails(id: string) {
    return this.http.get(
      `${environment.baseUrl}/movie/${id}?api_key=${environment.apiKey}`
    );
  }

  //To upload images
  getUserProfile() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return docData(userDocRef, { idField: 'id' });
  }


  async uploadUserData(userData) {
    const name = userData['name'];
    const surname = userData['surname'];
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userDocRef, {
      name,
      surname,
    });
  }

  async uploadImage(cameraFile: Photo, name, surname) {
    const user = this.auth.currentUser;
    const path = `uploads/${user.uid}/profile.png`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, 'base64');

      const imageUrl = await getDownloadURL(storageRef);

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        imageUrl,
        name,
        surname,
      });
      return true;
    } catch (e) {
      return null;
    }
  }


  //Set like or undo like
  async uploadLiked(arrayMovies, movieId, push) {
    const user = this.auth.currentUser;
    try {
      const ids = arrayMovies;
      if (push) {
        ids.push(movieId);
      }
      const userDocRef = doc(this.firestore, `users/${user.uid}/fav/movieId`);
      await setDoc(userDocRef, {
        ids,
      });
      return true;
    } catch (e) {
      return null;
    }
  }

  async like_dislike(movieId, commentLikeArray, like_dislike, toDelete, toUpdate) {
    const userId = this.auth.currentUser.uid;
    let arrayLikes;

    if (commentLikeArray == undefined) {
      arrayLikes = [];
    }
    else {
      if (commentLikeArray.arrayLikes === undefined) {
        arrayLikes = [];
      }
      else {
        arrayLikes = commentLikeArray.arrayLikes;
      }
    }

    if (toDelete) {

      let index = 0;
      arrayLikes.forEach(element => {
        if (element.userId == userId) {
          arrayLikes.splice(index, 1);
          if (toUpdate) {
            arrayLikes.push({ userId: userId, like: like_dislike });
          }
        }
        index++;
      });
    }
    else {
      arrayLikes.push({ userId: userId, like: like_dislike });
    }
    if (commentLikeArray == undefined) {
      const userDocRef = doc(this.firestore, `comments/${movieId}`);
      await setDoc(userDocRef, {
        arrayLikes,
      });
    }
    else {
      const userDocRef = doc(this.firestore, `comments/${movieId}`);
      await updateDoc(userDocRef, {
        arrayLikes,
      });
    }

  }

  async uploadComment(comment, movieId, movieArrayComments) {
    const userId = this.auth.currentUser.uid;
    const usercomment = comment;
    let arrayComments;
    let newArrayComments = [];
    //if there's no collection or the object is undefined, create one
    if (movieArrayComments === undefined) {
      newArrayComments.push({ userId: userId, userComment: usercomment });
      arrayComments = newArrayComments;
    }
    else {
      console.log("eee");
      //check if the movie has any comments
      if (movieArrayComments && (Object.keys(movieArrayComments).length === 0)) {
        newArrayComments.push({ userId: userId, userComment: usercomment });
        arrayComments = newArrayComments;
      }
      //check when the collection is created if the movie has the comments object
      if (movieArrayComments.arrayComments === undefined) {
        newArrayComments.push({ userId: userId, userComment: usercomment });
        arrayComments = newArrayComments;
      }
      else {
        movieArrayComments.arrayComments.push({ userId: userId, userComment: usercomment });
        arrayComments = movieArrayComments.arrayComments;
      }
    }

    if (movieArrayComments === undefined) {
      const userDocRef = doc(this.firestore, `comments/${movieId}`);
      await setDoc(userDocRef, {
        arrayComments,
      });
    }
    else {
      const userDocRef = doc(this.firestore, `comments/${movieId}`);
      await updateDoc(userDocRef, {
        arrayComments,
      });
    }

  }

}
