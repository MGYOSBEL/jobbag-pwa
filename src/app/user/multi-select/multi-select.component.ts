import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { CountryService } from '../services/country.service';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit {

  hideButtons: boolean;

  countryDivisions = []; // All Divisions of the selected country

  selectedCountry: Country;

  selectedCountryDivisions: number[] = []; // Divisions selected, from the selected country

  @Input()
  selectedDivisions: number[]; // All divisions selected, from all countries

  @Input()
  popup: boolean = true;

  @Output()
  selected = new EventEmitter<number[]>();




  countries$: Observable<Country[]>;
  constructor(
    private countryService: CountryService
    ) {
      this.hideButtons = false;
      console.log('buttons shown');
    }

  ngOnInit() {
    this.countries$ = this.countryService.get();
    console.log('ms: selectedDivisions', this.selectedDivisions);
  }

//   selectAll() {
//     this.selectedPeople = this.accounts;
// }

// onAdd(event) {
// console.log(event);
// }

onCountrySelect(country: Country) {
  console.log(country);
  this.hideButtons = true;
  this.selectedCountry = country;
  this.countryDivisions = country.divisions;
  // this.selectedCountryDivisions = [];

}

saveAllDivisions(event) {
  // this.hideButtons = false;
  // this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];
  // this.selectedCountryDivisions = [];
  console.log('saveDivisions called');
  console.log(event);
  const checked = event.target.checked;
  this.selectedCountryDivisions = checked ? this.selectedCountry.divisions.map(item => item.id) : [] ;
  console.log('checked array: ', this.selectedCountryDivisions);

  this.selectedDivisions = [...this.selectedDivisions].filter(elem => this.selectedCountry.divisions.findIndex(div => div.id === elem) < 0);
  console.log('filtered array: ', this.selectedDivisions);

  this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];
  console.log('selectedDivisions: ', this.selectedDivisions);
  console.log('selectedCountryDivisions: ', this.selectedCountryDivisions);

  this.selected.emit(this.selectedDivisions);
}

closeModal() {
  this.selectedCountryDivisions = [];
  console.log('selectedDivisions: ', this.selectedDivisions);
  console.log('selectedCountryDivisions: ', this.selectedCountryDivisions);
}

onChange($event) {
  console.log('onChange called');
  console.log('onChange: ', this.selectedDivisions);
  console.log('onChange: ', this.selectedCountryDivisions);
  this.selected.emit(this.selectedDivisions);
}


}
