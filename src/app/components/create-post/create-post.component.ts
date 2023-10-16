import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

declare const M: any;

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent {

  fileUploadForm: FormGroup;
  url = "http://localhost:5000/createpost";

  constructor(private formBuilder: FormBuilder, private router: Router) {
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

      const data = await response.json();

      const res = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer "+localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          title: this.fileUploadForm.controls['title'].value,
          body: this.fileUploadForm.controls['body'].value,
          pic: data.url
        })
      });

      if (!res.ok) {
        const data = await res.json();
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        M.toast({ html: "Created post Successfully", classes: "#43a047 green darken-1" });
        this.router.navigate(['/']);
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
