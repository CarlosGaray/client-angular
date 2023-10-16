import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {

  fileUploadForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.fileUploadForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      fileSource: ['', Validators.required],
      fileName: ''
    });
  }

  onFileSelected(event: any): void {
    const fileInput = event.target;

    if (fileInput.files.length > 0) {
      this.fileUploadForm.patchValue({
        fileName: fileInput.files[0]
      });
    }
  }

  async postDetails() {
    const formData = new FormData();

    formData.append('file', this.fileUploadForm.controls['fileName'].value);
    formData.append('upload_preset', 'insta-clone');
    formData.append('cloud_name', 'ddv85gsd3');

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/ddv85gsd3/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      console.info('complete');
    }
  }

  onSubmit() {
    this.postDetails();
  }

}
