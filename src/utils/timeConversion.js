export const iso8601ToTime = (duration) => {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (duration.length) {
    const [hours, minutes, seconds] = [match[1] ? parseInt(match[1]) : 0, match[2] ? parseInt(match[2]) : 0, match[3] ? parseInt(match[3]) : 0]

    return seconds + (minutes * 60) + (hours * 60 * 60)
  }
  return 0
}


export const getTimeString = (time) => {
  const s = time;

  const [y, mo, d, h, m, sec] = [s / 31536000 | 0, s / 2592000 % 12 | 0, s / 86400 % 31 | 0, s / 3600 % 24 | 0, s / 60 % 60 | 0, s % 60];

  const renderString = (value = 0, string) => value > 0 ? `${value} ${value > 1 ? string + 's' : string}` : ''

  if (time > 0) {
    let arr = Array.of(renderString(y, 'year'), renderString(mo, 'month'), renderString(d, 'day'), renderString(h, 'hour'), renderString(m, 'minute'), renderString(sec, 'second'))

    return arr.filter(i => !i == '').join(', ')
  }

  return '0 seconds'
}
