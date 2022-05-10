export enum LoadType {
  'UNKNOWN' = -1, //Temporary to help prevent typescript compilation errors but ideally we should check whether the variable has any of the below mappings rather than check with -1
  'FCL' = 1,
  'LCL' = 2,
  'FTL' = 3,
  'LTL' = 4
}
