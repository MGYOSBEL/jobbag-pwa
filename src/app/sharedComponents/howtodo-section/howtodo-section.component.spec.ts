import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtodoSectionComponent } from './howtodo-section.component';

describe('HowtodoSectionComponent', () => {
  let component: HowtodoSectionComponent;
  let fixture: ComponentFixture<HowtodoSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowtodoSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtodoSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
