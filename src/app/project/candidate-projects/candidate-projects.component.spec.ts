import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProjectsComponent } from './candidate-projects.component';

describe('CandidateProjectsComponent', () => {
  let component: CandidateProjectsComponent;
  let fixture: ComponentFixture<CandidateProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
