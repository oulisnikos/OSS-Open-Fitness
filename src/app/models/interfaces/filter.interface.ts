export interface Filter {
  code: string;
  caption: string;
  checked: boolean;
}

export interface Filters {
  filterCode: string;
  filterName: string;
  filters: Filter[];
  masterCheck: boolean;
  isIndeterminate: boolean;
}

export interface GenFilter {
  filters: Filters[];
}
