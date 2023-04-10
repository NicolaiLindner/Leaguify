import React, { ChangeEvent, FormEvent, useState } from "react";
import { Input, Button, Row, Col, Loading } from "@nextui-org/react";

interface SearchBarProps {
  onSearch: (summonerName: string, region: string) => void;
}

// Define the available regions for searching
const regions = [
  { code: "euw1", name: "EUW" },
  { code: "na1", name: "NA" },
  { code: "eun1", name: "EUNE" },
  // More regions can be added
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  // State variables for the summoner name and region
  const [summonerName, setSummonerName] = useState("");
  const [region, setRegion] = useState(regions[0].code);

  // Handle the form submission event
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(summonerName, region);
  };

  // Handle changes to the input element for summoner name
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSummonerName(e.target.value);
    onSearch(e.target.value, region);
  };

  // Handle changes to the region selection dropdown
  const handleRegionChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRegion(e.target.value);
    onSearch(summonerName, e.target.value); // Call onSearch with the updated region and current summonerName
  };

  // Wrapper function for handling input events
  const handleInputEvent = (e: any) => {
    handleInputChange(e as ChangeEvent<HTMLInputElement>);
  };

  // Define the container style
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
            {/* Render the region selection dropdown */}
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
            {/* Render the summoner name input field */}
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
            {/* Render the search button */}
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
