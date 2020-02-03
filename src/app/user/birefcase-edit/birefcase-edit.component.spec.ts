import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BirefcaseEditComponent } from './birefcase-edit.component';

describe('BirefcaseEditComponent', () => {
  let component: BirefcaseEditComponent;
  let fixture: ComponentFixture<BirefcaseEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BirefcaseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BirefcaseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
