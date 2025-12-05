import { Component } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces para tipagem
interface Pet {
  name: string;
  species: string;
  owner: string;
  lastVisit: Date;
}

interface Appointment {
  pet: string;
  time: string;
  vet: string;
  date: Date;
}

interface Notification {
  message: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, KeyValuePipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  title = 'Clínica Veterinária - Dashboard';
  sidebarOpen = true;

  stats = {
    totalPets: 121,
    totalOwners: 80,
    appointmentsToday: 16,
    availableSlots: 5
  };

  notifications: Notification[] = [
    { message: 'Consulta do Rex às 10:00', date: new Date('2025-09-17T10:00:00') },
    { message: 'Vacinação da Bella concluída', date: new Date('2025-09-17T11:30:00') },
    { message: 'Novo cadastro de pet: Thor', date: new Date('2025-09-17T09:15:00') },
    { message: 'Novo cadastro de pet: Paçoca', date: new Date('2025-09-17T09:10:00') }
  ];

  pets: Pet[] = [
    { name: 'Rex', species: 'Cão', owner: 'Carlos', lastVisit: new Date('2025-09-10') },
    { name: 'Mia', species: 'Gato', owner: 'Ana', lastVisit: new Date('2025-09-12') },
    { name: 'Bella', species: 'Cão', owner: 'Juliana', lastVisit: new Date('2025-09-15') },
    { name: 'Paçoca', species: 'Cão', owner: 'Cintia', lastVisit: new Date('2025-09-15') }
  ];

  appointments: Appointment[] = [
    { pet: 'Rex', time: '10:00', vet: 'Dr. Pedro', date: new Date('2025-09-18') },
    { pet: 'Mia', time: '11:00', vet: 'Dra. Luana', date: new Date('2025-09-19') },
    { pet: 'Bella', time: '14:00', vet: 'Dr. Pedro', date: new Date('2025-09-20') }
  ];

  newAppointment: Appointment = { pet: '', time: '', vet: '', date: new Date() };
  newPet: Pet = { name: '', species: '', owner: '', lastVisit: new Date() };

  editIndex: number | null = null;
  showAddPetForm = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  clearNotifications() {
    this.notifications = [];
  }

  saveAppointment() {
    if (!this.newAppointment.pet || !this.newAppointment.time || !this.newAppointment.vet || !this.newAppointment.date) return;

    if (this.editIndex !== null) {
      this.appointments[this.editIndex] = { ...this.newAppointment };
      this.notifications.push({
        message: `Consulta editada: ${this.newAppointment.pet} em ${this.newAppointment.date.toLocaleDateString()} às ${this.newAppointment.time}`,
        date: new Date()
      });
      this.editIndex = null;
    } else {
      this.appointments.push({ ...this.newAppointment });
      this.stats.appointmentsToday++;
      this.notifications.push({
        message: `Nova consulta: ${this.newAppointment.pet} em ${this.newAppointment.date.toLocaleDateString()} às ${this.newAppointment.time}`,
        date: new Date()
      });
    }
    this.newAppointment = { pet: '', time: '', vet: '', date: new Date() };
  }

  editAppointment(index: number) {
    const appt = this.appointments[index];
    this.newAppointment = { ...appt };
    this.editIndex = index;
  }

  deleteAppointment(index: number) {
    const removed = this.appointments.splice(index, 1)[0];
    this.stats.appointmentsToday = Math.max(0, this.stats.appointmentsToday - 1);
    this.notifications.push({
      message: `Consulta excluída: ${removed.pet} em ${removed.date.toLocaleDateString()} às ${removed.time}`,
      date: new Date()
    });

    if (this.editIndex === index) this.editIndex = null;
  }

  addPet() {
    if (!this.newPet.name || !this.newPet.species || !this.newPet.owner) return;

    this.pets.push({ ...this.newPet, lastVisit: new Date() });
    this.stats.totalPets++;
    this.notifications.push({
      message: `Novo pet cadastrado: ${this.newPet.name} (${this.newPet.species})`,
      date: new Date()
    });
    this.newPet = { name: '', species: '', owner: '', lastVisit: new Date() };
    this.showAddPetForm = false;
  }
}