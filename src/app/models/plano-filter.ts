import { GenFilter } from "./interfaces/filter.interface";
import { Plano } from "./interfaces/gym-program.interface";

export class PlanoFilter {
  constructor() {
    this.filters = {filters: []};
    this.plana = [];
  }

  private filters: GenFilter;
  private plana: Plano[];

  set Filters(filters: GenFilter) {
    this.filters = filters;
  }

  set Plana(plana: Plano[]) {
    this.plana = plana;
  }

  get Filters(): GenFilter {
    return this.filters;
  }

  get Plana(): Plano[] {
    return this.plana;
  }

  public loadPlanaGenFiltered(iplana: Plano[]): Plano[] {
    let vplana: Plano[] = iplana;

    if (this.filters === null || this.filters === undefined) {
      return vplana;
    }

    const vfilters: GenFilter = this.filters;

    if (vfilters && vfilters.filters) {

        vfilters.filters.forEach((filter) => {
          if (filter.filters) {
            filter.filters.forEach((value) => {
              if (value.checked) {
                vplana = [];
              }
            });
          }
        });

        vfilters.filters.forEach((filter, filtrIndex) => {
          let iiplana: Plano[] = null;

          if(filtrIndex > 0) {
            iiplana = vplana;
          } else {
            iiplana = iplana;
          }

          for (let idx = 0; idx <= iiplana.length-1; idx++) {
            let vgoon: boolean = false;

            if (filter.filters) {
              filter.filters.forEach((ffilter) => {
                switch (filter.filterCode) {
                  case "mathimata":
                    if (ffilter.code === iiplana[idx].math && ffilter.checked) {
                      vgoon = true;
                    }
                    break;
                }
              });
            }

            if (vgoon) {
              vplana.push(iiplana[idx]);
            }
          }
        });
    }

    return vplana;
  }
}
