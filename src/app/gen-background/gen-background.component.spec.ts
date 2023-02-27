import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenBackgroundComponent } from './gen-background.component';

describe('GenBackgroundComponent', () => {
  let component: GenBackgroundComponent;
  let fixture: ComponentFixture<GenBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenBackgroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
