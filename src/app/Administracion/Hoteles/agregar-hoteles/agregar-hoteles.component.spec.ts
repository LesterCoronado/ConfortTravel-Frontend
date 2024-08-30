import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarHotelesComponent } from './agregar-hoteles.component';

describe('AgregarHotelesComponent', () => {
  let component: AgregarHotelesComponent;
  let fixture: ComponentFixture<AgregarHotelesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarHotelesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarHotelesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
