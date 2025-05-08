import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: false, // Makes the pipe reactive to changes
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number): string {
    if (!value) return '';

    const now = new Date();
    const past = new Date(value);
    const diffMs = now.getTime() - past.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Format the time in hh:mm AM/PM format
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    const timeFormatted = past.toLocaleTimeString('en-US', options);

    // Build the time ago message
    let timeAgoMessage = '';
    if (days > 0) {
      timeAgoMessage = `${days} дн. тому`;
    } else if (hours > 0) {
      timeAgoMessage = `${hours} год. тому`;
    } else if (minutes > 0) {
      timeAgoMessage = `${minutes} хв. тому`;
    } else {
      timeAgoMessage = `щойно`;
    }

    return `${timeAgoMessage}, ${timeFormatted}`;
  }
}
