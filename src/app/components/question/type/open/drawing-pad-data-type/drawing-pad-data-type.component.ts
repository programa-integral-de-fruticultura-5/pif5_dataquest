import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { IonicModule } from '@ionic/angular';
import { FormDetail } from '@models/FormDetail.namespace'
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-drawing-pad-data-type',
  templateUrl: './drawing-pad-data-type.component.html',
  styleUrls: ['./drawing-pad-data-type.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class DrawingPadDataTypeComponent {
  private signaturePad!: SignaturePad;
  @Input({ required: true }) question!: FormDetail.Question;
  @Input({ required: true }) formGroup!: FormGroup;
  @Input({ required: true }) disabled!: boolean;

  @ViewChild('canvas')
  canvas!: ElementRef;

  signatureImg!: string;

  constructor() {}

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
    window.addEventListener('resize', () => this.resizeCanvas());
    this.resizeCanvas();
    this.disabled ? this.signaturePad.off() : this.signaturePad.on();
  }

  resizeCanvas() {
    this.canvas.nativeElement.style.width = '100%';
    this.canvas.nativeElement.style.height = '100%';
    var width = this.canvas.nativeElement.offsetWidth;
    var height = this.canvas.nativeElement.offsetHeight;
    var ratio = Math.max(window.devicePixelRatio || 1, 1);
    this.canvas.nativeElement.width = width * ratio;
    this.canvas.nativeElement.height = height * ratio;
    this.canvas.nativeElement.getContext('2d').scale(ratio, ratio);
    this.setSignature();
  }

  setSignature() {
    this.signaturePad.clear();
    let signature = this.formGroup.get(`${this.question.id}`)?.value;
    if (signature) {
      this.signaturePad.fromDataURL(signature)
      this.signatureImg = signature;
    }
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser
  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signatureImg = '';
    this.formGroup.get(`${this.question.id}`)?.setValue(null);
    this.signaturePad.clear();
  }

  savePad() {
    if (!this.signaturePad.isEmpty()) {
      const base64Data = this.signaturePad.toDataURL('image/png', 0.5);
      this.signatureImg = base64Data;
      this.formGroup.get(`${this.question.id}`)?.setValue(base64Data);
    } else {
      this.clearPad();
    }

  }

  undoPad() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop();
      if (data.length)
        this.signaturePad.fromData(data);
      else
        this.clearPad();
    }
  }
}
