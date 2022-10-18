/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiGameoverComponent } from './ui-gameover.component';

describe('UiGameoverComponent', () => {
  let component: UiGameoverComponent;
  let fixture: ComponentFixture<UiGameoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiGameoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiGameoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
