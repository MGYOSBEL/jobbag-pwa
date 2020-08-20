import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { UserProfileBriefcase, IDProfessionFk } from '../models/user.model';
import { FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BriefcaseService } from '../services/briefcase.service';
import { ErrorService } from '@app/errors/error.service';
import { environment } from '@environments/environment';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoggingService } from '@app/services/logging.service';
import { NgbActiveModal, NgbModal, NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-briefcase-edit',
  templateUrl: './briefcase-edit.component.html',
  styleUrls: ['./briefcase-edit.component.css'],
})
export class BriefcaseEditComponent implements OnInit {
  briefcases: UserProfileBriefcase[];
  briefcases$: Observable<UserProfileBriefcase[]>;
  @Input()
  cardHeight: number;
  @Input()
  maxAllowedBriefcase?: number;
  briefcaseEditForm: FormGroup;
  previewUrl: any;
  imageBase64: string;
  imageLoaded: boolean;
  deletedBriefcaseIndex: number = null;
  editedBriefcaseIndex: number = null;
  private picturesSubject = new BehaviorSubject<string[]>([]);
  pictures$: Observable<string[]> = this.picturesSubject.asObservable(); // adding pictures array to briefcase
  opSucceed: boolean;
  apiPublic: string; // URL of the public folder in the API
  targetModal: string;

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
    this.picturesSubject.next([]); // adding pictures array to briefcase
  }

  ngOnInit() {
    this.apiPublic = `${environment.apiBaseURL}/public`;
    this.briefcases$.subscribe(
      briefcases => {
        this.briefcases = briefcases;
      }
    );

  }

  // ADD BRIEFCASES SECTION
  addBriefcase() {
    this.resetForm();
  }

  onBriefcaseCardAction({action, id}, index) {
    switch (action) {
      case 'detail':
        this.targetModal = '#briefcaseDetailsModal';
        // this.onBriefcaseDetail(id);
        break;
      case 'edit':
        this.targetModal = '#exampleModalCenter';
        this.editBriefcase(index);
        break;
      case 'delete':
        this.targetModal = '#deleteBriefcaseModal';
        this.selectBriefcaseToDelete(index);
        // this.onBriefcaseDetail(id);
        break;
      default:
        break;
    }
  }

  saveBriefCase() {
    const bc = this.formToData();
    if (this.editedBriefcaseIndex != null) { // Si this.editedBriefcaseIndex != null es q estoy editando
      this.opSucceed = this.briefcaseService.editLocal({ ...bc });
    } else { // Si this.editedBriefcaseIndex == null es q estoy creando
      this.opSucceed = this.briefcaseService.addLocal(bc);
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
    const files = ($event.target as HTMLInputElement).files;
    const base64Pictures = this.picturesSubject.value;
    for (let index = 0; index < files.length; index++) {
      const file = files.item(index);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (_event) => {
        // this.previewUrl = reader.result;
        base64Pictures.push(reader.result.toString());
      };
    }
    this.imageLoaded = true;
    this.picturesSubject.next(base64Pictures);

  }

  private dataToForm(briefcase: UserProfileBriefcase) {
    const start = briefcase.startdate ? briefcase.startdate.split('-') : null;
    const end = briefcase.enddate ? briefcase.enddate.split('-') : null;
    this.briefcaseEditForm.patchValue({
      comments: briefcase.comments,
      description: briefcase.description,
      startDate: start != null ? { year: parseInt(start[0], 10), month: parseInt(start[1], 10), day: parseInt(start[2], 10) } : null,
      endDate: end != null ? { year: parseInt(end[0], 10), month: parseInt(end[1], 10), day: parseInt(end[2], 10) } : null,
    });
    // this.previewUrl = this.parsePictureUrl((briefcase.pictures != null) ? briefcase.pictures[0] : null);
    const pictures = ( briefcase.pictures != null ) ? briefcase.pictures.map(pic => this.parsePictureUrl(pic)) : null;
    this.picturesSubject.next(pictures);
    this.imageLoaded = pictures != null;
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
      pictures: this.picturesSubject.value.map(pic => pic.split(',')[1]),     // adding pictures array to briefcase
    };
    return bc;
  }

  resetForm() {
    this.briefcaseEditForm.reset();
    this.picturesSubject.next([]);
    this.previewUrl = null;
    this.imageLoaded = false;
    this.opSucceed = true;
    this.editedBriefcaseIndex = null;
    this.deletedBriefcaseIndex = null;
  }

  parsePictureUrl(picture: string): string {
    if (picture != null) {
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
