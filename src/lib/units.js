// Weight unit conversions — keeps historical entries stable when the user toggles units.

export function weightToKg(value, unit) {
  if (value == null) return null;
  return unit === "kg" ? value : value * 0.453592;
}

export function kgToUnit(kg, unit) {
  if (kg == null) return null;
  return unit === "kg" ? kg : kg / 0.453592;
}

export function convertWeight(value, fromUnit, toUnit) {
  if (value == null) return null;
  if (fromUnit === toUnit) return value;
  return kgToUnit(weightToKg(value, fromUnit), toUnit);
}