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

    const date = new Date(dateString);

    const locale = i18next.language || 'es';

    return new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(date);
}