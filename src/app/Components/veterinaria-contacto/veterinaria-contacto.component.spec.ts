import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariaContactoComponent } from './veterinaria-contacto.component';

describe('VeterinariaContactoComponent', () => {
  let component: VeterinariaContactoComponent;
  let fixture: ComponentFixture<VeterinariaContactoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariaContactoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariaContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
