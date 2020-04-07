import { Link } from "vtex.render-runtime";
import { useCssHandles } from "vtex.css-handles";
import { FormattedMessage } from "react-intl";

interface DidYouMeanProps {
  correction: {
    correction: boolean;
    misspelled: boolean;
    text: string;
    highlighted: string;
  };
}

const CSS_HANDLES = ["didYouMeanPrefix", "didYouMeanTerm"];

const DidYouMean = (props: DidYouMeanProps) => {
  const handles = useCssHandles(CSS_HANDLES);

  return props.correction && props.correction.correction ? (
    <p>
      <span className={`${handles.didYouMeanPrefix} c-muted-1`}>
        <FormattedMessage id={"store/didYouMean"} />
        {": "}
      </span>
      <span className={handles.didYouMeanTerm}>
        <Link className="link" to={`/${props.correction.text}?map=ft`}>
          {props.correction.text}
        </Link>
      </span>
    </p>
  ) : null;
};

export default DidYouMean;
