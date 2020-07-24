import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefcaseDetailComponent } from './briefcase-detail.component';

describe('BriefcaseDetailComponent', () => {
  let component: BriefcaseDetailComponent;
  let fixture: ComponentFixture<BriefcaseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefcaseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefcaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
