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

export function timeAgo(time: Date): string {
    const date = new Date(time);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);

    const diffInMs = kstNow.getTime() - kstDate.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}초 전`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}일 전`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks}주 전`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return `${diffInMonths}달 전`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears}년 전`;
}
