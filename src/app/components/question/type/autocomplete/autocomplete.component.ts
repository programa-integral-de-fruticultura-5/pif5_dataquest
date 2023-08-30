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

  private selectedAnswer!: Answer
  private results: Answer[];
  public data!: Answer[]

  constructor(
    private producersService: ProducerService,
    private associationService: AssociationService,
    private answerService: AnswerService
  ) {
    let answers = this.answerService.getAnswers();
    let producer = this.producersService.getProducers();
    let association = this.associationService.getAssociations();
    this.data = answers.length === 0 ? producer.concat(association) : answers;  // TODO check the type of the answers when is producers and association, and when is answers
    this.results = [...this.data];
  }

  ngOnInit() {}

  search(event: any) {
    const query = event.target.value.toLowerCase();
    this.results = this.data.filter((d) => d.value.toLowerCase().indexOf(query) > -1);
  }

  select(answer: Answer) {
    this.setItemSelected(answer);
  }

  getItemSelected() {
    return this.selectedAnswer.value;
  }

  setItemSelected(selectedAnswer: Answer) {
    this.selectedAnswer = selectedAnswer;
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
