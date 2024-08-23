import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarIncluyeComponent } from './agregar-incluye.component';

describe('AgregarIncluyeComponent', () => {
  let component: AgregarIncluyeComponent;
  let fixture: ComponentFixture<AgregarIncluyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarIncluyeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarIncluyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
