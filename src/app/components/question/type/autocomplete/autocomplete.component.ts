import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { IonModal, IonicModule } from '@ionic/angular';
import { TypeaheadComponent } from 'src/app/components/typeahead/typeahead.component';
import { Answer } from 'src/app/models/answer';
import { AssociationService } from 'src/app/services/association/association.service';
import { AnswerService } from 'src/app/services/detailed-form/question/answer/answer.service';
import { ProducerService } from 'src/app/services/producer/producer.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule, TypeaheadComponent ],
})
export class AutocompleteComponent  implements OnInit {

  @ViewChild('modal', { static: true }) modal!: IonModal;

  selection!: any
  public answersData!: any[]
  public producersData!: any[]
  public associationsData!: any[]
  public data!: any[]
// private results!: any[];

  constructor(
    private producersService: ProducerService,
    private associationService: AssociationService,
    private answerService: AnswerService
  ) { }

  ngOnInit() {

    this.answersData = this.getAnswers();
    this.producersData = this.getProducers();
    this.associationsData = this.getAssociations();
    this.data = this.getData()
    // this.results = Array.from(this.data);

  }

/*   private searchProducer(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.producersData.filter((d) => d.identification.toLowerCase().indexOf(query) > -1);
  }

  private searchAssociation(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.associationsData.filter((d) => d.identification.toLowerCase().indexOf(query) > -1);
  } */

  private hasAnswers(): boolean {
    return this.answersData.length > 1
  }

/*   private getValue(result: any): string {
    return this.hasAnswers() ? result.value : result.identification;
  } */

  private getData(): string[] {
    if (this.hasAnswers()) {
      let stringAnswers = this.answersData.map((answer) => answer.value)
      return stringAnswers
    }else{
      let stringProducers = this.producersData.map((producer) => producer.identification)
      return stringProducers
    }
  }

  getAnswers() {
    return this.answerService.getAnswers();
  }

  getProducers()  {
    return this.producersService.getProducers();
  }

  getAssociations() {
    return this.associationService.getAssociations();
  }

/*   getResults() {
    return this.results;
  } */

  selectionChanged(selection: string) {
    this.selection = selection;
    this.modal.dismiss();
  }

}
