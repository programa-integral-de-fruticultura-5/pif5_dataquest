import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { IonicModule } from '@ionic/angular';
import { Question } from 'src/app/models/question';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-drawing-pad-data-type',
  templateUrl: './drawing-pad-data-type.component.html',
  styleUrls: ['./drawing-pad-data-type.component.scss'],
  standalone: true,
  imports: [ IonicModule ]
})
export class DrawingPadDataTypeComponent {

  private signaturePad!: SignaturePad;
  @Input({ required: true }) question!: Question
  @Input({ required: true }) formGroup!: FormGroup

  @ViewChild('canvas')
  canvas!: ElementRef;

  signatureImg!: string;

  constructor() { }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
    this.savePad();
    this.signaturePad.throttle = 0;
    this.signaturePad.minDistance = 0;
    this.canvas.nativeElement.style.width = '100%';
    this.canvas.nativeElement.style.height = '100%';
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight;
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad.clear();
  }

  savePad() {
    const base64Data = this.signaturePad.toDataURL();
    this.signatureImg = base64Data;
    this.formGroup.get(`${this.question.id}`)?.setValue(base64Data);
  }

  undoPad() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }
}
