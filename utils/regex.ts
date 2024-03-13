//regex for matching web links excluding privatus links
export const noLinksRegex = /\b(?!.*privatus)(?:(?:https?|ftp):\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|net|org|edu|gov|mil|info|biz|io))\b/;

//regex for username validation
export const usernameRegex= /^[\w\d\-_\.]*$/