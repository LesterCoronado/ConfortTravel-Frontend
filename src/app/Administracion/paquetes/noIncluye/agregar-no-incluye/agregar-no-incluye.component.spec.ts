import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarNoIncluyeComponent } from './agregar-no-incluye.component';

describe('AgregarNoIncluyeComponent', () => {
  let component: AgregarNoIncluyeComponent;
  let fixture: ComponentFixture<AgregarNoIncluyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarNoIncluyeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarNoIncluyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
