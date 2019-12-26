import React from "react";
import { Item } from "./types";
import stylesCss from "./styles.css";
import { Link } from "vtex.render-runtime";

interface IAttributeProps {
  item: Item;
  handleMouseOver: (ee: React.MouseEvent, item: Item) => void;
  handleMouseOut: () => void;
}

const Attribute = (props: IAttributeProps) =>
  props.item && props.item.attributes ? (
    <ul className={stylesCss.itemListSubList}>
      {props.item.attributes.map((attribute, index) => (
        <li
          key={index}
          className={`${stylesCss.itemListSubItem} c-on-base pointer`}
          onMouseOver={e => props.handleMouseOver(e, attribute)}
          onMouseOut={() => props.handleMouseOut()}
        >
          <Link
            className={`c-on-base`}
            to={`/search/${attribute.value}`}
            query={`_query=${props.item.value}&map=s,${attribute.key}`}
          >
            {attribute.label}
          </Link>
        </li>
      ))}
    </ul>
  ) : null;

export default Attribute;
