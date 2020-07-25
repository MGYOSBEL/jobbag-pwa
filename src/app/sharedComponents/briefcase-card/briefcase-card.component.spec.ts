import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefcaseCardComponent } from './briefcase-card.component';

describe('BriefcaseCardComponent', () => {
  let component: BriefcaseCardComponent;
  let fixture: ComponentFixture<BriefcaseCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefcaseCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefcaseCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
