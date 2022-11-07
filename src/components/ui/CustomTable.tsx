import styled from "@emotion/styled";
import { Pagination, Pane, Table } from "evergreen-ui";
import { FC, ReactNode, useMemo } from "react";
import { ROWS_PER_PAGE } from "../../constants";
import { padEnd } from "../../utils/helpers";

export const TableRowActions = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
`;

export const TableControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
`;

export type TableColumnProps = {
  key: string;
  label: string;
  render?: (value: any, data: any, index: number) => ReactNode;
  width?: string | number;
  className?: string;
  searchable?: boolean;
};

export type TableProps = {
  columns: TableColumnProps[];
  data: any[];
  totalItems: number;
  page: number;
  onPageChange: (page: number) => void;
  onSearch?: (search: string) => void;
  searchPlaceholder?: string;
};

const CustomTable: FC<TableProps> = ({
  columns,
  data,
  totalItems,
  page,
  onPageChange,
  onSearch,
  searchPlaceholder = 'Search',
}) => {
  const rows = useMemo(() => {
    return padEnd(data, ROWS_PER_PAGE);
  }, [data]);

  return (
    <>
      <Table>
        <Table.Head>
          {
            columns.map((column) => {
              if (column.searchable === true) {
                return (
                  <Table.SearchHeaderCell
                    key={column.key}
                    width={column.width}
                    placeholder={searchPlaceholder}
                    onChange={onSearch}
                  />
                );
              }

              return (
                <Table.TextHeaderCell width={column.width} key={column.key}>{column.label}</Table.TextHeaderCell>
              );
            })
          }
        </Table.Head>
        <Table.Body>
          {
            rows.map((row, index) => {
              if (row === null)
                return <Table.Row key={index} height={36} />;

              return (
                <Table.Row key={index} height={36}>
                  {
                    columns.map((column) => {
                      const cellKey = row[column.key];
                      if (column.render) {
                        return (
                          <Table.Cell key={cellKey}>
                            <Pane>
                              {column.render(row[column.key], row, index)}
                            </Pane>
                          </Table.Cell>
                        );
                      }

                      return (
                        <Table.TextCell key={cellKey}>{row[column.key]}</Table.TextCell>
                      );
                    })
                  }
                </Table.Row>
              );
            })
          }
        </Table.Body>
      </Table>
      {
        totalItems > ROWS_PER_PAGE && (
          <Pagination
            alignSelf="flex-end"
            page={page}
            totalPages={Math.ceil(totalItems / ROWS_PER_PAGE)}
            onPageChange={onPageChange}
            onNextPage={() => onPageChange(page + 1)}
            onPreviousPage={() => onPageChange(page - 1)}
            ></Pagination>
        )
      }
    </>
  );
};

export default CustomTable;
