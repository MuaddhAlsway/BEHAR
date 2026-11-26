
import { useEffect, useState } from "react";

export default function usePersistentState({
  initialState,
  load,
  save,
}) {
  const [state, setState] = useState(() =>
    load(initialState)
  );

  useEffect(() => {
    save(state);
  }, [state, save]);

  return [state, setState];
}
