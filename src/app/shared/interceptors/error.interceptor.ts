// import { HttpInterceptorFn } from '@angular/common/http';
// import { ToastrService } from 'ngx-toastr';
// import { inject } from '@angular/core';
// import { catchError, throwError } from 'rxjs';

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   const toastr = inject(ToastrService);

//   return next(req).pipe(
//     catchError((error) => {
//       let errorMessage = 'An unknown error occurred. Please try again later.';

//       if (error.error instanceof ErrorEvent) {
//         // Client-side error
//         errorMessage = `Client-side error: ${error.error.message}`;
//       } else {
//         // Server-side error
//         switch (error.status) {
//           case 0:
//             errorMessage = 'The server is unavailable. Please check your connection.';
//             break;
//           case 400:
//             errorMessage = 'Bad request.';
//             break;
//           case 401:
//             errorMessage = 'Unauthorized request.';
//             break;
//           case 403:
//             errorMessage = 'Access denied.';
//             break;
//           case 404:
//             errorMessage = 'Page not found.';
//             break;
//           case 500:
//             errorMessage = 'Server error. Please try again later.';
//             break;
//         }
//       }

//       toastr.error(errorMessage, 'Error', { timeOut: 3000 });
//       return throwError(() => error); // Do not wrap in Error to preserve full info
//     })
//   );
// };
