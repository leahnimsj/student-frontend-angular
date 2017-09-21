import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KlassFormComponent } from './klass-form.component';

describe('KlassFormComponent', () => {
  let component: KlassFormComponent;
  let fixture: ComponentFixture<KlassFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KlassFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KlassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
