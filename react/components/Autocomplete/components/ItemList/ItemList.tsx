import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Item, AttributeItem } from "./types";
import stylesCss from "./styles.css";
import { Link } from "vtex.render-runtime";

interface ItemListProps {
  title: string;
  items: Item[];
  showTitle: boolean;
  modifier?: string;
  onItemHover?: (item: Item | AttributeItem) => void;
  showTitleOnEmpty?: boolean;
}

interface ItemListState {
  currentTimeoutId: ReturnType<typeof setTimeout> | null;
}

export class ItemList extends React.Component<ItemListProps> {
  public readonly state: ItemListState = {
    currentTimeoutId: null,
  };

  handleMouseOver(e: React.MouseEvent, item: Item) {
    e.stopPropagation();

    const { currentTimeoutId } = this.state;

    if (!currentTimeoutId) {
      const timeoutId = setTimeout(() => {
        this.props.onItemHover ? this.props.onItemHover!(item) : null;
        this.setState({ currentTimeoutId: null });
      }, 100);

      this.setState({ currentTimeoutId: timeoutId });
    }
  }

  handleMouseOut() {
    const { currentTimeoutId } = this.state;

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
      this.setState({ currentTimeoutId: null });
    }
  }

  renderAttributes(item: Item) {
    if (!item.attributes || item.attributes.length === 0) {
      return null;
    }

    return (
      <ul className={stylesCss.itemListSubList}>
        {item.attributes.map((attribute, index) => (
          <li
            key={index}
            className={`${stylesCss.itemListSubItem} c-on-base pointer`}
            onMouseOver={e => this.handleMouseOver(e, attribute)}
            onMouseOut={() => this.handleMouseOut()}
          >
            <Link
              to={`/search/${attribute.value}`}
              query={`_query=${item.value}&map=s,${attribute.key}`}
            >
              {attribute.label}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    if (this.props.items.length === 0 && !this.props.showTitleOnEmpty) {
      return null;
    }

    const modifier = this.props.modifier
      ? stylesCss[`itemList--${this.props.modifier}`]
      : "";

    return (
      <article className={`${stylesCss.itemList} ${modifier}`}>
        {this.props.showTitle ? (
          <h1 className={`${stylesCss.itemListTitle} c-on-base`}>
            {this.props.title}
          </h1>
        ) : null}
        <ol className={stylesCss.itemListList}>
          {this.props.items.map(item => {
            return (
              <li
                key={item.value}
                className={`${stylesCss.itemListItem}`}
                onMouseOver={e => this.handleMouseOver(e, item)}
                onMouseOut={() => this.handleMouseOut()}
              >
                <Link to={item.link} query={`_query=${item.value}`}>
                  {item.icon ? (
                    <span className={stylesCss.itemListIcon}>
                      <FontAwesomeIcon icon={item.icon} />
                    </span>
                  ) : null}

                  {item.prefix ? (
                    <span className={stylesCss.itemListPrefix}>
                      {item.prefix}
                    </span>
                  ) : null}
                  <span className="c-on-base">{item.label}</span>
                </Link>
                {this.renderAttributes(item)}
              </li>
            );
          })}
        </ol>
      </article>
    );
  }
}
