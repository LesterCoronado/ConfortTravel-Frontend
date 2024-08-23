import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarItinerarioComponent } from './agregar-itinerario.component';

describe('AgregarItinerarioComponent', () => {
  let component: AgregarItinerarioComponent;
  let fixture: ComponentFixture<AgregarItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarItinerarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
