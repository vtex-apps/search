/* eslint-disable no-restricted-syntax */
import { useCssHandles } from 'vtex.css-handles'
import bannersQuery from 'vtex.store-resources/QueryBanners'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useQuery } from 'react-apollo'
import React from 'react'

interface ElasticBanner {
  id: string
  name: string
  area: string
  html: string
}

// eslint-disable-next-line no-shadow
enum HorizotalAlignment {
  Left = 'left',
  Right = 'right',
  Center = 'center',
}

interface BannerProps {
  area: string
  blockClass?: string
  horizontalAlignment?: HorizotalAlignment
}

interface SelectedFacet {
  key: string
  value: string
}

const getAlignmentClass = (alignment: HorizotalAlignment | undefined) => {
  switch (alignment) {
    case 'left':
      return 'justify-start'

    case 'right':
      return 'justify-end'

    default:
      return 'justify-center'
  }
}

const Banner = (props: BannerProps) => {
  const { area, horizontalAlignment } = props

  const CSS_HANDLES = ['searchBanner']
  const handles = useCssHandles(CSS_HANDLES)

  const { searchQuery } = useSearchPage()

  if (!searchQuery) {
    return null
  }

  const {
    variables: { fullText, selectedFacets },
  } = searchQuery

  const { loading, data } = useQuery(bannersQuery, {
    variables: {
      fullText,
      selectedFacets: selectedFacets.filter(
        (facet: SelectedFacet) => facet.key !== 'ft'
      ),
    },
  })

  if (loading || !data) {
    return null
  }

  const banners = data?.banners?.banners || []

  const selectedBanner = banners.find(
    (banner: ElasticBanner) => banner.area === area
  )

  if (!selectedBanner) {
    return null
  }

  const className = `flex ${getAlignmentClass(horizontalAlignment)} ${
    handles.searchBanner
  }`

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: selectedBanner.html }}
    />
  )
}

export default Banner
