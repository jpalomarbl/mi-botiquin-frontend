import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from 'src/app/environment/environment';
import { GlobalStateDTO } from 'src/app/Models/globalState.dto';
import { ReminderDTO } from 'src/app/Models/reminder.dto';
import { selectUser } from 'src/app/Store/auth/selectors/auth.selectors';
import { ConsumptionDTO } from '../Models/consumption.dto';
import { organizedRemindersObject } from '../Models/medicineState.dto';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  private apiUrlReminder = environment.api_url + '/reminder';
  private apiUrlConsumption = environment.api_url + '/consumption';
  user$ = this.store.select(selectUser);

  constructor(private http: HttpClient, private store: Store<GlobalStateDTO>) {}

  fetchUserRemindersForToday(userId: number): Observable<ReminderDTO[]> {
    const response = this.http.get<ReminderDTO[]>(
      `${this.apiUrlReminder}/today/user`,
      {
        withCredentials: true,
        params: { userId: userId.toString() },
      }
    );

    return response;
  }

  fetchAllUserReminders(userId: number): Observable<ReminderDTO[]> {
    return this.http.get<ReminderDTO[]>(`${this.apiUrlReminder}/user`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });
  }

  fetchAllUserConsumptions(userId: number): Observable<ConsumptionDTO[]> {
    return this.http.get<ConsumptionDTO[]>(`${this.apiUrlConsumption}/user`, {
      withCredentials: true,
      params: { userId: userId.toString() },
    });
  }

  changeReminderState(
    reminderId: number,
    time: Date,
    status: boolean
  ): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('reminderId', reminderId.toString());
    body.set('consumptionDate', time.toString());

    if (!status) {
      return this.http.post<any>(`${this.apiUrlConsumption}`, body.toString(), {
        withCredentials: true,
        headers: headers,
      });
    } else {
      return this.http.delete<any>(`${this.apiUrlConsumption}`, {
        body: body.toString(),
        withCredentials: true,
        headers: headers,
      });
    }
  }

  addReminder(
    reminder: ReminderDTO,
    medicineId: number
  ): Observable<ReminderDTO> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('frequency', reminder.frequency.toString());
    body.set('frequencyUnit', reminder.frequencyUnit);
    body.set('start', reminder.start.toString());
    body.set(
      'finish',
      reminder.finish ? reminder.finish.toString() : String(null)
    );
    body.set('amount', reminder.amount.toString());
    body.set('medicineId', medicineId.toString());

    return this.http.post<any>(`${this.apiUrlReminder}`, body.toString(), {
      withCredentials: true,
      headers: headers,
    });
  }

  updateReminder(
    reminder: ReminderDTO,
    medicineId: number
  ): Observable<ReminderDTO> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('reminderId', reminder.id!.toString());
    body.set('frequency', reminder.frequency.toString());
    body.set('frequencyUnit', reminder.frequencyUnit);
    body.set('start', reminder.start.toString());
    body.set('finish', reminder.finish!.toString());
    body.set('amount', reminder.amount.toString());

    return this.http.put<any>(`${this.apiUrlReminder}`, body.toString(), {
      withCredentials: true,
      headers: headers,
    });
  }

  deleteReminder(reminderId: number): Observable<any> {
    const headers = new HttpHeaders().set(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );

    const body = new URLSearchParams();
    body.set('reminderId', reminderId.toString());

    return this.http.delete<any>(`${this.apiUrlReminder}`, {
      body: body.toString(),
      withCredentials: true,
      headers: headers,
    });
  }

  getNextDoseTime(reminder: ReminderDTO, day: Date) {
    const startDate = new Date(reminder.start);

    const frequency = reminder.frequency;
    const frequencyUnit = reminder.frequencyUnit;
    const lastDose = this.getLastDoseTime(
      day,
      startDate,
      frequency,
      frequencyUnit
    );

    const nextDose = new Date(lastDose.getTime());

    switch (frequencyUnit) {
      case 'minutes':
        nextDose.setMinutes(nextDose.getMinutes() + frequency);
        break;

      case 'hours':
        nextDose.setHours(nextDose.getHours() + frequency);
        break;

      case 'days':
        nextDose.setDate(nextDose.getDate() + frequency);
        break;
    }

    return nextDose;
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

  organizeReminders(
    reminders: ReminderDTO[],
    consumptions: ConsumptionDTO[],
    day: Date
  ): Array<[Date, Array<[ReminderDTO, organizedRemindersObject]>] | null> {
    if (!reminders || reminders.length === 0) return [];

    // Procesamiento paralelo de los recordatorios
    const allDoses = reminders
      .flatMap((reminder) => {
        if (!reminder) return null;

        const doses: { time: Date; reminder: ReminderDTO }[] = [];
        let currentDate = new Date(day);
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);

        let nextDose = this.getNextDoseTime(reminder, currentDate);

        while (nextDose.getTime() <= nextDay.getTime()) {
          doses.push({
            time: new Date(nextDose),
            reminder: reminder,
          });

          // Actualizamos la fecha para la próxima dosis
          currentDate = new Date(nextDose);
          nextDose = this.getNextDoseTime(reminder, currentDate);
        }

        return doses;
      })
      .filter(Boolean) as { time: Date; reminder: ReminderDTO }[];

    console.log('ALL DOSES', allDoses);

    const ungrouped: Array<[Date, [ReminderDTO, organizedRemindersObject]]> =
      [];

    console.log('CONSUMPTIONS', consumptions);

    allDoses.forEach((dose) => {
      let item: [Date, [ReminderDTO, organizedRemindersObject]];
      // console.log('DOSE', dose);

      if (consumptions.length > 0) {
        consumptions.forEach((consumption, index) => {
          console.log('CONSUMPTION', consumption);
          if (
            consumption.consumptionDate.getTime() === dose.time.getTime() &&
            dose.reminder.id === consumption.reminderId
          ) {
            item = [
              dose.time,
              [
                dose.reminder,
                { consumed: true, subtracted: consumption.subtracted },
              ],
            ];
          }

          if (item && index === consumptions.length - 1) {
            ungrouped.push(item);
          } else if (!item && index === consumptions.length - 1) {
            item = [
              dose.time,
              [dose.reminder, { consumed: false, subtracted: null }],
            ];

            ungrouped.push(item);
          }
        });
      } else {
        item = [
          dose.time,
          [dose.reminder, { consumed: false, subtracted: null }],
        ];

        ungrouped.push(item);
      }
    });

    console.log('UNGROUPED,', ungrouped);

    const grouped: Array<
      [Date, Array<[ReminderDTO, organizedRemindersObject]>] | null
    > = [];
    const indexArray: Array<number> = [];

    for (let i = 0; i < ungrouped.length; i++) {
      if (!indexArray.includes(i)) {
        const group: [Date, Array<[ReminderDTO, organizedRemindersObject]>] = [
          ungrouped[i][0],
          [ungrouped[i][1]],
        ];

        for (let j = i + 1; j < ungrouped.length; j++) {
          if (ungrouped[j][0].getTime() === ungrouped[i][0].getTime()) {
            group[1].push(ungrouped[j][1]);

            indexArray.push(j);
          }

          if (j === ungrouped.length - 1) {
            grouped.push(group);
          }
        }
      }
    }

    console.log('GROUPED', grouped);

    return grouped;
  }
}
