import { Badge, Menu, Pane, Popover, Position, TextInput } from "evergreen-ui";
import { ChangeEvent, FC, useCallback, useMemo, useState } from "react";
import { Actor } from "../../redux/models";
import { DataRoute, loadData } from "../../utils/api";

type MultiActorSelectProps = {
  value?: any;
  onChange?: any;
};

const MultiActorSelect: FC<MultiActorSelectProps> = ({
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<Actor[]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [search, setSearch] = useState("");

  const handleInputChange: any = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const data = await loadData(DataRoute.Actors, {
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
    return options.filter((o) => !values.find((v: Actor) => v.actorId === o.id));
  }, [options, value]);

  return (
    <>
      <Pane marginBottom={8} display="flex" gap={4}>
        { (value ?? []).map((v: Actor) => {
          return <Badge color="blue" isInteractive onClick={() => {
            onChange(value.filter((o: Actor) => o.id !== v.id));
          }}>{v.name}</Badge>
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
                    onChange([...(value ?? []), {
                      actorId: option.id,
                      name: [option.firstname, option.lastname].join(' '),
                      photo: option.photo,
                    }]);
                    setSearch('');
                    close();
                  }}>{ [option.firstname, option.lastname].join(' ') }</Menu.Item>
                ))}
              </Menu>
            );
          }
        }
      >
        <TextInput width="100%" placeholder="Search Actors" value={search} onChange={handleInputChange} />
      </Popover>
    </>
  )
};

export default MultiActorSelect;
