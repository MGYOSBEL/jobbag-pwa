import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinusSectionComponent } from './joinus-section.component';

describe('JoinusSectionComponent', () => {
  let component: JoinusSectionComponent;
  let fixture: ComponentFixture<JoinusSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinusSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinusSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
