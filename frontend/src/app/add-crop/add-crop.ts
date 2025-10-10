import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink  } from '@angular/router';
import { CropService } from '../services/crop';

@Component({
  selector: 'app-add-crop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink ],
  templateUrl: './add-crop.html',
  styleUrls: ['./add-crop.css']
})

export class AddCropComponent {
  cropForm: FormGroup;
  selectedFiles = new Map<string, File | File[]>();

  constructor(
    private fb: FormBuilder,
    private cropService: CropService,
    private router: Router
  ) {

    this.cropForm = this.fb.group({
      name: ['', Validators.required],
      sowingSeason: [''],
      growthDuration: [''],
      growthStages: this.fb.array([]),
      diseases: this.fb.array([]),
      fertilizers: this.fb.array([]),
  
    });
  }


  
  get growthStages() {
    return this.cropForm.get('growthStages') as FormArray;
  }
  get diseases() {
    return this.cropForm.get('diseases') as FormArray;
  }
  get fertilizers() {
    return this.cropForm.get('fertilizers') as FormArray;
  }


  addStage() { this.growthStages.push(this.fb.group({ stageName: [''], durationDays: [''] })); }
  removeStage(index: number) { this.growthStages.removeAt(index); }

  addDisease() { this.diseases.push(this.fb.group({ diseaseName: [''], symptoms: [''], causes: [''], chemicalControl: [''], organicControl: [''] })); }
  removeDisease(index: number) { this.diseases.removeAt(index); }

  addFertilizer() { this.fertilizers.push(this.fb.group({ type: ['chemical'], name: [''], quantity: [''] })); }
  removeFertilizer(index: number) { this.fertilizers.removeAt(index); }
  

  
  onFileChange(event: any, fieldName: string, index?: number) {
    const file = event.target.files?.[0];
    const files = event.target.files;
    let key = fieldName;
    if (index !== undefined) key = `${fieldName}_${index}`;
    
    if (fieldName === 'galleryImages' && files) {
      this.selectedFiles.set(key, files);
    } else if (file) {
      this.selectedFiles.set(key, file);
    }
  }


  // Form Submission
  onSubmit() {
    if (this.cropForm.invalid) {
      alert('Please fill all required fields.');
      return;
    }

    const formData = new FormData();
    const formValue = this.cropForm.value;

    // Process fertilizers into the correct structure
    const fertilizerRecommendation: { chemical: any[], organic: any[] } = { chemical: [], organic: [] };
    formValue.fertilizers.forEach((fert: any) => {
      if (fert.name && fert.quantity) {
        if (fert.type === 'chemical') {
          fertilizerRecommendation.chemical.push({ fertilizer: fert.name, quantityPerAcre: fert.quantity });
        } else {
          fertilizerRecommendation.organic.push({ name: fert.name, quantityPerAcre: fert.quantity });
        }
      }
    });

    // Process diseases to convert causes string to array
    const diseasesWithArrayCauses = formValue.diseases.map((d: any) => ({ ...d, causes: d.causes ? d.causes.split(',').map((s:string) => s.trim()) : [] }));
    
    // Assemble the final text data payload
    const textData = {
      ...formValue,
      diseases: diseasesWithArrayCauses,
      fertilizerRecommendation: fertilizerRecommendation
    };
    delete textData.fertilizers; 
    
    formData.append('data', JSON.stringify(textData));
    
    // Append files
    this.selectedFiles.forEach((fileOrFiles, key) => {
      if (fileOrFiles instanceof FileList) {
        for (let i = 0; i < fileOrFiles.length; i++) formData.append(key, fileOrFiles[i]);
      } else if (fileOrFiles instanceof File) {
        formData.append(key, fileOrFiles);
      }
    });



    // Set a loading message (optional but good practice)
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.textContent = 'Saving...';
      submitButton.disabled = true;
    }

    this.cropService.addCrop(formData).subscribe({
      next: (response) => {
        console.log('Crop added successfully:', response);
        alert('Crop added successfully!');
        
        this.cropForm.reset();

        this.growthStages.clear();
        this.diseases.clear();
        this.fertilizers.clear();

        this.selectedFiles.clear();
        (document.getElementById('add-crop-form') as HTMLFormElement).reset();

      
      },
      error: (err) => {
        console.error('Error adding crop:', err);
        alert(`Failed to save crop. Error: ${err.error?.message || err.message}`);
      },
      complete: () => {
        if (submitButton) {
          submitButton.textContent = 'Save Crop';
          submitButton.disabled = false;
        }
      }
    });
    

    
  }
}