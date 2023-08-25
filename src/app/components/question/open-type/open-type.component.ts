import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';

@Component({
  selector: 'app-open-type',
  templateUrl: './open-type.component.html',
  styleUrls: ['./open-type.component.scss'],
  imports: [IonicModule],
  standalone: true,
})
export class OpenTypeComponent  implements OnInit {


  constructor(private questionService: QuestionService) { }

  ngOnInit() {}

}
