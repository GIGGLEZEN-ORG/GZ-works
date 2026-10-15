export const formatDateInput = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getTravelDateBounds = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    today: formatDateInput(today),
    tomorrow: formatDateInput(tomorrow)
  };
};

export const clampTravelDate = (date, fallbackDate) => {
  const { today } = getTravelDateBounds();
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return fallbackDate;
  }

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime()) || formatDateInput(parsedDate) !== date) {
    return fallbackDate;
  }

  if (date < today) return today;
  return date;
};
