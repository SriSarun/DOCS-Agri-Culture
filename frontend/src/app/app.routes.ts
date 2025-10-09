import { Routes } from '@angular/router'; 
import { CropDetailsComponent } from './crop-details/crop-details';
import { CropManagementComponent } from './crop-management/crop-management';
import { AddCropComponent } from './add-crop/add-crop';
import { AdminHomeComponent } from './admin-home/admin-home';


export const routes: Routes = [

  {path: '', component: AdminHomeComponent }, // Default route to show the crop list
  {path: 'crop/:id', component: CropDetailsComponent}, // Route to show the crop details
  { path: 'admin/crop-management', component: CropManagementComponent  },
  { path: 'admin/add-crop', component: AddCropComponent  },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route to catch undefined paths and redirect to home
];
