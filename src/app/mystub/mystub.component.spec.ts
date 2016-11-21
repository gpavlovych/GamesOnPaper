/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MystubComponent } from './mystub.component';

describe('MystubComponent', () => {
  let component: MystubComponent;
  let fixture: ComponentFixture<MystubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MystubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MystubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
