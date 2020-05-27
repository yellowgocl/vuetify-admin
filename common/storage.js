export function setItem(key, value) {
    localStorage.setItem(key, value)
}
export function getItem(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue
}
export function removeItem(key) {
    localStorage.removeItem(key)
}
export function clear() {
    localStorage.clear()
}

export default { setItem, getItem, removeItem, clear }