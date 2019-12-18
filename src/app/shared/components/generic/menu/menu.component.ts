import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, IonContent } from '@ionic/angular';
import { Company } from '../../../models/company';
import { StorageService } from 'src/app/shared/services/storage/storage.service';
import { Filter } from 'src/app/pages/home/models/filter';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  public searchValue: string;
  private allCompanies: Company[] = [];
  public searchedCompanies: Company[] = [];
  public filters: Filter[];

  @ViewChild(IonContent, {static: false}) content: IonContent;

  constructor(
    private storageService: StorageService,
    
  ) {
   }

  ngOnInit() {
    this.storageService.allCompanies.subscribe((cpies) => {
      this.allCompanies = cpies;
    });
    this.storageService.filters.subscribe((filt) => {
      this.filters = filt;
    });
  }

  onSearch(ev: any) {
    this.searchValue = ev.target.value;
    if (this.searchValue === undefined ) {
      return;
    }
    let valueSearched = this.searchValue.replace(/\s+/g, '');
    valueSearched = valueSearched.toLowerCase();

    this.searchedCompanies = [];

    if (valueSearched === 'all' || valueSearched === '*' ) {
      this.searchedCompanies = this.allCompanies;
      return;
    }

    for (const cpy of this.allCompanies) {
      if ( cpy.company === undefined || cpy.tag === undefined) {
        return;
      }

      if (cpy.company.toLowerCase().includes(valueSearched)
      || cpy.tag.toLowerCase().includes(valueSearched)
      || valueSearched.includes(cpy.floor.toString())
      || valueSearched.includes(cpy.booth.toString())) {
        this.searchedCompanies.push(cpy);
      }
    }
  }

  closingNavSlideUp() {
    console.log('I am fired');
    this.content.scrollToTop();
  }
}
