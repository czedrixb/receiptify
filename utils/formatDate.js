export function formatDate(date) {
    const formatter = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'Asia/Singapore'
    });

    const parts = formatter.formatToParts(date);
    const dayOfWeek = parts.find(part => part.type === 'weekday').value.toUpperCase();
    const month = parts.find(part => part.type === 'month').value.toUpperCase();
    const day = parts.find(part => part.type === 'day').value;
    const year = parts.find(part => part.type === 'year').value;

    return `${dayOfWeek}, ${month} ${day}, ${year}`;
}
