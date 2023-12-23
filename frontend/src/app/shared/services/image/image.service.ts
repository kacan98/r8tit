import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(
    private http: HttpClient,
    private readonly sanitizer: DomSanitizer,
  ) {}

  getImage(
    imageId: number | null,
    fallbackImage = 'https://ionicframework.com/docs/img/demos/thumbnail.svg',
  ): Observable<SafeUrl> {
    return imageId === null
      ? of(fallbackImage)
      : this.getImageFromDatabase(imageId).pipe(
          map((blob) => {
            let objectURL = URL.createObjectURL(blob);
            return this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }),
        );
  }

  webcamImageToFile(webcamImage: WebcamImage): File {
    const blob = this.convertToBlob(webcamImage.imageAsDataUrl);
    return new File([blob], 'filename.jpeg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  }

  convertToBlob(base64Image: string): Blob {
    const parts = base64Image.split(';base64,');
    const imageContent = parts[1];
    const byteString = window.atob(imageContent);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: 'image/jpeg' });
  }

  private getImageFromDatabase(id: number): Observable<Blob> {
    return this.http.get(`http://localhost:5204/api/Image/${id}`, {
      responseType: 'blob',
    });
  }

  getImageUrlForUser(userId: number): Observable<SafeUrl> {
    return this.http
      .get(`http://localhost:5204/api/Image/byUserId/${userId}`, {
        responseType: 'blob',
      })
      .pipe(
        map((blob) => {
          let objectURL = URL.createObjectURL(blob);
          return this.sanitizer.bypassSecurityTrustUrl(objectURL);
        }),
      );
  }
}
