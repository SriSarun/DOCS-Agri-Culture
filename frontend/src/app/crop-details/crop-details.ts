import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; 
import { CropService } from '../services/crop';

@Component({
  selector: 'app-crop-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crop-details.html',
  styleUrls: ['./crop-details.css']
})
export class CropDetailsComponent implements OnInit {
  crop: any = null; 

  constructor(
    private route: ActivatedRoute,
    private cropService: CropService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cropService.getCropById(id).subscribe({
        next: (data) => this.crop = data,
        error: (err) => console.error('Error fetching crop details:', err)
      });
    }
  }
}