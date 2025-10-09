import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryStore } from '../../application/directory.store';
import { DirectoryItemComponent } from '../directory-item/directory-item';

@Component({
  selector: 'app-directory-list',
  standalone: true,
  imports: [CommonModule, DirectoryItemComponent],
  templateUrl: './directory-list.html',
  styleUrls: ['./directory-list.css']
})
export class DirectoryListComponent {
  readonly store = inject(DirectoryStore);
}
