export const insertDataIntoMapPreferences = (
  userPreferences: any,
  key: string,
  dataToStore: any
) => {
  return {
    ...userPreferences,
    map: {
      ...userPreferences.map,
      [key]: dataToStore
    }
  }
}
