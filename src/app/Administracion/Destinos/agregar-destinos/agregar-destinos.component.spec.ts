import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDestinosComponent } from './agregar-destinos.component';

describe('AgregarDestinosComponent', () => {
  let component: AgregarDestinosComponent;
  let fixture: ComponentFixture<AgregarDestinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarDestinosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarDestinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
