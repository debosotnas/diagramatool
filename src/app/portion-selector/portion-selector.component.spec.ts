import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortionSelectorComponent } from './portion-selector.component';

describe('PortionSelectorComponent', () => {
  let component: PortionSelectorComponent;
  let fixture: ComponentFixture<PortionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
