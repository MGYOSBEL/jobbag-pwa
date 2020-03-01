import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiabilitySectionComponent } from './fiability-section.component';

describe('FiabilitySectionComponent', () => {
  let component: FiabilitySectionComponent;
  let fixture: ComponentFixture<FiabilitySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiabilitySectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiabilitySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
