/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UiThemesComponent } from './ui-themes.component';

describe('UiThemesComponent', () => {
  let component: UiThemesComponent;
  let fixture: ComponentFixture<UiThemesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UiThemesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UiThemesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
