import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComplaintsStore } from '../../../application/complaints-store';
import { ActivatedRoute, Router } from '@angular/router';
import { Complaint } from '../../../domain/model/complaint.entity';
import { CommonModule } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

interface Ubigeo {
  codigo: string;
  nombre: string;
  provincias?: Provincia[];
}

interface Provincia {
  codigo: string;
  nombre: string;
  distritos?: Distrito[];
}

interface Distrito {
  codigo: string;
  nombre: string;
}

@Component({
  selector: 'app-complaint-form',
  templateUrl: './complaint-form.html',
  styleUrl: './complaint-form.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    TranslatePipe
  ],
})

/**
 * @class ComplaintForm
 * @summary Component for creating and editing complaints.
 * @constructor
 * @param {FormBuilder} fb - FormBuilder for creating reactive forms.
 * @param {ComplaintsStore} store - Store for managing complaints.
 * @param {ActivatedRoute} route - ActivatedRoute for accessing route parameters.
 * @param {Router} router - Router for navigation.
 * @method ngOnInit - Initializes the component and sets up form controls.
 * @method onDepartmentChange - Updates provinces and districts based on selected department.
 * @param {string | null} departmentCode - The selected department code.
 * @method onProvinceChange - Updates districts based on selected province.
 * @param {string | null} provinceCode - The selected province code.
 * @method submitComplaint - Submits the complaint form, either creating a new complaint or updating an existing one.
 * @method saveDraft - Saves the current form data as a draft in local storage.
 * @method getFormErrors - Logs form validation errors for debugging purposes.
 */
