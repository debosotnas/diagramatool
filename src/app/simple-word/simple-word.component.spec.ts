import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleWordComponent } from './simple-word.component';

describe('SimpleWordComponent', () => {
  let component: SimpleWordComponent;
  let fixture: ComponentFixture<SimpleWordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleWordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
