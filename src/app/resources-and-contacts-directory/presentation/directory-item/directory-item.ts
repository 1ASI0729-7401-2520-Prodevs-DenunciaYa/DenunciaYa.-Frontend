import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectoryEntity } from '../../domain/model/directory.entity';

@Component({
  selector: 'app-directory-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './directory-item.html',
  styleUrls: ['./directory-item.css']
})
export class DirectoryItemComponent {

  @Input({ required: true }) entity!: DirectoryEntity;
}
