// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiKey: '2bc73ba964757bad4fe4dee178c2d602',
  baseUrl: 'https://api.themoviedb.org/3',
  images: 'http://image.tmdb.org/t/p',
  firebase:{
    apiKey: "AIzaSyBFAllgNUoAj9d5t2Kwc8qjkTRdB6KuNiA",
    authDomain: "movizilla-a3b4b.firebaseapp.com",
    projectId: "movizilla-a3b4b",
    storageBucket: "movizilla-a3b4b.appspot.com",
    messagingSenderId: "293580652145",
    appId: "1:293580652145:web:cf938e5b0a27812e48a5d0"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