export class ComplaintForm implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(ComplaintsStore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  categories = [
    'Infrastructure and Public Spaces',
    'Environment',
    'Citizen Security',
    'Transport and Mobility',
    'Public Health',
    'Urban Cleaning',
    'Public Transportation',
    'Others'
  ];

  departamentos: Ubigeo[] = [
    {
      codigo: '15',
      nombre: 'Lima',
      provincias: [
        {
          codigo: '1501',
          nombre: 'Lima',
          distritos: [
            { codigo: '150101', nombre: 'Lima' },
            { codigo: '150102', nombre: 'Ancón' },
            { codigo: '150103', nombre: 'Ate' },
            { codigo: '150104', nombre: 'Barranco' },
            { codigo: '150105', nombre: 'Breña' },
            { codigo: '150106', nombre: 'Carabayllo' },
            { codigo: '150107', nombre: 'Chaclacayo' },
            { codigo: '150108', nombre: 'Chorrillos' },
            { codigo: '150109', nombre: 'Cieneguilla' },
            { codigo: '150110', nombre: 'Comas' },
            { codigo: '150111', nombre: 'El Agustino' },
            { codigo: '150112', nombre: 'Independencia' },
            { codigo: '150113', nombre: 'Jesús María' },
            { codigo: '150114', nombre: 'La Molina' },
            { codigo: '150115', nombre: 'La Victoria' },
            { codigo: '150116', nombre: 'Lince' },
            { codigo: '150117', nombre: 'Los Olivos' },
            { codigo: '150118', nombre: 'Lurigancho' },
            { codigo: '150119', nombre: 'Lurín' },
            { codigo: '150120', nombre: 'Magdalena del Mar' },
            { codigo: '150121', nombre: 'Miraflores' },
            { codigo: '150122', nombre: 'Pachacámac' },
            { codigo: '150123', nombre: 'Pucusana' },
            { codigo: '150124', nombre: 'Pueblo Libre' },
            { codigo: '150125', nombre: 'Puente Piedra' },
            { codigo: '150126', nombre: 'Punta Hermosa' },
            { codigo: '150127', nombre: 'Punta Negra' },
            { codigo: '150128', nombre: 'Rímac' },
            { codigo: '150129', nombre: 'San Bartolo' },
            { codigo: '150130', nombre: 'San Borja' },
            { codigo: '150131', nombre: 'San Isidro' },
            { codigo: '150132', nombre: 'San Juan de Lurigancho' },
            { codigo: '150133', nombre: 'San Juan de Miraflores' },
            { codigo: '150134', nombre: 'San Luis' },
            { codigo: '150135', nombre: 'San Martín de Porres' },
            { codigo: '150136', nombre: 'San Miguel' },
            { codigo: '150137', nombre: 'Santa Anita' },
            { codigo: '150138', nombre: 'Santa María del Mar' },
            { codigo: '150139', nombre: 'Santa Rosa' },
            { codigo: '150140', nombre: 'Santiago de Surco' },
            { codigo: '150141', nombre: 'Surquillo' },
            { codigo: '150142', nombre: 'Villa El Salvador' },
            { codigo: '150143', nombre: 'Villa María del Triunfo' }
          ]
        },
        {
          codigo: '1502',
          nombre: 'Callao',
          distritos: [
            { codigo: '150201', nombre: 'Callao' },
            { codigo: '150202', nombre: 'Bellavista' },
            { codigo: '150203', nombre: 'Carmen de la Legua' },
            { codigo: '150204', nombre: 'La Perla' },
            { codigo: '150205', nombre: 'La Punta' },
            { codigo: '150206', nombre: 'Ventanilla' },
            { codigo: '150207', nombre: 'Mi Perú' }
          ]
        },
        {
          codigo: '1503',
          nombre: 'Barranca',
          distritos: [
            { codigo: '150301', nombre: 'Barranca' },
            { codigo: '150302', nombre: 'Paramonga' },
            { codigo: '150303', nombre: 'Pativilca' },
            { codigo: '150304', nombre: 'Supe' }
          ]
        }
      ]
    },
    {
      codigo: '07',
      nombre: 'Callao',
      provincias: [
        {
          codigo: '0701',
          nombre: 'Callao',
          distritos: [
            { codigo: '070101', nombre: 'Callao' },
            { codigo: '070102', nombre: 'Bellavista' },
            { codigo: '070103', nombre: 'Carmen de la Legua' },
            { codigo: '070104', nombre: 'La Perla' },
            { codigo: '070105', nombre: 'La Punta' },
            { codigo: '070106', nombre: 'Ventanilla' },
            { codigo: '070107', nombre: 'Mi Perú' }
          ]
        }
      ]
    },
    {
      codigo: '04',
      nombre: 'Arequipa',
      provincias: [
        {
          codigo: '0401',
          nombre: 'Arequipa',
          distritos: [
            { codigo: '040101', nombre: 'Arequipa' },
            { codigo: '040102', nombre: 'Alto Selva Alegre' },
            { codigo: '040103', nombre: 'Cayma' },
            { codigo: '040104', nombre: 'Cerro Colorado' },
            { codigo: '040105', nombre: 'Jacobo Hunter' },
            { codigo: '040106', nombre: 'José Luis Bustamante y Rivero' },
            { codigo: '040107', nombre: 'Mariano Melgar' },
            { codigo: '040108', nombre: 'Miraflores' },
            { codigo: '040109', nombre: 'Paucarpata' },
            { codigo: '040110', nombre: 'Sabandía' },
            { codigo: '040111', nombre: 'Sachaca' },
            { codigo: '040112', nombre: 'Socabaya' },
            { codigo: '040113', nombre: 'Tiabaya' },
            { codigo: '040114', nombre: 'Yanahuara' }
          ]
        }
      ]
    },
    {
      codigo: '08',
      nombre: 'Cusco',
      provincias: [
        {
          codigo: '0801',
          nombre: 'Cusco',
          distritos: [
            { codigo: '080101', nombre: 'Cusco' },
            { codigo: '080102', nombre: 'Ccorca' },
            { codigo: '080103', nombre: 'Poroy' },
            { codigo: '080104', nombre: 'San Jerónimo' },
            { codigo: '080105', nombre: 'San Sebastián' },
            { codigo: '080106', nombre: 'Santiago' },
            { codigo: '080107', nombre: 'Saylla' },
            { codigo: '080108', nombre: 'Wanchaq' }
          ]
        }
      ]
    },
    {
      codigo: '13',
      nombre: 'La Libertad',
      provincias: [
        {
          codigo: '1301',
          nombre: 'Trujillo',
          distritos: [
            { codigo: '130101', nombre: 'Trujillo' },
            { codigo: '130102', nombre: 'El Porvenir' },
            { codigo: '130103', nombre: 'Florencia de Mora' },
            { codigo: '130104', nombre: 'Huanchaco' },
            { codigo: '130105', nombre: 'La Esperanza' },
            { codigo: '130106', nombre: 'Laredo' },
            { codigo: '130107', nombre: 'Moche' },
            { codigo: '130108', nombre: 'Salaverry' },
            { codigo: '130109', nombre: 'Simbal' },
            { codigo: '130110', nombre: 'Victor Larco Herrera' }
          ]
        }
      ]
    },
    {
      codigo: '20',
      nombre: 'Piura',
      provincias: [
        {
          codigo: '2001',
          nombre: 'Piura',
          distritos: [
            { codigo: '200101', nombre: 'Piura' },
            { codigo: '200102', nombre: 'Castilla' },
            { codigo: '200103', nombre: 'Catacaos' },
            { codigo: '200104', nombre: 'Cura Mori' },
            { codigo: '200105', nombre: 'El Tallán' },
            { codigo: '200106', nombre: 'La Arena' },
            { codigo: '200107', nombre: 'La Unión' },
            { codigo: '200108', nombre: 'Las Lomas' },
            { codigo: '200109', nombre: 'Tambo Grande' }
          ]
        }
      ]
    },
    {
      codigo: '14',
      nombre: 'Lambayeque',
      provincias: [
        {
          codigo: '1401',
          nombre: 'Chiclayo',
          distritos: [
            { codigo: '140101', nombre: 'Chiclayo' },
            { codigo: '140102', nombre: 'Chongoyape' },
            { codigo: '140103', nombre: 'Eten' },
            { codigo: '140104', nombre: 'José Leonardo Ortiz' },
            { codigo: '140105', nombre: 'La Victoria' },
            { codigo: '140106', nombre: 'Lagunas' },
            { codigo: '140107', nombre: 'Monsefú' },
            { codigo: '140108', nombre: 'Nueva Arica' },
            { codigo: '140109', nombre: 'Oyotún' },
            { codigo: '140110', nombre: 'Picsi' },
            { codigo: '140111', nombre: 'Pimentel' },
            { codigo: '140112', nombre: 'Reque' },
            { codigo: '140113', nombre: 'Santa Rosa' },
            { codigo: '140114', nombre: 'Saña' },
            { codigo: '140115', nombre: 'Cayaltí' },
            { codigo: '140116', nombre: 'Pátapo' },
            { codigo: '140117', nombre: 'Pomalca' },
            { codigo: '140118', nombre: 'Pucalá' },
            { codigo: '140119', nombre: 'Tumán' }
          ]
        }
      ]
    }
  ];

  provincias: Provincia[] = [];
  distritos: Distrito[] = [];

  // Estado de edición e id de la denuncia
  isEditMode = false;
  complaintId: string | null = null;

  form = this.fb.group({
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    department: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    province: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    district: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    location: new FormControl<string>('', {
      nonNullable: true
    }),
    referenceInfo: new FormControl<string>('', {
      nonNullable: true
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(10)]
    }),
    evidence: new FormControl<string>('', {
      nonNullable: true
    }),
    priority: new FormControl<string>('Standard', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    anonymous: new FormControl<boolean>(false),
    termsAccepted: new FormControl<boolean>(false, {
      validators: [Validators.requiredTrue]
    })
  });

  // Establecer estado inicial: si no hay provincias/distritos, deshabilitar los controles
  constructor() {
    // Deshabilitar controles dependientes hasta que haya opciones
    this.form.get('province')?.disable();
    this.form.get('district')?.disable();

    this.route.params.subscribe(params => {
      this.complaintId = params['id'] ?? null;
      this.isEditMode = !!this.complaintId;
      if (this.isEditMode) {
        this.loadComplaintForEdit();
      }
    });
  }

  ngOnInit(): void {
    this.form.get('department')?.valueChanges.subscribe(deptCode => {
      this.onDepartmentChange(deptCode);
    });

    this.form.get('province')?.valueChanges.subscribe(provCode => {
      this.onProvinceChange(provCode);
    });
  }

  onDepartmentChange(departmentCode: string | null): void {
    if (departmentCode) {
      const departamento = this.departamentos.find(d => d.codigo === departmentCode);
      this.provincias = departamento?.provincias || [];

      this.form.patchValue({
        province: '',
        district: ''
      });
      this.distritos = [];

      // Habilitar o deshabilitar el control de provincia según disponibilidad
      if (this.provincias.length > 0) {
        this.form.get('province')?.enable();
      } else {
        this.form.get('province')?.disable();
      }

      // Al cambiar departamento, siempre deshabilitar distrito hasta que provincia se seleccione
      this.form.get('district')?.disable();
    } else {
      this.provincias = [];
      this.distritos = [];
      this.form.patchValue({ province: '', district: '' });
      this.form.get('province')?.disable();
      this.form.get('district')?.disable();
    }
  }

  onProvinceChange(provinceCode: string | null): void {
    if (provinceCode) {
      const provincia = this.provincias.find(p => p.codigo === provinceCode);
      this.distritos = provincia?.distritos || [];

      this.form.patchValue({
        district: ''
      });

      // Habilitar o deshabilitar el control de distrito según disponibilidad
      if (this.distritos.length > 0) {
        this.form.get('district')?.enable();
      } else {
        this.form.get('district')?.disable();
      }
    } else {
      this.distritos = [];
      this.form.patchValue({ district: '' });
      this.form.get('district')?.disable();
    }
  }
  getDepartamentoNombre(codigo: string): string {
    const dept = this.departamentos.find(d => d.codigo === codigo);
    return dept ? dept.nombre : codigo
  }

  getProvinciaNombre(codigo: string): string {
    const prov = this.provincias.find(p => p.codigo === codigo);
    return prov ? prov.nombre : codigo;
  }

  getDistritoNombre(codigo: string): string {
    const dist = this.distritos.find(d => d.codigo === codigo);
    return dist ? dist.nombre : codigo;
  }
  private loadComplaintForEdit(): void {
    const complaint = this.store.getComplaintById(this.complaintId!)();
    if (complaint) {
      const evidenceString = complaint.evidence?.join(', ') || '';

      this.form.patchValue({
        category: complaint.category,
        department: complaint.department,
        province: complaint.city || '',
        district: complaint.district,
        location: complaint.location,
        referenceInfo: complaint.referenceInfo,
        description: complaint.description,
        evidence: evidenceString,
        priority: complaint.priority,
        anonymous: false,
        termsAccepted: true
      });

      if (complaint.department) {
        this.onDepartmentChange(complaint.department);
        if (complaint.city) {
          this.onProvinceChange(complaint.city);
        }
      }
    }
  }submitComplaint() {
    if (this.form.invalid) {
      this.markAllFieldsAsTouched();
      alert('Por favor, complete todos los campos requeridos correctamente.');
      return;
    }

    try {
      const evidenceArray = this.form.value.evidence
        ? this.form.value.evidence.split(',').map(item => item.trim()).filter(item => item !== '')
        : [];

      const departamentoNombre = this.getDepartamentoNombre(this.form.value.department!);
      const provinciaNombre = this.getProvinciaNombre(this.form.value.province!);
      const distritoNombre = this.getDistritoNombre(this.form.value.district!);



      const complaintData = {
        id: this.complaintId || this.generateId(),
        category: this.form.value.category!,
        department: departamentoNombre,
        city: provinciaNombre,
        district: distritoNombre,
        location: this.form.value.location || `${departamentoNombre}, ${provinciaNombre}, ${distritoNombre}`,
        referenceInfo: this.form.value.referenceInfo!,
        description: this.form.value.description!,
        status: 'Pending' as const,
        priority: this.form.value.priority! as 'Standard' | 'Urgent' | 'Critical',
        evidence: evidenceArray,
        assignedTo: 'Not assigned',
        updateMessage: '',
        updateDate: new Date().toISOString(),
        timeline: [
          {
            status: 'Complaint registered',
            date: new Date().toISOString(),
            completed: true,
            current: true,
            waitingDecision: false
          },
          {
            status: 'Under review',
            date: '',
            completed: false,
            current: false,
            waitingDecision: false
          },
          {
            status: 'Awaiting response',
            date: '',
            completed: false,
            current: false,
            waitingDecision: false
          },
          {
            status: 'Decision pending',
            date: '2025-10-07T20:19:00',
            completed: false,
            current: false,
            waitingDecision: true
          },
          {
            status: 'Completed',
            date: '',
            completed: false,
            current: false,
            waitingDecision: false
          }
        ]
      };



      const complaint = new Complaint(complaintData);

      if (this.isEditMode) {
        this.store.updateComplaint(complaint);
      } else {
        this.store.addComplaint(complaint);
      }

      this.router.navigate(['/complaints']).then(() => {
        alert('Denuncia ' + (this.isEditMode ? 'actualizada' : 'enviada') + ' correctamente ✅');
      });

    } catch (error) {
      alert('Error al procesar la denuncia. Por favor, intente nuevamente.');
    }
  }
  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  private generateId(): string {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return randomNum.toString();
  }

  saveDraft() {
    const draftData = {
      ...this.form.value,
      status: 'Draft' as const,
      savedAt: new Date().toISOString()
    };

    alert('Borrador guardado correctamente 📝');

    localStorage.setItem('complaintDraft', JSON.stringify(draftData));
  }

  getFormErrors(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.errors) {
      }
    });
  }
}
