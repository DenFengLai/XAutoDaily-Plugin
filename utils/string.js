export function maskString(str, numStars) {
    // 如果输入字符串的长度小于或等于 numStars，则返回原字符串
    if (str.length <= numStars) {
        return str;
    }
    const start = str.slice(0, Math.floor((str.length - numStars) / 2));
    const end = str.slice(str.length - Math.floor((str.length - numStars) / 2));
    const stars = '*'.repeat(numStars);

    return start + stars + end;
}
