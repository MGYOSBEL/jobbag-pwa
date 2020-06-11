import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActionBarComponent } from './project-action-bar.component';

describe('ProjectActionBarComponent', () => {
  let component: ProjectActionBarComponent;
  let fixture: ComponentFixture<ProjectActionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectActionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
