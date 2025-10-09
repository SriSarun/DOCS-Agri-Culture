import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';
import { RouterTestingModule } from '@angular/router/testing'; 

describe('AppComponent', () => { 
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // For standalone components, you import them directly
      imports: [
        AppComponent,
        RouterTestingModule 
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Smart Farmer'`, () => { 
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Smart Farmer');
  });

  it('should render title in an h1 tag', () => { 
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Smart Farmer');
  });
});