
export function getAthensTimeISOString() {
    const date = new Date();
    const athensOffset = 3 * 60; // Athens is UTC +3 hours
    const offset = date.getTimezoneOffset() + athensOffset;
    const athensDate = new Date(date.getTime() + offset * 60 * 1000);
    return athensDate.toISOString();
  }
  
  
  