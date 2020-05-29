import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;


  constructor(public loadingService: LoadingService) {
    this.lottieConfig = {
      path: 'assets/img/loading.json',
      renderer: 'canvas',
      autoplay: true,
      loop: true
    };
  }

  handleAnimation(anim: any) {
    this.anim = anim;
  }

  ngOnInit() {

  }


}
