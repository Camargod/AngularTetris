/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiCloseComponent } from './ui-close.component';

describe('UiCloseComponent', () => {
  let component: UiCloseComponent;
  let fixture: ComponentFixture<UiCloseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiCloseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiCloseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
