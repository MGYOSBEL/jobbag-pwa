import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin, EMPTY, combineLatest, of } from 'rxjs';
import { CountryService } from '@app/user/services/country.service';
import { Country } from '@app/user/models/country.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  accounts = [
    {
      id: 1,
      isoCode: "CU-01",
      nameEs: "Pinar del Río",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: [
        {
          id: 17,
          isoCode: "CU-01-01",
          nameEs: "Sandino",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 18,
          isoCode: "CU-01-02",
          nameEs: "Mantua",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 19,
          isoCode: "CU-01-03",
          nameEs: "Minas de Matahambre",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 20,
          isoCode: "CU-01-04",
          nameEs: "Viñales",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 21,
          isoCode: "CU-01-05",
          nameEs: "La Palma",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 22,
          isoCode: "CU-01-06",
          nameEs: "Los Palacios",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 23,
          isoCode: "CU-01-07",
          nameEs: "Consolación del Sur",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 24,
          isoCode: "CU-01-08",
          nameEs: "Pinar del Río",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 25,
          isoCode: "CU-01-09",
          nameEs: "San Luis",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 26,
          isoCode: "CU-01-10",
          nameEs: "San Juan y Martínez",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        },
        {
          id: 27,
          isoCode: "CU-01-11",
          nameEs: "Guane",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 1,
          divisions: []
        }
      ]
    },
    {
      id: 2,
      isoCode: "CU-03",
      nameEs: "La Habana",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: [
        {
          id: 28,
          isoCode: "CU-03-01",
          nameEs: "Playa",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 29,
          isoCode: "CU-03-02",
          nameEs: "Plaza de la Revolución",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 30,
          isoCode: "CU-03-03",
          nameEs: "Centro Habana",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 31,
          isoCode: "CU-03-04",
          nameEs: "La Habana Vieja",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 32,
          isoCode: "CU-03-05",
          nameEs: "Regla",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 33,
          isoCode: "CU-03-06",
          nameEs: "La Habana del Este",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 34,
          isoCode: "CU-03-07",
          nameEs: "Guanabacoa",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 35,
          isoCode: "CU-03-08",
          nameEs: "San Miguel del Padrón",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 36,
          isoCode: "CU-03-09",
          nameEs: "Diez de Octubre",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 37,
          isoCode: "CU-03-10",
          nameEs: "Cerro",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 38,
          isoCode: "CU-03-11",
          nameEs: "Marianao",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 39,
          isoCode: "CU-03-12",
          nameEs: "La Lisa",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 40,
          isoCode: "CU-03-13",
          nameEs: "Boyeros",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 41,
          isoCode: "CU-03-14",
          nameEs: "Arroyo Naranjo",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 42,
          isoCode: "CU-03-14",
          nameEs: "Arroyo Naranjo",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        },
        {
          id: 43,
          isoCode: "CU-03-15",
          nameEs: "Cotorro",
          nameEn: null,
          nameFr: null,
          level: "1",
          parentId: 2,
          divisions: []
        }
      ]
    },
    {
      id: 3,
      isoCode: "CU-04",
      nameEs: "Matanzas",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 4,
      isoCode: "CU-05",
      nameEs: "Villa Clara",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 5,
      isoCode: "CU-06",
      nameEs: "Cienfuegos",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 6,
      isoCode: "CU-07",
      nameEs: "Sancti Spíritus",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 7,
      isoCode: "CU-08",
      nameEs: "Ciego de Ávila",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 8,
      isoCode: "CU-09",
      nameEs: "Camagüey",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 9,
      isoCode: "CU-10",
      nameEs: "Las Tunas",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 10,
      isoCode: "CU-11",
      nameEs: "Holguín",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 11,
      isoCode: "CU-12",
      nameEs: "Granma",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 12,
      isoCode: "CU-13",
      nameEs: "Santiago de Cuba",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 13,
      isoCode: "CU-14",
      nameEs: "Guantánamo",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 14,
      isoCode: "CU-15",
      nameEs: "Artemisa",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 15,
      isoCode: "CU-16",
      nameEs: "Mayabeque",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    },
    {
      id: 16,
      isoCode: "CU-99",
      nameEs: "Isla de la Juventud",
      nameEn: null,
      nameFr: null,
      level: "0",
      parentId: 0,
      divisions: []
    }
  ];

  selectedPeople = [];




  countries$: Observable<Country>;
  constructor(
    private countryService: CountryService
  ) {}


  ngOnInit() {
    this.countries$ = this.countryService.get();
  }

  selectAll() {
    this.selectedPeople = this.accounts;
}

onAdd(event) {
console.log(event);
}





}
