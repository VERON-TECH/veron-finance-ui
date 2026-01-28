export function isNotEmpty(value) {
  return value.trim() !== "";
}

export function isEmail(value) {
  const regex = /\S+@+\S+\.+\S/
  return regex.test(value);
}