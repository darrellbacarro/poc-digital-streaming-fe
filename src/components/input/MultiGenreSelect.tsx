import { Badge, Menu, Pane, Popover, Position, TextInput } from "evergreen-ui";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { Actor, Genre } from "../../redux/models";
import { DataRoute, loadData } from "../../utils/api";

type MultiGenreSelectProps = {
  value?: any;
  onChange?: any;
};

const MultiGenreSelect: FC<MultiGenreSelectProps> = ({
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<Genre[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [search, setSearch] = useState("");

  const handleInputChange: any = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const data = await loadData(DataRoute.Genres, {
      q: value,
      limit: 10,
      page: 1,
    });

    setSearch(value);
    setOptions(data.data.items);
    setShowPopover(true);
  }, [setOptions, setShowPopover, setSearch]);

  const validOptions = useMemo(() => {
    const values = value ?? [];
    return options.filter((o) => !values.find((v: Genre) => v.id === o.id));
  }, [options, value]);

  return (
    <>
      <Pane marginBottom={8} display="flex" gap={4}>
        { (value ?? []).map((v: Genre) => {
          return <Badge isInteractive onClick={() => {
            onChange(value.filter((o: Actor) => o.id !== v.id));
          }}>{v.title}</Badge>
        }) }
      </Pane>
      <Popover
        onClose={() => setShowPopover(false)}
        isShown={showPopover}
        position={Position.BOTTOM_LEFT}
        content={
          ({ close }) => {
            return (
              <Menu>
                {validOptions.map((option) => (
                  <Menu.Item key={option.id} onClick={() => {
                    onChange([...(value ?? []), option]);
                    setSearch('');
                    close();
                  }}>{ option.title }</Menu.Item>
                ))}
              </Menu>
            );
          }
        }
      >
        <TextInput width="100%" placeholder="Search Genres" value={search} onChange={handleInputChange} />
      </Popover>
    </>
  )
};

export default MultiGenreSelect;
