import React from 'react'
import { Link } from 'vtex.render-runtime'

import { Item } from './types'
import stylesCss from './styles.css'

interface IAttributeProps {
  item: Item
  onMouseOver: (ee: React.MouseEvent | React.FocusEvent, item: Item) => void
  onMouseOut: () => void
  closeModal: () => void
}

const Attribute = (props: IAttributeProps) =>
  props.item?.attributes ? (
    <ul className={stylesCss.itemListSubList}>
      {props.item.attributes.map((attribute, index) => (
        <li
          key={index}
          className={`${stylesCss.itemListSubItem} c-on-base pointer`}
          onMouseOver={e => props.onMouseOver(e, attribute)}
          onFocus={e => props.onMouseOver(e, attribute)}
          onMouseOut={() => props.onMouseOut()}
          onBlur={() => props.onMouseOut()}
        >
          <Link
            className={`${stylesCss.itemListSubItemLink} c-on-base`}
            to={`/${props.item.value}/${attribute.value}`}
            query={`map=ft,${attribute.key}`}
            onClick={() => props.closeModal()}
          >
            {attribute.label}
          </Link>
        </li>
      ))}
    </ul>
  ) : null

export default Attribute
