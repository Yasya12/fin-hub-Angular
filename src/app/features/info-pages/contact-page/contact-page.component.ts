import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  //Services
  contactService = inject(ContactService);
  toast = inject(ToastrService);
  fb = inject(FormBuilder);

  //States
  contactForm!: FormGroup;

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.contactService.sendContactForm(this.contactForm.value).subscribe({
        next: () => {
          this.toast.success('Повідомлення успішно надіслано!', 'Успіх');
          this.contactForm.reset();
        },
        error: () => {
          this.toast.error('Сталася помилка при надсиланні. Спробуйте пізніше.', 'Помилка');
        }
      });
    }
  }
}
