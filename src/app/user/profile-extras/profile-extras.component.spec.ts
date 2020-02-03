import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileExtrasComponent } from './profile-extras.component';

describe('ProfileExtrasComponent', () => {
  let component: ProfileExtrasComponent;
  let fixture: ComponentFixture<ProfileExtrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileExtrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
