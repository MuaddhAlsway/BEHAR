import { forwardRef, useState } from "react";

const LazyImage = forwardRef(function LazyImage({ className = "", ...props }, ref) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <span className="behar-lazy-image__skeleton" aria-hidden="true" />}
      <img
        ref={ref}
        {...props}
        className={`${className}${loaded ? " is-loaded" : ""}`}
        loading={props.loading || "lazy"}
        decoding={props.decoding || "async"}
        onLoad={(event) => {
          setLoaded(true);
          props.onLoad?.(event);
        }}
        onError={(event) => {
          setLoaded(true);
          props.onError?.(event);
        }}
      />
    </>
  );
});

export default LazyImage;
