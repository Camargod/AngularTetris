/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiCreditsComponent } from './ui-credits.component';

describe('UiCreditsComponent', () => {
  let component: UiCreditsComponent;
  let fixture: ComponentFixture<UiCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiCreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
