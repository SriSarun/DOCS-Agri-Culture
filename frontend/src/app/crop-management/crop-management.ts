import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CropService } from '../services/crop';

@Component({
  selector: 'app-crop-management',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './crop-management.html',
  styleUrls: ['./crop-management.css']
})
export class CropManagementComponent implements OnInit {

  crops: any[] = [];
  isLoading: boolean = true;

  constructor(private cropService: CropService) {}

  ngOnInit(): void {
    this.loadAllCrops();
  }

  // Load all crops from the service
  loadAllCrops(): void {
    this.cropService.getAllCrops().subscribe({
      next: (data) => {
        this.crops = data;
        this.isLoading = false;
        console.log('Failed loded for admin dashboard:', this.crops);
      },
      error: (err) => {
        console.error('Failed to load crops:', err);
        this.isLoading = false;
      }
    });
  }

  // Delete a crop by its ID
  deleteCrop(cropId: string): void {
    if (confirm('Are you sure you want to delete this crop?')) {
      this.cropService.deleteCrop(cropId).subscribe({
        next: (response) => {
          console.log(response.message); // Handle the response message if needed
          this.crops = this.crops.filter((crop) => crop._id !== cropId); // After deleting, remove that crop from the screen.
        },
        error: (err) => {
          console.error('Failed to delete crop:', err);
          alert('Error deleting crop. Please try again later.');
        }
      });
    }

  }
}
