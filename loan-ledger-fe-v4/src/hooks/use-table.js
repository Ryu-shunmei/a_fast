import { useState, useCallback } from "react";

// ----------------------------------------------------------------------

export default function useTable(props) {
  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || "id");

  const [rowsPerPage, setRowsPerPage] = useState(
    props?.defaultRowsPerPage || 10
  );

  const [order, setOrder] = useState(props?.defaultOrder || "asc");

  const onSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === "asc";
      if (id !== "") {
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

  const onChangeRowsPerPage = useCallback((event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const emptyRows = (page, rowsPerPage, arrayLength) => {
    return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
  };

  const descendingComparator = (a, b, orderBy) => {
    if (a[orderBy] === null) {
      return 1;
    }
    if (b[orderBy] === null) {
      return -1;
    }
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  return {
    order,
    page,
    orderBy,
    rowsPerPage,
    //
    onSort,
    onChangePage,
    onResetPage,
    onChangeRowsPerPage,
    //
    setPage,
    setOrder,
    setOrderBy,
    setRowsPerPage,
    //
    emptyRows,
    getComparator,
  };
}
