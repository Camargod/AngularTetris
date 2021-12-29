/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiTimerComponent } from './ui-timer.component';

describe('UiTimerComponent', () => {
  let component: UiTimerComponent;
  let fixture: ComponentFixture<UiTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
