import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserProfileBriefcase, IDProfessionFk } from '../models/user.model';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BriefcaseService } from '../services/briefcase.service';
import { ErrorService } from '@app/errors/error.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { LoggingService } from '@app/services/logging.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-briefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css'],
})
export class BriefcaseEditComponent implements OnInit {
  briefcases: UserProfileBriefcase[];
  briefcases$: Observable<UserProfileBriefcase[]>;

  briefcaseEditForm: FormGroup;
  previewUrl: any;
  imageBase64: string;
  imageLoaded: boolean;
  deletedBriefcaseIndex: number = null;
  editedBriefcaseIndex: number = null;
  pictures: string[]; // adding pictures array to briefcase
  opSucceed: boolean;



  constructor(
    private briefcaseService: BriefcaseService,
    private logger: LoggingService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.briefcaseEditForm = this.formBuilder.group({
      comments: [''],
      description: ['', Validators.required],
      startDate: [''],
      endDate: [''],
    });

    this.opSucceed = true;
    this.briefcases$ = this.briefcaseService.briefcases$;
    this.briefcaseService.reset();
    this.briefcases = [];
    this.pictures = []; // adding pictures array to briefcase
  }

  ngOnInit() {
    this.briefcases$.subscribe(
      briefcases => { this.briefcases = briefcases; this.logger.log('briefcases: ', briefcases); }
    );


  }

  // ADD BRIEFCASES SECTION
  addBriefcase() {
    this.resetForm();
  }

  saveBriefCase() {
    const bc = this.formToData();
    if (this.editedBriefcaseIndex != null) { // Si this.editedBriefcaseIndex != null es q estoy editando
      this.opSucceed = this.briefcaseService.editLocal({ ...bc });
      this.logger.log('Editing...');
      this.logger.log(bc);
    } else { // Si this.editedBriefcaseIndex == null es q estoy creando
      this.opSucceed = this.briefcaseService.addLocal(bc);
      this.logger.log('Adding...');
      this.logger.log(bc);

    }
    this.resetForm();
  }

  onFormShow(event) {
    console.log(event);
  }

  // EDIT BRIEFCASES SECTION
  editBriefcase(index: number) {
    this.logger.log(`${index}: ${typeof (index)}`);
    this.dataToForm(this.briefcases[index]);
    this.editedBriefcaseIndex = index;
  }

  cancelEdit() {
    this.editedBriefcaseIndex = null;
    this.resetForm();
  }


  // DELETE BRIEFCASES SECTION

  selectBriefcaseToDelete(id: number) {
    this.deletedBriefcaseIndex = id;
  }

  deleteBriefcase() {
    if (this.deletedBriefcaseIndex != null && !!(this.briefcases[this.deletedBriefcaseIndex])) {
      this.opSucceed = this.briefcaseService.deleteLocal(this.briefcases[this.deletedBriefcaseIndex]);
    }

    this.deletedBriefcaseIndex = null;
  }

  cancelDelete() {
    this.deletedBriefcaseIndex = null;
  }

  exit() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  uploadPicture($event) {
    const file = ($event.target as HTMLInputElement).files[0];
    this.logger.log('uploading - file', file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;

      this.imageBase64 = this.previewUrl.toString().split(',')[1];
      this.logger.log(this.imageBase64);
      this.pictures[0] = this.imageBase64;      // adding pictures array to briefcase (pictures[0]) just one image
      this.imageLoaded = true;
      this.logger.log('image loaded...');
    };
  }

  private dataToForm(briefcase: UserProfileBriefcase) {
    this.logger.log('data to form: ', briefcase);
    const start = briefcase.startdate.split('-') || null;
    const end = briefcase.enddate.split('-') || null;
    this.briefcaseEditForm.patchValue({
      comments: briefcase.comments,
      description: briefcase.description,
      startDate: start != null ? { year: parseInt(start[0], 10), month: parseInt(start[1], 10), day: parseInt(start[2], 10) } : null,
      endDate: end != null ? { year: parseInt(end[0], 10), month: parseInt(end[1], 10), day: parseInt(end[2], 10) } : null,
    });
    this.previewUrl = this.parsePictureUrl((briefcase.pictures != null) ? briefcase.pictures[0] : null);
    this.imageLoaded = this.previewUrl != null;
    this.logger.log('image previewURL >>>>', this.previewUrl);
    this.logger.log('image loaded >>>>', this.imageLoaded);

  }

  private formToData(): UserProfileBriefcase {
    const bc: UserProfileBriefcase = {
      description: this.briefcaseEditForm.value.description,
      enddate: this.briefcaseEditForm.value.endDate ?
        this.briefcaseEditForm.value.endDate.year.toString() + '-'
        + this.briefcaseEditForm.value.endDate.month.toString() + '-'
        + this.briefcaseEditForm.value.endDate.day.toString() : null,
      startdate: this.briefcaseEditForm.value.startDate ?
        this.briefcaseEditForm.value.startDate.year.toString() + '-'
        + this.briefcaseEditForm.value.startDate.month.toString() + '-'
        + this.briefcaseEditForm.value.startDate.day.toString() : null,
      comments: this.briefcaseEditForm.value.comments,
      // idProfessionFk: this.briefcaseEditForm.value.profession,
      idUserProfileFk: null,
      id: this.editedBriefcaseIndex != null ? this.briefcases[this.editedBriefcaseIndex].id : null,
      pictures: this.pictures,     // adding pictures array to briefcase
    };
    return bc;
  }

  resetForm() {
    this.briefcaseEditForm.reset();
    this.pictures = [];
    this.previewUrl = null;
    this.imageLoaded = false;
    this.opSucceed = true;
    this.editedBriefcaseIndex = null;
    this.deletedBriefcaseIndex = null;
  }

  private parsePictureUrl(picture: string): string {
    if (picture != null) {
      this.logger.log(picture);
      const remoteImage = picture.includes('uploads');
      // No contiene 'uploads' pero no esta vacio, debe ser un base64
      const localImage = !remoteImage && picture != null;
      if (remoteImage) {
        return environment.serverBaseURL + '/' + picture;
      } else if (localImage) {
        return `data:image/jpeg;base64,${picture}`;
      }
    }
    return null;
  }

}
