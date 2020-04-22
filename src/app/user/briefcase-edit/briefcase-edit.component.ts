import { Component, OnInit } from '@angular/core';
import { UserProfileBriefcase, IDProfessionFk } from '../models/user.model';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BriefcaseService } from '../services/briefcase.service';
import { ErrorService } from '@app/errors/error.service';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-briefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css']
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
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {

    this.briefcaseEditForm = this.formBuilder.group({
      title: ['', Validators.required],
      comments: [''],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.opSucceed = true;
    this.briefcases$ = this.briefcaseService.briefcases$;
    this.briefcases = [];
    this.pictures = []; // adding pictures array to briefcase
  }

  ngOnInit() {
    this.briefcases$.subscribe(
      briefcases => {this.briefcases = briefcases; console.log('briefcases: ', briefcases); }
    );

  }

  // ADD BRIEFCASES SECTION
  addBriefcase() {
    this.resetForm();
  }

  saveBriefCase() {
    const bc = this.formToData();
    if (this.editedBriefcaseIndex != null) { // Si this.editedBriefcaseIndex != null es q estoy editando
      this.opSucceed = this.briefcaseService.editLocal(bc);
      console.log('Editing...');
      console.log(bc);
    } else { // Si this.editedBriefcaseIndex == null es q estoy creando
      this.opSucceed = this.briefcaseService.addLocal(bc);
      console.log('Adding...');
      console.log(bc);

    }
    this.resetForm();

  }

  // EDIT BRIEFCASES SECTION
  editBriefcase(index: number) {

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
    console.log('uploading - file', file);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;

      this.imageBase64 = this.previewUrl.toString().split(',')[1];
      console.log(this.imageBase64);
      this.pictures[0] = this.imageBase64;      // adding pictures array to briefcase (pictures[0]) just one image
      this.imageLoaded = true;
      console.log('image loaded...');
    };
  }

  private dataToForm(briefcase: UserProfileBriefcase) {
    console.log('data to form: ', briefcase);
    const start = briefcase.startdate.split('-');
    const end = briefcase.enddate.split('-');
    this.briefcaseEditForm.patchValue({
      comments: briefcase.comments,
      description: briefcase.description,
      startDate: { year: parseInt(start[0], 10), month: parseInt(start[1], 10), day: parseInt(start[2], 10) },
      endDate: { year: parseInt(end[0], 10), month: parseInt(end[1], 10), day: parseInt(end[2], 10) },
    });
    this.previewUrl = this.parsePictureUrl(briefcase.pictures[0]);
    this.imageLoaded = this.previewUrl != null;
    console.log('image previewURL >>>>', this.previewUrl);
    console.log('image loaded >>>>', this.imageLoaded);

  }

  private formToData(): UserProfileBriefcase {
    const bc: UserProfileBriefcase = {
      description: this.briefcaseEditForm.value.description,
      enddate: this.briefcaseEditForm.value.endDate.year.toString() + '-'
        + this.briefcaseEditForm.value.endDate.month.toString() + '-'
        + this.briefcaseEditForm.value.endDate.day.toString(),
      startdate: this.briefcaseEditForm.value.startDate.year.toString() + '-'
        + this.briefcaseEditForm.value.startDate.month.toString() + '-'
        + this.briefcaseEditForm.value.startDate.day.toString(),
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
      console.log(picture);
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
