import { Routes } from '@angular/router';
import { CropListComponent } from './crop-list/crop-list';
import { CropDetailsComponent } from './crop-details/crop-details';

export const routes: Routes = [

  {path: '', component: CropListComponent}, // Default route to show the crop list
  {path: 'crop/:id', component: CropDetailsComponent}, // Route to show the crop details
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route to catch undefined paths and redirect to home
];
