import { useState } from "react";

export default function LazyImage({ className = "", ...props }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <span className="behar-lazy-image__skeleton" aria-hidden="true" />}
      <img
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
}
