export interface Item {
  label: string | JSX.Element
  value: string
  link: string
  attributes?: AttributeItem[]
  icon?: JSX.Element
  prefix?: string | JSX.Element
}

export interface AttributeItem {
  groupValue: string
  value: string
  label: string
  link: string
  key: string
}

export function instanceOfAttributeItem(object: any): object is AttributeItem {
  return 'groupValue' in object
}
