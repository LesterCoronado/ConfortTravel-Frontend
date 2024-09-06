import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarHotelComponent } from './asignar-hotel.component';

describe('AsignarHotelComponent', () => {
  let component: AsignarHotelComponent;
  let fixture: ComponentFixture<AsignarHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsignarHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsignarHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
