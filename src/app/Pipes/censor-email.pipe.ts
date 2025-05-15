import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'censorEmail',
  standalone: true
})
export class CensorEmailPipe implements PipeTransform {
  transform(email: string): string {
    if (!email || typeof email !== 'string' || !this.isValidEmail(email)) {
      return email;
    }

    const [localPart, domain] = email.split('@');

    if (localPart.length <= 2) {
      return `${localPart.charAt(0)}****@${domain}`;
    } else if (localPart.length >= 25) {
      return `${localPart.charAt(0)}****${localPart.charAt(localPart.length - 1)}@${domain}`;
    }

    const firstChar = localPart.charAt(0);
    const lastChar = localPart.charAt(localPart.length - 1);
    const censoredPart = '*'.repeat(localPart.length - 2);

    return `${firstChar}${censoredPart}${lastChar}@${domain}`;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
