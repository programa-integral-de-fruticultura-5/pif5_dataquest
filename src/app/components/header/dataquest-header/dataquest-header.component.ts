import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-dataquest-header',
  templateUrl: './dataquest-header.component.html',
  styleUrls: ['./dataquest-header.component.scss'],
  standalone: true,
  imports: [ IonicModule ],
})
export class DataquestHeaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
