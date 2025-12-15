export const formatDate = (updatedAt: Date | string) => {
  if (!updatedAt) return '';

  const date = new Date(updatedAt);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    // Display time if it's today
    return date.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(now.getDate() - 7);

  if (date > oneWeekAgo) {
    // Display weekday name if it's within a week
    return date.toLocaleDateString('en-PK', { weekday: 'long' });
  }

  // Display date in DD/MM/YYYY format if itF's older than a week
  return date.toLocaleDateString('en-PK');
};

export const getDateRange = (started: Date, ended: Date) => {
  const startDate = formatDate(started);
  const endDate = ended ? formatDate(ended) : 'Present';

  if (!startDate && !endDate) return '';
  if (!startDate) return endDate;
  if (endDate === 'Present' || !ended) return `${startDate} - Present`;

  return `${startDate} - ${endDate}`;
};

export const getDuration = (started: Date, ended: Date) => {
  if (!started) return '';

  const startDate = new Date(started);
  const endDate = ended ? new Date(ended) : new Date();

  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

  if (diffMonths < 12) {
    return `${diffMonths} mo${diffMonths === 1 ? '' : 's'}`;
  }

  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  if (months === 0) {
    return `${years} yr${years === 1 ? '' : 's'}`;
  }

  return `${years} yr${years === 1 ? '' : 's'} ${months} mo${months === 1 ? '' : 's'}`;
};
