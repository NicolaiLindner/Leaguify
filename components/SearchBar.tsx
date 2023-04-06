import React, { ChangeEvent, FormEvent, useState } from "react";
import { Input, Button, Row, Col, Loading } from "@nextui-org/react";

interface SearchBarProps {
  onSearch: (summonerName: string, region: string) => void;
}

const regions = [
  { code: "euw1", name: "EUW" },
  { code: "na1", name: "NA" },
  { code: "eun1", name: "EUNE" },
  // More regions can be added
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState(regions[0].code);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(summonerName, region);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSummonerName(e.target.value);
  };

  const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
  };

  const handleInputEvent = (e: any) => {
    handleInputChange(e as ChangeEvent<HTMLInputElement>);
  };

  const containerStyle = {
    borderBottom: "1px solid white",
    paddingBottom: "10px",
    marginBottom: "10px",
  };

  return (
    <div style={containerStyle}>
      <Row align="center" justify="center" className="searchbar">
        <form onSubmit={handleSubmit}>
          <Row align="center">
            <select
              value={region}
              onChange={handleRegionChange}
              style={{ marginRight: "10px" }}
            >
              {regions.map((r) => (
                <option key={r.code} value={r.code}>
                  {r.name}
                </option>
              ))}
            </select>
            <Input
              underlined
              bordered
              color="secondary"
              value={summonerName}
              onChange={handleInputEvent}
              placeholder="Summoner Name"
              clearable
              style={{ marginRight: "10px" }}
            />
            <Button auto type="submit" color="gradient" shadow>
              Search
            </Button>
          </Row>
        </form>
      </Row>
    </div>
  );
};

export default SearchBar;
