import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate',
  pure: true,
  standalone: true
})
export class FormattedDatePipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';

    const date = new Date(value);

    // Format the date to "May 9, 2025"
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options);
  }
}
