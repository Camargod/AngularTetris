/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardsHudComponent } from './cards-hud.component';

describe('CardsHudComponent', () => {
  let component: CardsHudComponent;
  let fixture: ComponentFixture<CardsHudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsHudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
