import { useEffect } from "react";
import { setError } from "@store";
import { useAppDispatch, useAppSelector } from "./redux-hooks";

export function useError(timer: number = 2000): [string | null, (err: string | null) => void] {
  const error = useAppSelector((state) => state.room.error);
  const dispatch = useAppDispatch();

  const setErrorMessage = (err: string | null) => {
    dispatch(setError(err));
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(setError(null));
      }, timer);
    }
  }, [error]);

  return [error, setErrorMessage];
}
