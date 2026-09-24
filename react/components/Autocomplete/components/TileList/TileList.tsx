import React, { FC, useEffect, useRef } from 'react'
import { ExtensionPoint, Link } from 'vtex.render-runtime'
import { Spinner } from 'vtex.styleguide'
import ProductSummary from 'vtex.product-summary/ProductSummaryCustom'
import { FormattedMessage } from 'react-intl'

import styles from './styles.css'
import CustomListItem from '../CustomListItem/CustomListItem'
import { ProductLayout } from '../..'

type ProductClickHandler = (
  product: string,
  position: number,
  term: string
) => void

interface TileListProps {
  /** Encoded term, only for the "see all" link. */
  term: string
  /** Raw term of the search whose products are shown. */
  clickTerm: string
  title: string | JSX.Element
  customPage?: string
  products: any[]
  showTitle: boolean
  shelfProductCount: number
  totalProducts: number
  layout: ProductLayout
  isLoading: boolean
  onProductClick: ProductClickHandler
  onProductNavigate: () => void
  onSeeAllClick: (term: string) => void
  HorizontalProductSummary?: React.ComponentType<{
    product: Product
    placement: string
    actionOnClick: () => void
  }>
  searchId: string
}

const AUTOCOMPLETE_PLACEMENT = 'autocomplete'

interface ProductTileProps {
  product: any
  index: number
  searchId: string
  clickTerm: string
  onProductClick: ProductClickHandler
}

/**
 * Product card wrapper. The legacy click listens in the capture phase on the
 * same `<li>` that Activity Flow reads, so any click inside the card counts
 * once on both sides, even when a card button stops propagation.
 */
const ProductTile: FC<ProductTileProps> = ({
  product,
  index,
  searchId,
  clickTerm,
  onProductClick,
  children,
}) => {
  const ref = useRef<HTMLLIElement>(null)
  const latest = useRef({ index, clickTerm, onProductClick })

  latest.current = { index, clickTerm, onProductClick }

  const { productId } = product

  useEffect(() => {
    const node = ref.current

    if (!node || !productId) {
      return undefined
    }

    const handleClick = () => {
      const {
        index: position,
        clickTerm: term,
        onProductClick: emit,
      } = latest.current

      emit(productId, position, term)
    }

    node.addEventListener('click', handleClick, true)

    return () => node.removeEventListener('click', handleClick, true)
  }, [productId])

  return (
    <li
      ref={ref}
      className={styles.tileListItem}
      data-af-element={searchId ? 'search-autocomplete' : undefined}
      data-af-onclick={searchId && productId ? true : undefined}
      data-af-search-id={searchId}
      data-af-product-position={index + 1}
      data-af-product-id={productId}
      data-af-product-specification={product.specification}
    >
      {children}
    </li>
  )
}

const TileList: FC<TileListProps> = ({
  term,
  clickTerm,
  title,
  products,
  showTitle,
  totalProducts,
  layout,
  isLoading,
  onProductClick,
  onProductNavigate,
  onSeeAllClick,
  HorizontalProductSummary,
  customPage,
  searchId,
}) => {
  if (products.length === 0 && !isLoading) {
    if (!term || !searchId) {
      return null
    }

    return (
      <section
        data-af-element="search-autocomplete"
        data-af-onimpression
        data-af-search-id={searchId}
      />
    )
  }

  return (
    <section
      className={styles.tileList}
      data-af-element={searchId ? 'search-autocomplete' : undefined}
      data-af-onimpression={searchId ? true : undefined}
      data-af-search-id={searchId}
    >
      {showTitle ? (
        <p className={`${styles.tileListTitle} c-on-base`}>{title}</p>
      ) : null}
      {isLoading ? (
        <div className={styles.tileListSpinner}>
          <Spinner />
        </div>
      ) : (
        <>
          <ul
            className={styles.tileListList}
            style={{
              flexDirection:
                layout === ProductLayout.Horizontal ? 'column' : 'row',
            }}
          >
            {products.map((product, index: number) => {
              const productSummary: Product = ProductSummary.mapCatalogProductToProductSummary(
                product
              )

              return (
                <ProductTile
                  key={product.productId}
                  product={product}
                  index={index}
                  searchId={searchId}
                  clickTerm={clickTerm}
                  onProductClick={onProductClick}
                >
                  {layout === ProductLayout.Horizontal ? (
                    HorizontalProductSummary ? (
                      <HorizontalProductSummary
                        product={productSummary}
                        placement={AUTOCOMPLETE_PLACEMENT}
                        actionOnClick={onProductNavigate}
                      />
                    ) : (
                      <CustomListItem
                        product={productSummary}
                        onClick={onProductNavigate}
                      />
                    )
                  ) : (
                    <ExtensionPoint
                      id="product-summary"
                      product={productSummary}
                      placement={AUTOCOMPLETE_PLACEMENT}
                      actionOnClick={onProductNavigate}
                    />
                  )}
                </ProductTile>
              )
            })}
          </ul>

          <footer className={styles.tileListFooter}>
            {totalProducts > 0 ? (
              <Link
                query={`map=ft&_q=${term}`}
                params={{
                  term,
                }}
                page={customPage || 'store.search'}
                className={styles.tileListSeeMore}
                onClick={() => onSeeAllClick(term)}
              >
                <FormattedMessage
                  id="store/seeMore"
                  values={{ count: totalProducts }}
                />
              </Link>
            ) : null}
          </footer>
        </>
      )}
    </section>
  )
}

export default TileList
