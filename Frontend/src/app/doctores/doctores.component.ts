import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctoresService } from '../services/doctores.service';
import { Doctor } from '../models/doctor.model';

@Component({
  selector: 'app-doctores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './doctores.component.html',
  styleUrls: ['./doctores.component.css']
})
export class DoctoresComponent {
  doctores: Doctor[] = [];
  error = '';

  showFormModal = false;
  form: FormGroup;
  editingDoctor: Doctor | null = null;

  showDeleteModal = false;
  deletingDoctor: Doctor | null = null;

  constructor(
    private service: DoctoresService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      usuario_id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      especialidad: ['', Validators.required],
      telefono: ['']
    });
    this.load();
  }

  load() {
    this.service.getAll().subscribe({
      next: data => this.doctores = data,
      error: () => this.error = 'Error cargando doctores'
    });
  }

  openNew() {
    this.editingDoctor = null;
    this.form.reset();
    this.showFormModal = true;
  }

  openEdit(d: Doctor) {
    this.editingDoctor = d;
    this.form.patchValue({
      usuario_id: d.usuario_id,
      nombre: d.nombre,
      apellido: d.apellido,
      especialidad: d.especialidad,
      telefono: d.telefono
    });
    this.showFormModal = true;
  }

  save() {
    if (this.form.valid) {
      const value = this.form.value;
      if (this.editingDoctor) {
        this.service.update(this.editingDoctor.doctor_id, value).subscribe({
          next: () => { this.load(); this.showFormModal = false; },
          error: () => this.error = 'Error actualizando doctor'
        });
      } else {
        this.service.create(value).subscribe({
          next: () => { this.load(); this.showFormModal = false; },
          error: () => this.error = 'Error creando doctor'
        });
      }
    }
  }

  confirmDelete(d: Doctor) {
    this.deletingDoctor = d;
    this.showDeleteModal = true;
  }

  delete() {
    if (this.deletingDoctor) {
      this.service.delete(this.deletingDoctor.doctor_id).subscribe({
        next: () => { this.load(); this.showDeleteModal = false; },
        error: () => this.error = 'Error eliminando doctor'
      });
    }
  }

  cancel() {
    this.showFormModal = false;
    this.showDeleteModal = false;
  }
}