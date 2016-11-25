/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { Top100playersComponent } from './top100players.component';

describe('Top100playersComponent', () => {
  let component: Top100playersComponent;
  let fixture: ComponentFixture<Top100playersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Top100playersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top100playersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
