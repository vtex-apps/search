import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface Item {
  label: string;
  value: string;
  link: string;
  attributes?: AttributeItem[];
  icon?: IconProp;
  prefix?: string;
}

export interface AttributeItem {
  groupValue: string;
  value: string;
  label: string;
  link: string;
  key: string;
}

export function instanceOfAttributeItem(object: any): object is AttributeItem {
  return "groupValue" in object;
}
