import { Component, Input, OnInit, booleanAttribute } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dataquest-header',
  templateUrl: './dataquest-header.component.html',
  styleUrls: ['./dataquest-header.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ],
})
export class DataquestHeaderComponent  implements OnInit {

  @Input({ transform: booleanAttribute }) progressBar: boolean = false; //TODO check this attribute and why is not working

  progress: number = 1/5;

  constructor() { }

  ngOnInit() {}

}
