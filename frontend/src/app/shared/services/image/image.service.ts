import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private http: HttpClient) {}

  getImage(id: number): Observable<Blob> {
    return this.http.get(`http://localhost:5204/api/Image/${id}`, {
      responseType: 'blob',
    });
  }

  webcamImageToFile(webcamImage: WebcamImage): File {
    const blob = this.convertToBlob(webcamImage.imageAsDataUrl);
    return new File([blob], 'filename.jpeg', {
      type: 'image/jpeg',
      lastModified: Date.now(),
    });
  }

  private convertToBlob(base64Image: string): Blob {
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
}
