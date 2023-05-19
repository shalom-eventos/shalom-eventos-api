export function includeURLFields<T, Key extends keyof T>(
  model: T,
  keys: Key[]
): Omit<T, Key> {
  let newModel = { ...model };
  for (let key of keys) {
    const newKey = `${String(key)}_url`;
    const newValue = `${newKey}/files/${model[key]}`;
    newModel = { ...model, newKey: newValue };
  }
  return newModel;
}
