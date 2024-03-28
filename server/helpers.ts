import { DateTime } from 'luxon';

// Log all requests to the server
export function standardFormatDate(date: DateTime<boolean>): string {
    return date.toLocaleString(
        {
            weekday: 'short', month: 'short',
            day: '2-digit', hour: '2-digit',
            minute: '2-digit', second: '2-digit',
            timeZoneName: 'short'
        });
}
