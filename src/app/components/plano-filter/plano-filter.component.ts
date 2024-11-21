import { ModalController } from '@ionic/angular';
import { Filters, GenFilter } from './../../models/interfaces/filter.interface';
import { NavParams } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Plano } from 'src/app/models/interfaces/gym-program.interface';
import { PlanoFilter } from 'src/app/models/plano-filter';

@Component({
  selector: "plano-filter",
  templateUrl: "./plano-filter.component.html",
  styleUrls: ["./plano-filter.component.scss"],
})
export class PlanoFilterComponent implements OnInit, OnDestroy {
  private static PlanoFilterFirst: GenFilter = {
    filters: [
      {
        filterCode: "mathimata",
        filterName: "Μαθήματα",
        filters: [],
        masterCheck: false,
        isIndeterminate: false,
      },
    ]
  };

  private planoFilter!: PlanoFilter;
  private plana: Plano[];
  private filter: GenFilter;
  private OnDoFilter: (plana: Plano[], filters: GenFilter) => void;

  loading: boolean;


  constructor (private navParams: NavParams,
    private modalCtrl: ModalController,
  )
  {
    this.OnDoFilter = this.navParams.data["OnDoFilter"];
    this.plana = this.navParams.data["plana"];
    this.filter = this.navParams.data["filters"];
    this.loading = true;
  }

  ngOnInit() {
    //
    if (!this.plana || this.plana.length < 1) {
      this.ErrorOnLoad();
      return;
    }

    this.planoFilter = new PlanoFilter();
    this.planoFilter.Plana = this.plana;
    if (this.filter) {
      this.planoFilter.Filters = this.filter;
    } else {
      this.planoFilter.Filters = {filters: []};
    }
    this.planoFilter.Filters = this.getFiltersFromPlana();

    this.loading = false;
  }

  ionViewDidEnter() {
    this.ErrorOnLoad();
    return;
  }

  private async ErrorOnLoad() {
    if (!this.plana || this.plana.length < 1) {
      await this.modalCtrl.dismiss();
    }
  }

  ngOnDestroy() {
  }

  get getFilters(): Filters[] | undefined {
    return this.planoFilter !== null && this.planoFilter !== undefined ?
      this.planoFilter.Filters !== null && this.planoFilter.Filters !== undefined ?
      this.planoFilter.Filters.filters :
      undefined : undefined;
  }

  async onDoFilterEvent(ev: any) {
    if (this.OnDoFilter) {
      this.OnDoFilter(this.loadPlanaGenFiltered(this.planoFilter.Plana), this.planoFilter.Filters);
    }
    await this.modalCtrl.dismiss({
      apoToSostoDromo: true,
    });
  }

  async onExit(ev: any) {
    await this.modalCtrl.dismiss({
      apoToSostoDromo: true,
    });
  }

  private loadPlanaGenFiltered(iplana: Plano[]): Plano[] {
    return this.planoFilter.loadPlanaGenFiltered(iplana);
  }

  private getFiltersFromPlana(): GenFilter {
    let vgenFilter: GenFilter;

    const vfilters: GenFilter = this.planoFilter.Filters;

    if (vfilters && vfilters.filters && vfilters.filters.length > 0) {
      vgenFilter = {filters: vfilters.filters};
    } else {
      vgenFilter = this.filter;
      vgenFilter.filters.push(
        ...PlanoFilterComponent.PlanoFilterFirst.filters
      );
    }

    const vmaths: string[] = [];

    if (vgenFilter.filters[0].filters) {
      vgenFilter.filters[0].filters.forEach((value) => {
          vmaths.push(value.code);
      });

      for (let idx = 0; idx < this.planoFilter.Plana.length-1; idx++) {
        if (vmaths.indexOf(this.planoFilter.Plana[idx].math) < 0) {
          vgenFilter.filters[0].filters.push({
            caption: this.planoFilter.Plana[idx].mathimaDescr,
            code: this.planoFilter.Plana[idx].math,
            checked: false,
          });
          vmaths.push(this.planoFilter.Plana[idx].math);
        }
      }
    }

    return vgenFilter;
  }

  checkMaster(ev: any, filter: Filters) {
    setTimeout(()=>{
      filter.filters.forEach(obj => {
        obj.checked = filter.masterCheck;
      });
    });
  }

  checkEvent(ev: any, filter: Filters) {
    const totalItems = filter.filters.length;
    let checked = 0;
    filter.filters.map(obj => {
      if (obj.checked) checked++;
    });
    if (checked > 0 && checked < totalItems) {
      //If even one item is checked but not all
      filter.isIndeterminate = true;
      filter.masterCheck = false;
    } else if (checked == totalItems) {
      //If all are checked
      filter.masterCheck = true;
      filter.isIndeterminate = false;
    } else {
      //If none is checked
      filter.isIndeterminate = false;
      filter.masterCheck = false;
    }
  }
}

