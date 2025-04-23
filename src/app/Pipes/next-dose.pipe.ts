import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nextDose',
  standalone: true,
})
export class NextDosePipe implements PipeTransform {

  transform(startDateTime: Date,
    endDateTime: Date,
    frequency: number,
    frequencyUnit: string): Date {
      if (!startDateTime || !endDateTime || !frequency) {
        return new Date(); // Devuelve la hora actual si falta algún dato
      }

      const startTime = new Date(startDateTime).getTime();
      const endTime = new Date(endDateTime).getTime();
      const now = new Date().getTime();

      // Calcula el tiempo entre dosis en milisegundos
      let frequencyInMs: number;
      switch (frequencyUnit) {
        case 'minutes':
          frequencyInMs = frequency * 60 * 1000;
          break;
        case 'hours':
          frequencyInMs = frequency * 60 * 60 * 1000;
          break;
        case 'days':
          frequencyInMs = frequency * 24 * 60 * 60 * 1000;
          break;
        default:
          frequencyInMs = 0; // Frecuencia no válida
      }

      if (frequencyInMs <= 0) {
        return new Date(); // Si la frecuencia no es válida, devuelve ahora
      }

      // Calcula cuántas dosis han ocurrido desde el inicio hasta ahora
      const elapsedTime = now - startTime;
      const dosesTaken = Math.floor(elapsedTime / frequencyInMs);

      // La próxima dosis es la siguiente después de la última tomada
      const nextDoseTime = startTime + (dosesTaken + 1) * frequencyInMs;

      // Asegura que la próxima dosis sea hoy (misma fecha que 'now')
      const nextDoseDate = new Date(nextDoseTime);
      const today = new Date();
      if (
        nextDoseDate.getDate() !== today.getDate() ||
        nextDoseDate.getMonth() !== today.getMonth() ||
        nextDoseDate.getFullYear() !== today.getFullYear()
      ) {
        // Si no es hoy, ajusta a la primera dosis del día siguiente (opcional)
        return new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1, // Día siguiente
          new Date(startTime).getHours(),
          new Date(startTime).getMinutes(),
          0
        );
      }

      return nextDoseDate;
  }

}
