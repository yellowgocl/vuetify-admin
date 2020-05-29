export function setItem(key, value) {
    process.client && localStorage.setItem(key, value)
}
export function getItem(key, defaultValue) {
    return process.client && localStorage.getItem(key) || defaultValue
}
export function removeItem(key) {
    process.client && localStorage.removeItem(key)
}
export function clear() {
    process.client && localStorage.clear()
}

export default { setItem, getItem, removeItem, clear }