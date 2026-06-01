export default function toNumber(value) {
  if (typeof value === 'string' && value.trim() !== '' && !isNaN(value)) {
    return Number(value);
  }

  return value;
}