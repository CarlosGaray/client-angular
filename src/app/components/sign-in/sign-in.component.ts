import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

declare const M: any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {
  myForm: FormGroup;

  url = "http://localhost:5000/signin";

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.myForm = this.formBuilder.group({
      // Define your form controls here
      email: '',
      password: ''
    });
  }

  onSubmit() {
    // Handle form submission here
    const { email, password } = this.myForm.value;
    this.postData(email, password)
  }

  async postData(password: string, email: string) {
    try {
      const response = await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        const data = await response.json();
        M.toast({ html: data.error, classes: "#c62828 red darken-3" });
      } else {
        const data = await response.json();
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        M.toast({ html: "Signedin succes", classes: "#43a047 green darken-1" });
        this.router.navigate(['/']);
      }
    } catch (err) {
      console.error(err);
    }
  }
}
