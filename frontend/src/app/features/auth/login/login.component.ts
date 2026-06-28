import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../../core/services/auth.service";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './login.component.html',
})

export class LoginComponent {
    email = '';
    password = '';
    error = '';

    constructor(private authService: AuthService, private router: Router) {}

    onSubmit() {
        this.authService.login({email: this.email, password: this.password}).subscribe({
            next: (response) => {
                this.authService.saveTokens(response);
                this.router.navigate(['/tasks']);
            },
            error: () => {
                this.error = 'Invalid email or password';
            }
        }); 
    }
}