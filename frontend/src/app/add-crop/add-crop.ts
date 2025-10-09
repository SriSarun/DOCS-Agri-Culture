import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CropService } from '../services/crop';

@Component({
  selector: 'app-add-crop',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-crop.html',
  styleUrls: ['./add-crop.css']
})

export class AddCropComponent implements OnInit {
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
  
    });
  }

  ngOnInit(): void {}

  
  get growthStages() {
    return this.cropForm.get('growthStages') as FormArray;
  }
  get diseases() {
    return this.cropForm.get('diseases') as FormArray;
  }


  addStage() {
    const stageForm = this.fb.group({
      stageName: [''],
      durationDays: ['']
    });
    this.growthStages.push(stageForm);
  }
  removeStage(index: number) {
    this.growthStages.removeAt(index);
  }

  addDisease() {
    const diseaseForm = this.fb.group({
      diseaseName: [''],
      symptoms: [''],
      causes: [''], 
    });
    this.diseases.push(diseaseForm);
  }
  removeDisease(index: number) {
    this.diseases.removeAt(index);
  }

  
  onFileChange(event: any, fieldName: string, index?: number) {
    const file = event.target.files[0];
    const files = event.target.files;
    let key = fieldName;
    if (index !== undefined) {
      key = `${fieldName}_${index}`; 
    }
    
    if (fieldName === 'galleryImages') {
      this.selectedFiles.set(key, files);
    } else {
      this.selectedFiles.set(key, file);
    }
  }

  
  onSubmit() {
    if (this.cropForm.invalid) {
      return;
    }

    const formData = new FormData();
    const formValue = this.cropForm.value;

    
    const diseasesWithArrayCauses = formValue.diseases.map((disease: any) => ({
      ...disease,
      causes: disease.causes.split(',').map((s: string) => s.trim())
    }));
    
    const textData = { ...formValue, diseases: diseasesWithArrayCauses };
    formData.append('data', JSON.stringify(textData));
    
    
    this.selectedFiles.forEach((fileOrFiles, key) => {
      if (key === 'galleryImages' && fileOrFiles instanceof FileList) {
        for (let i = 0; i < fileOrFiles.length; i++) {
          formData.append(key, fileOrFiles[i]);
        }
      } else if (fileOrFiles instanceof File) {
        formData.append(key, fileOrFiles);
      }
    });

    
    console.log("Form Submitted!", textData);
    alert("Crop data prepared. Check the console. (API call to be implemented)");
    
  }
}