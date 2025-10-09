import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CropService } from '../services/crop';


@Component({
  selector: 'app-crop-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './crop-list.html',
  styleUrl: './crop-list.css'
})


export class CropListComponent implements OnInit {
  crops: any[] = [];

  constructor(private cropService: CropService) {}

 ngOnInit(): void {
    this.loadCrops();
  }

  loadCrops(): void {
    this.cropService.getAllCrops().subscribe({
      next: (data) => this.crops = data,
      error: (err) => console.error('Error fetching crops:', err)
    });
  }

}
