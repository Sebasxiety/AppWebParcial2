import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/auth.guard';
import { PacientesComponent } from './pacientes/pacientes.component';
import { DoctoresComponent } from './doctores/doctores.component';
import { DashboardHomeComponent } from './dashboard/home.component';
import { CitasComponent } from './citas/citas.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'pacientes', component: PacientesComponent },
      { path: 'doctores', component: DoctoresComponent },
      { path: 'citas', component: CitasComponent }
      // Añadir más rutas hijas aquí: citas, doctores, etc.
    ]
  },
  // { path: 'pacientes', component: PacientesComponent, canActivate: [AuthGuard] },
  // { path: 'citas', component: CitasComponent, canActivate: [AuthGuard] },
  // { path: 'doctores', component: DoctoresComponent, canActivate: [AuthGuard] },
  // { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login' } // Ruta comodín para redirigir rutas no encontradas
];
