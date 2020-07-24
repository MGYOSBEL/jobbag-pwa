import { Component, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation} from 'ngx-gallery';


@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css']
})
export class ImageGalleryComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor() { }

  ngOnInit(): void {
      this.galleryOptions = [
          {
              width: '600px',
              height: '400px',
              thumbnailsColumns: 4,
              imageAnimation: NgxGalleryAnimation.Slide
          },
          // max-width 800
          {
              breakpoint: 800,
              width: '100%',
              height: '600px',
              imagePercent: 80,
              thumbnailsPercent: 20,
              thumbnailsMargin: 20,
              thumbnailMargin: 20
          },
          // max-width 400
          {
              breakpoint: 400,
              preview: false
          }
      ];

      this.galleryImages = [
          {
              small: 'assets/img/default-image.png',
              medium: 'assets/img/default-image.png',
              big: 'assets/img/default-image.png'
          },
          {
              small: 'assets/img/default-image.png',
              medium: 'assets/img/default-image.png',
              big: 'assets/img/default-image.png'
          },
          {
              small: 'assets/img/default-image.png',
              medium: 'assets/img/default-image.png',
              big: 'assets/img/default-image.png'
          }
      ];
  }
}
