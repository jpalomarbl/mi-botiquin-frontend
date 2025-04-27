import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText',
  standalone: true
})
export class ShortenTextPipe implements PipeTransform {

  transform(value: string | null | undefined, characers: number = 30): string {
    if (!value) return '';
    else if (value.length <= characers) return value;
    else return value.slice(0, characers) + "\u2026";
  }
}
