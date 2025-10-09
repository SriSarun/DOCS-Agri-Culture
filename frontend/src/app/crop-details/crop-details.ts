import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router'; 
import { CropService } from '../services/crop';

@Component({
  selector: 'app-crop-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './crop-details.html',
  styleUrls: ['./crop-details.css']
})

export class CropDetailsComponent implements OnInit {
  crop: any = null; 
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private cropService: CropService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    // If id is not null, fetch crop details
    if (id) {
      this.cropService.getCropById(id).subscribe({
        next: (data) => {
          this.crop = data;
          this.isLoading = false;
          console.log('Crop details loaded:', this.crop);
        },
        error: (err) => {
          console.error('Error fetching crop details:', err);
          this.isLoading = false;
        }
      });
    }
  }
}