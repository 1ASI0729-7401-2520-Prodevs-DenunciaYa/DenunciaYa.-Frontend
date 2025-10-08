import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityForm } from '../community-form/community-form';
import { CommunityList } from '../community-list/community-list';

@Component({
  selector: 'app-community-page',
  standalone: true,
  imports: [CommonModule, CommunityForm, CommunityList, CommunityForm],
  templateUrl: './community-page.html',
  styleUrls: ['./community-page.css']
})
export class CommunityPage {}
