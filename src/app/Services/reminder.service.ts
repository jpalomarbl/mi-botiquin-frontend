import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from 'src/app/environment/environment';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrl = environment.api_url + '/reminder';
  user$ = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store<GlobalStateDTO>) {}

  fetchUserRemindersForToday(userId: number): Observable<ReminderDTO[]> {
    const response = this.http.get<ReminderDTO[]>(`${this.apiUrl}/today/user`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });

    return response;
  }

  fetchAllUserReminders(userId: number): Observable<ReminderDTO[]> {
    const response = this.http.get<ReminderDTO[]>(`${this.apiUrl}/user`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });

    return response;
  }

  getLastDoseTime(
    currentTime: Date,
    startTime: Date,
    frequency: number,
    frequencyUnit: string
  ): Date {
    // Calcular la diferencia total en milisegundos
    const diffMs = currentTime.getTime() - startTime.getTime();

    // Convertir a la unidad de frecuencia correspondiente
    let diffUnits: number;
    switch (frequencyUnit) {
      case 'minutes':
        diffUnits = diffMs / (1000 * 60); // milisegundos a minutos
        break;
      case 'hours':
        diffUnits = diffMs / (1000 * 60 * 60); // milisegundos a horas
        break;
      case 'days':
        diffUnits = diffMs / (1000 * 60 * 60 * 24); // milisegundos a días
        break;
      default:
        throw new Error('Unidad de frecuencia no válida');
    }

    // Calcular cuántos periodos completos han pasado
    const completePeriods = Math.floor(diffUnits / frequency);

    // Calcular milisegundos desde la última toma
    const msSinceLastDose = completePeriods * frequency;
    let lastDoseMs: number;

    // Convertir de vuelta a milisegundos según la unidad
    switch (frequencyUnit) {
      case 'minutes':
        lastDoseMs = msSinceLastDose * 1000 * 60;
        break;
      case 'hours':
        lastDoseMs = msSinceLastDose * 1000 * 60 * 60;
        break;
      case 'days':
        lastDoseMs = msSinceLastDose * 1000 * 60 * 60 * 24;
        break;
    }

    // Calcular la fecha/hora exacta de la última toma
    const lastDoseTime = new Date(startTime.getTime() + lastDoseMs);

    return lastDoseTime;
  }
}
