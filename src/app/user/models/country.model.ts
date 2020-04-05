
export interface Country {
  isoCode2:       string;
  isoCode3:       string;
  isoCodeNumeric: string;
  nameEs:         string;
  nameEn:         string;
  nameFr:         string;
  divisions:      DivisionElement[];
}

export interface DivisionElement {
  id:        number;
  isoCode:   string;
  nameEs:    string;
  nameEn:    null;
  nameFr:    null;
  level:     string;
  parentId:  number;
  divisions: any[] | { [key: string]: DivisionValue };
}

export interface DivisionValue {
  id:        number;
  isoCode:   string;
  nameEs:    string;
  nameEn:    null;
  nameFr:    null;
  level:     string;
  parentId:  number;
  divisions: any[];
}
