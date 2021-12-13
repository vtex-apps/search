/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import * as React from 'react'
import { Link } from 'vtex.render-runtime'

import { Item, AttributeItem } from './types'
import stylesCss from './styles.css'
import Attribute from './Attribute'

interface ItemListProps {
  title: string | JSX.Element
  items: Item[]
  showTitle: boolean
  onItemClick: (term: string, position: number) => void
  modifier?: string
  onItemHover?: (item: Item | AttributeItem) => void
  showTitleOnEmpty?: boolean
  customPage?: string
  closeModal: () => void
}

interface ItemListState {
  currentTimeoutId: ReturnType<typeof setTimeout> | null
}

export class ItemList extends React.Component<ItemListProps> {
  public readonly state: ItemListState = {
    currentTimeoutId: null,
  }

  handleMouseOver = (e: React.MouseEvent | React.FocusEvent, item: Item) => {
    e.stopPropagation()

    const { currentTimeoutId } = this.state

    if (!currentTimeoutId) {
      const timeoutId = setTimeout(() => {
        this.props.onItemHover ? this.props.onItemHover(item) : null
        this.setState({ currentTimeoutId: null })
      }, 100)

      this.setState({ currentTimeoutId: timeoutId })
    }
  }

  handleMouseOut = () => {
    const { currentTimeoutId } = this.state

    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId)
      this.setState({ currentTimeoutId: null })
    }
  }

  render() {
    if (this.props.items.length === 0 && !this.props.showTitleOnEmpty) {
      return null
    }

    const modifier = this.props.modifier
      ? stylesCss[`itemList--${this.props.modifier}`]
      : ''

    return (
      <article className={`${stylesCss.itemList} ${modifier}`}>
        {this.props.showTitle ? (
          <p className={`${stylesCss.itemListTitle} c-on-base`}>
            {this.props.title}
          </p>
        ) : null}
        <ol className={stylesCss.itemListList}>
          {this.props.items.map((item, index) => {
            return (
              <li
                key={item.value}
                className={`${stylesCss.itemListItem}`}
                onMouseOver={e => this.handleMouseOver(e, item)}
                onFocus={e => this.handleMouseOver(e, item)}
                onMouseOut={() => this.handleMouseOut()}
                onBlur={() => this.handleMouseOut()}
              >
                <Link
                  page={this.props.customPage ?? 'store.search'}
                  params={{
                    term: item.value,
                  }}
                  query={`map=ft&_q=${item.value}`}
                  onClick={() => this.props.onItemClick(item.value, index)}
                  className={stylesCss.itemListLink}
                >
                  {item.icon ? (
                    <span className={stylesCss.itemListIcon}>{item.icon}</span>
                  ) : null}

                  {item.prefix ? (
                    <span className={stylesCss.itemListPrefix}>
                      {item.prefix}
                    </span>
                  ) : null}

                  <span className={`${stylesCss.itemListLinkTitle} c-on-base`}>
                    {item.label}
                  </span>
                </Link>
                <Attribute
                  item={item}
                  onMouseOver={this.handleMouseOver}
                  onMouseOut={this.handleMouseOut}
                  closeModal={this.props.closeModal}
                />
              </li>
            )
          })}
        </ol>
      </article>
    )
  }
}
