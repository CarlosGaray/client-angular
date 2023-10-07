import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

declare const M: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  myForm: FormGroup;

  url = "http://localhost:5000/signup";

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      // Define your form controls here
      name: '',
      email: '',
      password: ''
    });
  }

  onSubmit() {
    // Handle form submission here
    const { name, email, password } = this.myForm.value;
    this.postData(name, email, password)
  }

  async postData(name: string, password: string, email: string) {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        const data = await response.json();
        M.toast({ html: data.message, classes: "#43a047 green darken-1" });
        this.router.navigate(['/signin']);
      }
    } catch (err) {
      console.error(err);
    }
  }
}
