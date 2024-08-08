import { days } from '../../data/date/days.json'
import { months } from '../../data/date/months.json'

const formatDate = (date) => {

    const dayOfWeek = days;
    const month = months;

    const d = new Date(date);
    const day = dayOfWeek[d.getDay()];
    const dayNumber = d.getDate();
    const monthName = month[d.getMonth()];
    const year = d.getFullYear();
    const hour = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const seconds = String(d.getSeconds()).padStart(2, "0");
    return `${day}, ${dayNumber} de ${monthName} de ${year}, son las ${hour}:${minutes}:${seconds}`;

}

export default formatDate