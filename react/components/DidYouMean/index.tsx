import { Link } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import correctionQuery from 'vtex.store-resources/QueryCorrection'
import { useSearchPage } from 'vtex.search-page-context/SearchPageContext'
import { useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import React from 'react'

interface Correction {
  correction: boolean
  misspelled: boolean
  text: string
  highlighted: string
}

const CSS_HANDLES = ['didYouMeanPrefix', 'didYouMeanTerm']

const DidYouMean = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const {
    searchQuery: {
      variables: { fullText },
    },
  } = useSearchPage()

  const { loading, data } = useQuery(correctionQuery, {
    variables: {
      fullText,
    },
  })

  const correction: Correction = data?.correction?.correction

  return !loading && correction?.correction ? (
    <p>
      <span className={`${handles.didYouMeanPrefix} c-muted-1`}>
        <FormattedMessage id="store/didYouMean" />
        {': '}
      </span>
      <span className={handles.didYouMeanTerm}>
        <Link className="link" to={`/${correction.text}?map=ft`}>
          {correction.text}
        </Link>
      </span>
    </p>
  ) : null
}

export default DidYouMean
