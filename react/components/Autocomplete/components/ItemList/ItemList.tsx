import * as React from "react";
import { Item, AttributeItem } from "./types";
import stylesCss from "./styles.css";
import { Link } from "vtex.render-runtime";
import Attribute from "./Attribute";

interface ItemListProps {
  title: string | JSX.Element;
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
          <p className={`${stylesCss.itemListTitle} c-on-base`}>
            {this.props.title}
          </p>
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
                    <span className={stylesCss.itemListIcon}>{item.icon}</span>
                  ) : null}

                  {item.prefix ? (
                    <span className={stylesCss.itemListPrefix}>
                      {item.prefix}
                    </span>
                  ) : null}
                  <span className="c-on-base">{item.label}</span>
                </Link>
                <Attribute
                  item={item}
                  handleMouseOver={this.handleMouseOver.bind(this)}
                  handleMouseOut={this.handleMouseOut.bind(this)}
                />
              </li>
            );
          })}
        </ol>
      </article>
    );
  }
}
