import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropService } from '../services/crop'; 

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-home.html',
  styleUrls: ['./admin-home.css']
})
export class AdminHomeComponent implements OnInit {

  totalCrops: number | string = '...'; 

  constructor(private cropService: CropService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.cropService.getStats().subscribe({
      next: (stats) => {
        this.totalCrops = stats.totalCrops;
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
        this.totalCrops = 'Error';
      }
    });
  }
}