export const formatDate = (date: Date | string) => {
  if (!date) return '';

  // Handle different date formats - just display what we receive
  if (typeof date === 'string') {
    return date;
  }

  // If it's a Date object, format it
  if (date instanceof Date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  // For any other format, convert to string
  return String(date);
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
