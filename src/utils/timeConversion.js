export const iso8601ToTime = (duration) => {
  const match = duration.match(/P(?:([\d.]+)D)?T(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?/);

  if (duration.length) {
    const [days, hours, minutes, seconds] = [parseInt(match[1] ?? 0), parseInt(match[2] ?? 0), parseInt(match[3] ?? 0), parseInt(match[4] ?? 0)]

    return seconds + (minutes * 60) + (hours * 60 * 60) + (days * 24 * 60 * 60)
  }
  return 0
}

export const dateTimeStringToSec = (dateTimeString = null) => {
  const dateObject = new Date(dateTimeString)

  if (isNaN(dateObject.getTime())) {
    throw new Error(
      "Invalid date time string format. Please use ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)."
    )
  }

  return Math.floor(dateObject.getTime() / 1000)
}

export const secToDateTimeString = (timestamp = null) => {
  try {
    if (timestamp) {
      const dateObject = new Date(timestamp * 1000);
      const hour = dateObject.getHours();
      const minute = dateObject.getMinutes();
      const second = dateObject.getSeconds();
      const meridian = hour < 12 ? "AM" : "PM";
      const formattedHour = hour % 12 || 12; // Convert to 12-hour format (12 for midnight)
      const day = dateObject.getDate().toString().padStart(2, "0");
      const month = (dateObject.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
      const year = dateObject.getFullYear();
      return `${formattedHour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}:${second
        .toString()
        .padStart(2, "0")} ${meridian}, ${day}/${month}/${year}`;
    } else return timestamp;
  } catch (error) {
    throw new ValueError(
      "Invalid timestamp format. Please provide a valid Unix timestamp in seconds."
    );
  }
};

export const getTimeString = (time) => {
  // Converts time(in ms) to string form
  const s = time;

  const [y, mo, d, h, m, sec] = [s / 31536000 | 0, s / 2592000 % 12 | 0, s / 86400 % 31 | 0, s / 3600 % 24 | 0, s / 60 % 60 | 0, s % 60];

  const renderString = (value = 0, string) => value > 0 ? `${value} ${value > 1 ? string + 's' : string}` : ''

  if (time > 0) {
    let arr = Array.of(renderString(y, 'year'), renderString(mo, 'month'), renderString(d, 'day'), renderString(h, 'hour'), renderString(m, 'minute'), renderString(sec, 'second'))

    return arr.filter(i => !i == '').join(' ')
  }

  return '0 seconds'
}
