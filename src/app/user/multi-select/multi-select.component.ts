import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';
import { CountryService } from '../services/country.service';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.css']
})
export class MultiSelectComponent implements OnInit {

  hideButtons: boolean;

  countryDivisions = []; // All Divisions of the selected country

  selectedCountry: Country;

  selectedCountryDivisions = []; // Divisions selected, from the selected country

  @Input()
  selectedDivisions: number[]; // All divisions selected, from all countries

  @Input()
  popup: boolean = true;

  @Output()
  selected = new EventEmitter<number[]>();




  countries$: Observable<Country>;
  constructor(
    private countryService: CountryService
    ) {
      this.hideButtons = false;
    }

  ngOnInit() {
    this.countries$ = this.countryService.get();

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

saveDivisions() {
  // this.hideButtons = false;
  // this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];
  // this.selectedCountryDivisions = [];
  console.log('saveDivisions called');
  console.log('selectedDivisions: ', this.selectedDivisions);
  console.log('selectedCountryDivisions: ', this.selectedCountryDivisions);
  this.selected.emit(this.selectedDivisions);
}

closeModal() {
  this.selectedCountryDivisions = [];
  console.log('selectedDivisions: ', this.selectedDivisions);
  console.log('selectedCountryDivisions: ', this.selectedCountryDivisions);
}


}
