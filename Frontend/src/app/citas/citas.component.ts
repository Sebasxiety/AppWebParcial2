import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CitasService } from '../services/citas.service';
import { PacientesService } from '../services/pacientes.service';
import { DoctoresService } from '../services/doctores.service';
import { Cita, Paciente, Doctor } from '../models/cita.model';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  citas: Cita[] = [];
  pacientes: Paciente[] = [];
  doctores: Doctor[] = [];
  error = '';

  showFormModal = false;
  form: FormGroup;
  editingCita: Cita | null = null;

  showDeleteModal = false;
  deletingCita: Cita | null = null;

  constructor(
    private citasService: CitasService,
    private pacientesService: PacientesService,
    private doctoresService: DoctoresService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      paciente_id: ['', Validators.required],
      doctor_id: ['', Validators.required],
      fecha_hora_cita: ['', Validators.required],
      motivo_consulta: ['', Validators.required],
      estado: ['Programada', Validators.required]
    });
  }

  ngOnInit() {
    this.load();
    this.pacientesService.getAll().subscribe({
      next: data => this.pacientes = data,
      error: () => this.error = 'Error cargando pacientes'
    });
    this.doctoresService.getAll().subscribe({
      next: data => this.doctores = data,
      error: () => this.error = 'Error cargando doctores'
    });
  }

  load() {
    this.citasService.getAll().subscribe({
      next: data => this.citas = data,
      error: () => this.error = 'Error cargando citas'
    });
  }

  openNew() {
    this.editingCita = null;
    this.form.reset({ estado: 'Programada' });
    this.showFormModal = true;
  }

  openEdit(c: Cita) {
    this.editingCita = c;
    this.form.patchValue({
      paciente_id: c.paciente_id,
      doctor_id: c.doctor_id,
      fecha_hora_cita: c.fecha_hora_cita.split('T')[0] + 'T' + c.fecha_hora_cita.split('T')[1]?.substring(0,5),
      motivo_consulta: c.motivo_consulta,
      estado: c.estado
    });
    this.showFormModal = true;
  }

  save() {
    if (this.form.valid) {
      const value = this.form.value;
      if (this.editingCita) {
        this.citasService.update(this.editingCita.cita_id, value).subscribe({
          next: () => { this.load(); this.showFormModal = false; },
          error: () => this.error = 'Error actualizando cita'
        });
      } else {
        this.citasService.create(value).subscribe({
          next: () => { this.load(); this.showFormModal = false; },
          error: () => this.error = 'Error creando cita'
        });
      }
    }
  }

  confirmDelete(c: Cita) {
    this.deletingCita = c;
    this.showDeleteModal = true;
  }

  delete() {
    if (this.deletingCita) {
      this.citasService.delete(this.deletingCita.cita_id).subscribe({
        next: () => { this.load(); this.showDeleteModal = false; },
        error: () => this.error = 'Error eliminando cita'
      });
    }
  }

  cancel() {
    this.showFormModal = false;
    this.showDeleteModal = false;
  }
}
