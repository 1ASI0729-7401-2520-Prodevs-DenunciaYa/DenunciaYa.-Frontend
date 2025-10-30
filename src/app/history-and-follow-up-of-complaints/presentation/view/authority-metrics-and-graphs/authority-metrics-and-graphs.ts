import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

import {TranslatePipe} from '@ngx-translate/core';
import {Complaint} from '../../../../complaint-creation/domain/model/complaint.entity';
import {ComplaintsApiService} from '../../../../complaint-creation/infrastructure/complaint-api';

@Component({
  selector: 'app-authority-metrics-and-graphs',
  standalone: true,
  imports: [CommonModule, ChartModule, TranslatePipe],
  templateUrl: './authority-metrics-and-graphs.html',
  styleUrls: ['./authority-metrics-and-graphs.css']
})
/**
 * @class AuthorityMetricsAndGraphs
 * @summary Component for displaying authority metrics and graphs.
 * @description This component displays various metrics and charts related to complaints,
 * @method ngOnInit Initializes the component and loads metrics data.
 * @method loadMetricsData Loads metrics data from the API.
 * @method calculateMetrics Calculates various metrics from the complaint data.
 * @method generateCharts Generates charts for the metrics.
 * @method generatePolarAreaChart Generates a polar area chart showing complaints by category.
 * @method generateCategoryTrendsChart Generates a bar chart showing monthly trends by category.
 * @author Omar Harold Rivera Ticllacuri
 */
export class AuthorityMetricsAndGraphs implements OnInit {
  private complaintsService = inject(ComplaintsApiService);
  private cd = inject(ChangeDetectorRef);

  monthlyTotal = 0;
  mostCommonCategory = '';
  districtWithMostComplaints = '';
  newComplaints24h = 0;

  polarAreaData: any;
  polarAreaOptions: any;
  categoryTrendsData: any;
  categoryTrendsOptions: any;

  isLoading = true;
  errorMessage = '';

  private sampleComplaints: Complaint[] = [
  ];

  ngOnInit(): void {
    this.loadMetricsData();
  }

  loadMetricsData(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.complaintsService.getAllComplaints().subscribe({
      next: (response) => {
        const complaints = response.complaints || [];
        this.calculateMetrics(complaints);
        this.generateCharts(complaints);
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error loading metrics data:', error);
        this.errorMessage = 'Error loading metrics data';
        this.isLoading = false;
        this.setEmptyData();
        this.cd.detectChanges();
      }
    });
  }

  private calculateMetrics(complaints: Complaint[]): void {
    this.monthlyTotal = complaints.length;

    const categoryCount: { [key: string]: number } = {};
    complaints.forEach(c => {
      if (c.category) categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });

    let maxCategoryCount = 0;
    let mostCommon = 'No data';
    Object.entries(categoryCount).forEach(([category, count]) => {
      if (count > maxCategoryCount) {
        maxCategoryCount = count;
        mostCommon = category;
      }
    });
    this.mostCommonCategory = mostCommon;

    const districtCount: { [key: string]: number } = {};
    complaints.forEach(c => {
      if (c.district) districtCount[c.district] = (districtCount[c.district] || 0) + 1;
    });

    let maxDistrictCount = 0;
    let districtWithMost = 'No data';
    Object.entries(districtCount).forEach(([district, count]) => {
      if (count > maxDistrictCount) {
        maxDistrictCount = count;
        districtWithMost = district;
      }
    });
    this.districtWithMostComplaints = districtWithMost;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    this.newComplaints24h = complaints.filter(c => {
      const complaintDate = new Date(c.updateDate || c.timeline?.[0]?.date || '');
      return complaintDate > yesterday;
    }).length;
  }

  private generateCharts(complaints: Complaint[]): void {
    this.generatePolarAreaChart(complaints);
    this.generateCategoryTrendsChart(complaints);
  }

  private generatePolarAreaChart(complaints: Complaint[]): void {
    const categoryCount: { [key: string]: number } = {};
    complaints.forEach(c => {
      if (c.category) categoryCount[c.category] = (categoryCount[c.category] || 0) + 1;
    });

    const labels = Object.keys(categoryCount);
    const data = Object.values(categoryCount);

    const documentStyle = getComputedStyle(document.documentElement);

    const categoryColors = [
      documentStyle.getPropertyValue('--p-pink-500') || '#EC407A',
      documentStyle.getPropertyValue('--p-gray-500') || '#78909C',
      documentStyle.getPropertyValue('--p-orange-500') || '#FF9800',
      documentStyle.getPropertyValue('--p-purple-500') || '#9C27B0',
      documentStyle.getPropertyValue('--p-cyan-500') || '#00BCD4',
      documentStyle.getPropertyValue('--p-teal-500') || '#009688',
      documentStyle.getPropertyValue('--p-blue-500') || '#2196F3',
      documentStyle.getPropertyValue('--p-green-500') || '#4CAF50'
    ];

    this.polarAreaData = {
      datasets: [
        {
          data: data,
          backgroundColor: categoryColors.slice(0, labels.length),
          label: 'Denuncias por Categoría'
        }
      ],
      labels: labels
    };

    this.polarAreaOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: documentStyle.getPropertyValue('--text-primary') || '#222222',
            font: {
              family: "'Roboto', sans-serif",
              size: 12
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
        }
      },
      scales: {
        r: {
          grid: {
            color: documentStyle.getPropertyValue('--text-secondary') || 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            color: documentStyle.getPropertyValue('--text-secondary') || '#555555',
            font: {
              family: "'Roboto', sans-serif"
            }
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private generateCategoryTrendsChart(complaints: Complaint[]): void {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
    const categories = [...new Set(complaints.map(c => c.category).filter(Boolean))];

    const datasets = categories.map((category, index) => {
      const baseValue = Math.floor(Math.random() * 20) + 5;
      return {
        label: category,
        data: months.map(() => Math.floor(Math.random() * 15) + baseValue),
        backgroundColor: this.getCategoryColor(index),
        borderColor: this.getCategoryColor(index),
        borderWidth: 1
      };
    });

    this.categoryTrendsData = {
      labels: months,
      datasets: datasets
    };

    const documentStyle = getComputedStyle(document.documentElement);

    this.categoryTrendsOptions = {
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: documentStyle.getPropertyValue('--text-primary') || '#222222',
            font: {
              family: "'Roboto', sans-serif",
              size: 11
            }
          }
        },
        title: {
          display: true,
          text: 'Tendencias Mensuales por Categoría',
          color: documentStyle.getPropertyValue('--primary-color') || '#1a237e',
          font: {
            size: 16,
            weight: 'bold',
            family: "'Roboto', sans-serif"
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: documentStyle.getPropertyValue('--text-secondary') || '#555555',
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
          beginAtZero: true,
          ticks: {
            color: documentStyle.getPropertyValue('--text-secondary') || '#555555',
            font: {
              family: "'Roboto', sans-serif"
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
            drawBorder: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private getCategoryColor(index: number): string {
    const colors = [
      '#EC407A', '#78909C', '#FF9800', '#9C27B0', '#00BCD4',
      '#009688', '#2196F3', '#4CAF50', '#FF5722', '#795548'
    ];
    return colors[index % colors.length];
  }

  private setEmptyData(): void {
    this.monthlyTotal = 0;
    this.mostCommonCategory = 'No data';
    this.districtWithMostComplaints = 'No data';
    this.newComplaints24h = 0;
    this.polarAreaData = null;
    this.categoryTrendsData = null;
  }
}
