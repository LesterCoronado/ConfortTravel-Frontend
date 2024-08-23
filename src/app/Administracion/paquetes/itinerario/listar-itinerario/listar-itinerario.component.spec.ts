import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarItinerarioComponent } from './listar-itinerario.component';

describe('ListarItinerarioComponent', () => {
  let component: ListarItinerarioComponent;
  let fixture: ComponentFixture<ListarItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarItinerarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListarItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
