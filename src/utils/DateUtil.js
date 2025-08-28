import i18next from "i18next";

export function formatDatetime(instantString){
    if(!instantString) return "";

    const date = new Date(instantString);

    const locale = i18next.language || 'es';

    return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function formatDate(dateString){
    if(!dateString) return "";

    const date =dateWithoutTimezone(dateString);

    const locale = i18next.language || 'es';

    return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}

export function dateWithoutTimezone(dateString){
    const regex = /^(\d{4})([-/])(\d{2})\2(\d{2})$/;
    const match = dateString.match(regex);

    if (!match) {
        console.warn(`Formato de fecha inválido: ${dateString}`);
        return null;
    }

    const [, year, , month, day] = match;
    const y = parseInt(year, 10);
    const m = parseInt(month, 10) - 1;
    const d = parseInt(day, 10);

    return new Date(y, m, d);
}