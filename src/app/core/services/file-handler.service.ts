import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  openPdf(blob: Blob): void {
    const objectUrl = URL.createObjectURL(blob);
    const tab = window.open(objectUrl, '_blank');

    if (!tab) {
      URL.revokeObjectURL(objectUrl);
      console.warn('[FileHandlerService] Popup bloqueado por el navegador');
      return;
    }

    setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
  }

  downloadFile(blob: Blob, filename: string): void {
    const objectUrl = URL.createObjectURL(blob);

    const anchor = Object.assign(document.createElement('a'), {
      href: objectUrl,
      download: filename,
      style: 'display:none'
    });

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  }
}
