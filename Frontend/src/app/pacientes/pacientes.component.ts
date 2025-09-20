import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PacientesService } from '../services/pacientes.service';
import { Paciente } from '../models/paciente.model';

@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent {
  pacientes: Paciente[] = [];
  error = '';

  showFormModal = false;
  form: FormGroup;
  editingPaciente: Paciente | null = null;

  showDeleteModal = false;
  deletingPaciente: Paciente | null = null;

  constructor(
    private service: PacientesService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      telefono: ['']
    });
    this.load();
  }

  load() {
    this.service.getAll().subscribe({
      next: data => this.pacientes = data,
      error: () => this.error = 'Error cargando pacientes'
    });
  }

  openNew() {
    this.editingPaciente = null;
    this.form.reset();
    this.showFormModal = true;
  }

  openEdit(p: Paciente) {
    this.editingPaciente = p;
    this.form.patchValue({
      nombre: p.nombre,
      apellido: p.apellido,
      fecha_nacimiento: p.fecha_nacimiento.split('T')[0],
      telefono: p.telefono
    });
    this.showFormModal = true;
  }

  save() {
    if (this.form.valid) {
      const value = this.form.value;
      if (this.editingPaciente) {
        this.service.update(this.editingPaciente.paciente_id, value).subscribe({
          next: () => { this.load(); this.showFormModal = false; },
          error: () => this.error = 'Error actualizando paciente'
        });
      } else {
        this.service.create(value).subscribe({
          next: () => { this.load(); this.showFormModal = false; },
          error: () => this.error = 'Error creando paciente'
        });
      }
    }
  }

  confirmDelete(p: Paciente) {
    this.deletingPaciente = p;
    this.showDeleteModal = true;
  }

  delete() {
    if (this.deletingPaciente) {
      this.service.delete(this.deletingPaciente.paciente_id).subscribe({
        next: () => { this.load(); this.showDeleteModal = false; },
        error: () => this.error = 'Error eliminando paciente'
      });
    }
  }

  cancel() {
    this.showFormModal = false;
    this.showDeleteModal = false;
  }
}