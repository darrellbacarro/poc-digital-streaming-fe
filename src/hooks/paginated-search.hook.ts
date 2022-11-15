import { AsyncThunk } from "@reduxjs/toolkit";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { ROWS_PER_PAGE } from "../constants";
import { ApiData, LoadDataFilter } from "../utils/api";
import { useAppDispatch } from "./redux.hook";

export function usePaginatedSearch(
  loader: AsyncThunk<ApiData<any>, LoadDataFilter | undefined, {}>,
  filters: LoadDataFilter = {},
) {
  const [fltr, setFltr] = useState<LoadDataFilter>({
    limit: ROWS_PER_PAGE,
    ...filters,
  });
  const dispatch = useAppDispatch();

  const handleSearch = useCallback(
    debounce((search: string) => {
      setFltr((prev) => ({ ...prev, q: search }));
    }, 200),
    [setFltr]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setFltr((prev) => ({ ...prev, page }));
    },
    [setFltr]
  );

  const handleLoad = useCallback(() => {
    dispatch(loader(fltr));
  }, [dispatch, fltr]);

  useEffect(() => {
    handleLoad();
  }, [fltr]);

  return {
    filter: fltr,
    handleSearch,
    handlePageChange,
    handleLoad,
  };
}
