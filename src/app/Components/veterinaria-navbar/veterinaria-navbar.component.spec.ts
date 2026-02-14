import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinariaNavbarComponent } from './veterinaria-navbar.component';

describe('VeterinariaNavbarComponent', () => {
  let component: VeterinariaNavbarComponent;
  let fixture: ComponentFixture<VeterinariaNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VeterinariaNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VeterinariaNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
