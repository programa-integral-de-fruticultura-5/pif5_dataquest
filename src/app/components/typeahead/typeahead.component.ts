import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  standalone: true,
  imports: [ CommonModule, IonicModule ],
})
export class TypeaheadComponent {
  @Input() items: string[] = [];
  @Input() selectedItem: string = '';
  @Input() title = 'Selecciona uno';

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<string>();

  filteredItems: string[] = [];
  workingSelectedValue: string = '';

  ngOnInit() {
    this.filteredItems = [...this.items];
    this.select(this.selectedItem);
  }

  select(item: string) {
    this.workingSelectedValue = item;
    this.confirmChanges();
  }

  trackItems(index: number, item: string) {
    return item;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(this.workingSelectedValue);
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return item.toLowerCase().includes(normalizedQuery);
      });
    }
  }
}
