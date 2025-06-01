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
        return new Date();
      }

      const startTime = new Date(startDateTime).getTime();
      const endTime = new Date(endDateTime).getTime();
      const now = new Date().getTime();

      // Gets time between doses in ms
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
          frequencyInMs = 0;
      }

      if (frequencyInMs <= 0) {
        return new Date();
      }

      // Calculates how many doses have been since the start date
      if (now < startTime) {
        return new Date();
      }
      const elapsedTime = now - startTime;
      const dosesTaken = Math.floor(elapsedTime / frequencyInMs);

      // The next dose is the one after the last consumed
      const nextDoseTime = startTime + (dosesTaken + 1) * frequencyInMs;

      // Makes sure that the next dose is today (same date as 'now')
      const nextDoseDate = new Date(nextDoseTime);
      const today = new Date();
      if (
        nextDoseDate.getDate() !== today.getDate() ||
        nextDoseDate.getMonth() !== today.getMonth() ||
        nextDoseDate.getFullYear() !== today.getFullYear()
      ) {
        // If dose is not today, adjust to the first dose of the next day
        return new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1,
          new Date(startTime).getHours(),
          new Date(startTime).getMinutes(),
          0
        );
      }

      return nextDoseDate;
    }

}
