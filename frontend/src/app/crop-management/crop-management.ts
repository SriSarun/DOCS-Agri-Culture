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
  error: string | null = null;

  constructor(private cropService: CropService) {}

  ngOnInit(): void {
    this.loadAllCrops();
  }

  
  loadAllCrops(): void {
    this.isLoading = true; 
    this.error = null;

    this.cropService.getAllCrops().subscribe({
      next: (data) => {
        this.crops = data;
        this.isLoading = false; 
        console.log('Crops loaded:', this.crops);
      },
      error: (err) => {
        console.error('Failed to load crops:', err);
        this.error = 'Could not load crop data. Please try again.';
        this.isLoading = false;
      }
    });
  }

  
  deleteCrop(cropId: string): void {
    if (confirm('Are you sure you want to delete this crop?')) {
      this.cropService.deleteCrop(cropId).subscribe({
        next: (response) => {
          console.log(response.message);
          this.loadAllCrops();
        },
        error: (err) => {
          console.error('Failed to delete crop:', err);
          alert('Error deleting crop. Please try again.');
        }
      });
    }
  }
}