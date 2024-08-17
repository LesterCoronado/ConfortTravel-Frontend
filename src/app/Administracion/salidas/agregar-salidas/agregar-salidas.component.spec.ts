import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarSalidasComponent } from './agregar-salidas.component';

describe('AgregarSalidasComponent', () => {
  let component: AgregarSalidasComponent;
  let fixture: ComponentFixture<AgregarSalidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarSalidasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarSalidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
