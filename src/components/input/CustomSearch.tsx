import styled from "@emotion/styled";
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const SearchContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background-color 300ms;

  &:focus-within {
    background-color: rgba(0, 0, 0, 0.8);
  }

  & > input[type='text'] {
    background-color: transparent;
    border: 0;
    width: 250px;
    color: white;
    font-size: 14px;

    &:focus {
      outline: none;
    }
  }
`;

const CustomSearch = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    navigate(`/search?q=${e.target.value}`);
  }, [navigate]);

  return (
    <SearchContainer>
      <FontAwesomeIcon icon={solid('search')} />
      <input
        onChange={handleChange}
        value={sp.get('q') ?? ''}
        type="text"
        placeholder="Search for Movies, Actors" />
    </SearchContainer>
  );
};

export default CustomSearch;
