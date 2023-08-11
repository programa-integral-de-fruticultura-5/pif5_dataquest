import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedFormComponent } from './detailed-form.component';

describe('DetailedFormComponent', () => {
  let component: DetailedFormComponent;
  let fixture: ComponentFixture<DetailedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailedFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
