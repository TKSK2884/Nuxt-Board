export function convertKoreaTime(date: Date): string {
    const convertedDate = new Date(date);

    convertedDate.setHours(convertedDate.getHours() + 9);

    const year = convertedDate.getFullYear();
    const month = String(convertedDate.getMonth() + 1).padStart(2, "0");
    const day = String(convertedDate.getDate()).padStart(2, "0");
    const hours = String(convertedDate.getHours()).padStart(2, "0");
    const minutes = String(convertedDate.getMinutes()).padStart(2, "0");
    const second = String(convertedDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}-${minutes}-${second}`;

    return formattedDate;
}
