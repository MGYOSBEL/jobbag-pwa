import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';


const DELIMITER = '-';

export function dateFromModel(value: string | null): NgbDateStruct | null {
  if (value) {
    const date = value.split(DELIMITER);
    return {
      day: parseInt(date[0], 10),
      month: parseInt(date[1], 10),
      year: parseInt(date[2], 10)
    };
  }
  return null;
}

export function dateToModel(date: NgbDateStruct | null): string | null {
  const adaptedDate =  date ? date.year + DELIMITER + date.month + DELIMITER + date.day : null;
  return adaptedDate;
}
