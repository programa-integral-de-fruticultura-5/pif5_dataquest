import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormListComponent } from 'src/app/components/form-list/form-list.component';
import { DraftService } from 'src/app/services/draft/draft.service';
import { FormService } from 'src/app/services/form/form.service';

@Component({
  selector: 'app-drafts',
  templateUrl: 'drafts.page.html',
  styleUrls: ['drafts.page.scss'],
  standalone: true,
  imports: [IonicModule, FormListComponent],
})
export class DraftsPage {

  constructor(private draftService: DraftService) {}

  getDrafts() {
    return this.draftService.getDrafts();
  }

}
