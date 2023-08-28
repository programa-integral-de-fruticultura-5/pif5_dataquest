import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { QuestionService } from 'src/app/services/detailed-form/question/question.service';
import { AutocompleteTypeComponent } from '../autocomplete-type/autocomplete-type.component';
import { CommonModule } from '@angular/common';
import { PhotoDataTypeComponent } from './photo-data-type/photo-data-type.component';
import { DrawingPadDataTypeComponent } from './drawing-pad-data-type/drawing-pad-data-type.component';
import { TextAreaDataTypeComponent } from './text-area-data-type/text-area-data-type.component';
import { NumberDataTypeComponent } from './number-data-type/number-data-type.component';
import { TextDataTypeComponent } from './text-data-type/text-data-type.component';
import { DateDataTypeComponent } from './date-data-type/date-data-type.component';
import { PercentageDataTypeComponent } from './percentage-data-type/percentage-data-type.component';

@Component({
  selector: 'app-open-type',
  templateUrl: './open-type.component.html',
  styleUrls: ['./open-type.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    AutocompleteTypeComponent,
    PhotoDataTypeComponent,
    DrawingPadDataTypeComponent,
    TextAreaDataTypeComponent,
    NumberDataTypeComponent,
    TextDataTypeComponent,
    DateDataTypeComponent,
    PercentageDataTypeComponent
  ],
  standalone: true,
})
export class OpenTypeComponent  implements OnInit {

  @Input({ required: true }) questionDataType: string = '';

  constructor() { }

  ngOnInit() {}

}
