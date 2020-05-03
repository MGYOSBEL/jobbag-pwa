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

  countries: Country[];

  countryDivisions = []; // All Divisions of the selected country

  selectedCountry: Country;
  selectedCountryIndex: number;

  selectedCountryDivisions: number[] = []; // Divisions selected, from the selected country
  selectedByCountry: number [][];

  @Input()
  selectedDivisions: number[]; // All divisions selected, from all countries

  @Output()
  selected = new EventEmitter<number[]>();




  countries$: Observable<Country[]>;
  constructor(
    private countryService: CountryService
    ) {
      this.hideButtons = false;

    }

  ngOnInit() {
    this.countries$ = this.countryService.get();
    this.countries$.subscribe(
      countries => {
        this.countries = countries;
        this.selectedByCountry = [[], [], []];

        this.selectedByCountry = [
          this.selectedDivisions.filter(item => this.countries[0].divisions.findIndex(elem => elem.id === item) > -1),
          this.selectedDivisions.filter(item => this.countries[1].divisions.findIndex(elem => elem.id === item) > -1),
          this.selectedDivisions.filter(item => this.countries[2].divisions.findIndex(elem => elem.id === item) > -1),
        ];
        console.log('selectedByCountry', this.selectedByCountry);
      }
    );
  }

//   selectAll() {
//     this.selectedPeople = this.accounts;
// }

// onAdd(event) {
// console.log(event);
// }

onCountrySelect(country: Country, i: number) {
  console.log(country);
  this.hideButtons = true;
  this.selectedCountry = country;
  this.selectedCountryIndex = i;
  this.countryDivisions = country.divisions;
  this.selectedCountryDivisions = [...this.selectedByCountry[i]];

  console.log(this.selectedDivisions);
  console.log(this.selectedCountryDivisions);

}

// saveAllDivisions(event) {
//   // this.hideButtons = false;
//   // this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];
//   // this.selectedCountryDivisions = [];
//   console.log('saveDivisions called');
//   console.log(event);
//   const checked = event.target.checked;
//   this.selectedCountryDivisions = checked ? this.selectedCountry.divisions.map(item => item.id) : [] ;
//   console.log('checked array: ', this.selectedCountryDivisions);

//   this.selectedDivisions = [...this.selectedDivisions].filter(elem => this.selectedCountry.divisions.findIndex(div => div.id === elem) < 0);
//   console.log('filtered array: ', this.selectedDivisions);

//   this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];
//   console.log('selectedDivisions: ', this.selectedDivisions);
//   console.log('selectedCountryDivisions: ', this.selectedCountryDivisions);

//   this.selected.emit(this.selectedDivisions);
// }

closeModal() {
  this.selectedCountryDivisions = [];
}

onChange($event) {
  this.selectedDivisions = [...this.selectedDivisions, ...this.selectedCountryDivisions];

  this.selectedByCountry[this.selectedCountryIndex] = this.selectedCountryDivisions;

  this.selectedDivisions = [...this.selectedByCountry[0], ...this.selectedByCountry[1], ...this.selectedByCountry[2]];

  console.log(this.selectedDivisions);

  this.selected.emit(this.selectedDivisions);
}


}
