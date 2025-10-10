import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { ComplaintsApiService } from '../../../infrastructure/complaint-api';
import { Complaint } from '../../../model/domain/complaint.entity';
import {TranslatePipe} from '@ngx-translate/core';

/**
 * Component for the authority's home dashboard.
 * Displays statistics and charts about complaints.
 */
@Component({
  selector: 'app-authority-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ChartModule, TranslatePipe],
  templateUrl: './authority-home.html',
  styleUrls: ['./authority-home.css']
})
/**
 * @class AuthorityHomeComponent
 * @summary Component for the authority's home dashboard.
 * @description This component displays various statistics and charts related to complaints,
 * @method ngOnInit Initializes the component and loads complaint data.
 * @method loadComplaintsData Loads complaint data from the API.
 * @method calculateStatistics Calculates various statistics from the complaint data.
 * @method generateStatusChart Generates a pie chart showing the distribution of complaints by status.
 * @method generateCategoryChart Generates a bar chart showing complaints by category and status.
 * @author Omar Harold Rivera Ticllacuri
 */
export class AuthorityHomeComponent implements OnInit {
  userName: string = 'Juan Pérez';
  totalComplaints = 0;
  pendingComplaints = 0;
  resolvedComplaints = 0;
  districtWithMostComplaints = '';
  complaints: Complaint[] = [];
  categories: { [key: string]: number } = {};
  mostCommonCategory = '';
  isLoading = true;
  errorMessage = '';

  statusChartData: any;
  statusChartOptions: any;
  categoryChartData: any;
  categoryChartOptions: any;

  constructor(private complaintsService: ComplaintsApiService) {}

  ngOnInit(): void {
    this.loadComplaintsData();
  }

  loadComplaintsData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.complaintsService.getComplaints().subscribe({
      next: (complaints) => {
        console.log('Complaints loaded in component:', complaints);
        this.complaints = complaints;
        this.calculateStatistics();
        this.generateStatusChart();
        this.generateCategoryChart();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading complaints:', error);
        this.errorMessage = 'Error loading data: ' + error.message;
        this.isLoading = false;
        this.setEmptyData();
      }
    });
  }
  private calculateStatistics(): void {
    this.totalComplaints = this.complaints.length;

    this.pendingComplaints = this.complaints.filter(c =>
      ['Pending', 'Awaiting response', 'In Process'].includes(c.status)
    ).length;

    this.resolvedComplaints = this.complaints.filter(c => c.status === 'Completed').length;

    this.calculateDistrictWithMostComplaints();
    this.calculateMostCommonCategory();
  }

  private calculateDistrictWithMostComplaints(): void {
    const districtCount: { [key: string]: number } = {};
    this.complaints.forEach(c => {
      if (c.district) districtCount[c.district] = (districtCount[c.district] || 0) + 1;
    });
    let max = 0;
    let district = 'No data';
    Object.entries(districtCount).forEach(([d, count]) => {
      if (count > max) {
        max = count;
        district = d;
      }
    });
    this.districtWithMostComplaints = district;
  }

  private calculateMostCommonCategory(): void {
    const categoryCount: { [key: string]: number } = {};
    this.complaints.forEach(c => {
      if (c.category) categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });
    let max = 0;
    let category = 'No data';
    Object.entries(categoryCount).forEach(([cat, count]) => {
      if (count > max) {
        max = count;
        category = cat;
      }
    });
    this.mostCommonCategory = category;
    this.categories = categoryCount;
  }

  private setEmptyData(): void {
    this.totalComplaints = 0;
    this.pendingComplaints = 0;
    this.resolvedComplaints = 0;
    this.districtWithMostComplaints = 'No data';
    this.mostCommonCategory = 'No data';
    this.categories = {};
    this.statusChartData = null;
    this.categoryChartData = null;
  }

  private generateStatusChart(): void {
    const statusCount: { [key: string]: number } = {};
    this.complaints.forEach(c => {
      const status = c.status.trim();
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const labels = Object.keys(statusCount);
    const values = Object.values(statusCount);

    const getColorForStatus = (status: string): string => {
      const statusColors: { [key: string]: string } = {
        'Pending': '#FFA726',
        'Awaiting response': '#42A5F5',
        'In Process': '#29B6F6',
        'Completed': '#66BB6A',
        'Cancelled': '#EF5350',
        'Rejected': '#78909C'
      };
      return statusColors[status] || this.generateRandomColor();
    };

    const backgroundColors = labels.map(status => getColorForStatus(status));
    const hoverColors = backgroundColors.map(color => this.lightenColor(color, 20));

    this.statusChartData = {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: hoverColors,
          borderColor: '#ffffff',
          borderWidth: 2
        }
      ]
    };

    this.statusChartOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: '#222222',
            font: {
              family: "'Roboto', sans-serif",
              size: 14
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        },
        title: {
          display: true,
          text: 'Complaints Distribution by Status',
          color: '#1a237e',
          font: {
            size: 18,
            weight: 'bold',
            family: "'Roboto', sans-serif"
          }
        }
      },
      cutout: '0%',
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private generateCategoryChart(): void {
    const categoryStatusData: { [key: string]: { [key: string]: number } } = {};

    this.complaints.forEach(complaint => {
      const category = complaint.category || 'Uncategorized';
      const status = complaint.status || 'No status';

      if (!categoryStatusData[category]) {
        categoryStatusData[category] = {};
      }

      categoryStatusData[category][status] = (categoryStatusData[category][status] || 0) + 1;
    });

    const categories = Object.keys(categoryStatusData);
    const allStatuses = [...new Set(this.complaints.map(c => c.status).filter(s => s))];

    const statusColors: { [key: string]: string } = {
      'Pending': '#FFA726',
      'Awaiting response': '#42A5F5',
      'In Process': '#29B6F6',
      'Completed': '#66BB6A',
      'Cancelled': '#EF5350',
      'Rejected': '#78909C'
    };

    const datasets = allStatuses.map(status => {
      const data = categories.map(category =>
        categoryStatusData[category][status] || 0
      );

      return {
        label: status,
        backgroundColor: statusColors[status] || this.generateRandomColor(),
        data: data
      };
    });

    this.categoryChartData = {
      labels: categories,
      datasets: datasets
    };

    this.categoryChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: {
          mode: 'index',
          intersect: false
        },
        legend: {
          position: 'bottom',
          labels: {
            color: '#222222',
            font: {
              family: "'Roboto', sans-serif",
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: 'Complaints by Category and Status',
          color: '#1a237e',
          font: {
            size: 18,
            weight: 'bold',
            family: "'Roboto', sans-serif"
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: '#555555',
            font: {
              family: "'Roboto', sans-serif"
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: '#555555',
            font: {
              family: "'Roboto', sans-serif"
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          }
        }
      }
    };
  }

  private generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private lightenColor(color: string, percent: number): string {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  }
}
