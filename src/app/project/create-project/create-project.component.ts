import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ServicesService } from '@app/user/services/services.service';
import { Service } from '@app/user/models/services.model';
import { Country, DivisionValue, DivisionElement } from '@app/user/models/country.model';
import { CountryService } from '@app/user/services/country.service';
import { LoggingService } from '@app/services/logging.service';
import { NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']

})
export class CreateProjectComponent implements OnInit {

  onlineJob: boolean = true;

  createProjectForm: FormGroup;

  services: Service[]; // Services
  selectedServices: FormControl; // Services
  countryDivisions: number[] = []; // Country



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private servicesService: ServicesService,
    private route: ActivatedRoute,
    private logger: LoggingService
  ) {
    this.createProjectForm = this.formBuilder.group({
      projectTitle: [''],
      projectResume: [''],
      selectedServices: [''],
      divisions: [''],
      startDate: ['']
    });
  }

  ngOnInit() {
    this.servicesService.getAll().subscribe(
      services => this.services = services
    );
  }

  onClose() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  customSearchFn(term: string, item: Service) {
    term = term.toLowerCase();
    return (
      item.descriptionEs.toLowerCase().indexOf(term) > -1 ||
      item.keywords.filter(x => x.toLowerCase().includes(term)).length > 0
    );
  }

  clearServices() {
    this.createProjectForm.patchValue({
      selectedServices: []
    });
  }

  onDivisionsSelect(event) {
    this.countryDivisions = event;
    this.createProjectForm.patchValue({
      divisions: event
    });
  }
}
