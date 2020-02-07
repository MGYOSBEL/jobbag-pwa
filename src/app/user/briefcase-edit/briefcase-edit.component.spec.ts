import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BriefcaseEditComponent } from './briefcase-edit.component';

describe('BirefcaseEditComponent', () => {
  let component: BriefcaseEditComponent;
  let fixture: ComponentFixture<BriefcaseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BriefcaseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BriefcaseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
