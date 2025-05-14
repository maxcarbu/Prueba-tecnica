import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  private platformId = inject(PLATFORM_ID);

  constructor(
    private contactService: ContactService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadContacts();

    // Only add event listener in browser environment
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('contactsUpdated', () => {
        this.loadContacts();
      });
    }
  }

  loadContacts(): void {
    this.contactService.getContacts()
      .subscribe({
        next: (contacts) => {
          this.contacts = contacts;
        },
        error: (error) => {
          console.error('Error loading contacts:', error);
        }
      });
  }

  deleteContact(id: string): void {
    if (isPlatformBrowser(this.platformId) && confirm('Are you sure you want to delete this contact?')) {
      this.contactService.deleteContact(id)
        .subscribe({
          next: () => {
            this.loadContacts();
          },
          error: (error) => {
            console.error('Error deleting contact:', error);
          }
        });
    }
  }

  viewContactDetails(contact: Contact): void {
    this.dialog.open(ContactDetailComponent, {
      width: '400px',
      data: contact
    });
  }
}