import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionsEditComponent } from './professions-edit.component';

describe('ProfessionsComponent', () => {
  let component: ProfessionsEditComponent;
  let fixture: ComponentFixture<ProfessionsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfessionsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
