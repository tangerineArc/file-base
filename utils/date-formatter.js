export default function formatDate(dateString) {
  const string = dateString.toString();
  const [_, month, date, year, time] = string.split(" ");

  return `${time} · ${date} ${month} ${year}`;
}
