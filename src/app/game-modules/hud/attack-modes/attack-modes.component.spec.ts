/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AttackModesComponent } from './attack-modes.component';

describe('AttackModesComponent', () => {
  let component: AttackModesComponent;
  let fixture: ComponentFixture<AttackModesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttackModesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttackModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
