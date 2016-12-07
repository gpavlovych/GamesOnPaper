/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FinishGameRowComponent } from './finish-game-row.component';

describe('FinishGameRowComponent', () => {
  let component: FinishGameRowComponent;
  let fixture: ComponentFixture<FinishGameRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishGameRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishGameRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
