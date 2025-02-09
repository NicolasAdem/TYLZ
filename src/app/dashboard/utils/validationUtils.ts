export const getMaxValueForUnit = (unit: string): number => {
    const maxValues: { [key: string]: number } = {
      minutes: 59,
      hours: 23,
      days: 31,
      weeks: 51,
      months: 12,
      years: 10
    };
    return maxValues[unit] || 999;
  };