import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenText',
  standalone: true
})
export class ShortenTextPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';
    else return value.slice(0, 30) + "\u2026";
  }
}
