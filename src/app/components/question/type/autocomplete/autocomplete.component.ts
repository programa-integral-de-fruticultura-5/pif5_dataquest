import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Answer } from 'src/app/models/answer';
import { AssociationService } from 'src/app/services/association/association.service';
import { AnswerService } from 'src/app/services/detailed-form/question/answer/answer.service';
import { ProducerService } from 'src/app/services/producer/producer.service';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ],
})
export class AutocompleteComponent  implements OnInit {

  private selection!: any
  private results!: any[];
  public answersData!: any[]
  public producersData!: any[]
  public associationsData!: any[]

  constructor(
    private producersService: ProducerService,
    private associationService: AssociationService,
    private answerService: AnswerService
  ) { }

  ngOnInit() {

    this.answersData = this.getAnswers();
    console.log(this.answersData)
    this.producersData = this.getProducers();
    this.associationsData = this.getAssociations();
    let data = this.getData()  // TODO check the type of the answers when is producers and association, and when is answers
    this.results = Array.from(data);

  }

  search(event: any) {
    this.hasAnswers() ? this.searchAnswer(event) : this.searchProducer(event);
  }

  private searchAnswer(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.answersData.filter((d) => d.value.toLowerCase().indexOf(query) > -1);
  }

  private searchProducer(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.producersData.filter((d) => d.identification.toLowerCase().indexOf(query) > -1);
  }

  private searchAssociation(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.associationsData.filter((d) => d.identification.toLowerCase().indexOf(query) > -1);
  }

  private hasAnswers(): boolean {
    return this.answersData.length > 1
  }

  select(selection: any) {
    this.selection = selection;
  }

  getText(): string {
    return this.hasAnswers() ? this.selection?.value : this.selection?.identification;
  }

  getValue(result: any): string {
    return this.hasAnswers() ? result.value : result.identification;
  }

  private getData(): any[] {
    if (this.hasAnswers())
      return this.answersData
    else
      return this.producersData
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

  getResults() {
    return this.results;
  }

}
