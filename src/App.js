import { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
} from "@material-ui/core";

import InfoBox from "./components/InfoBox";
import LineGraph from "./components/LineGraph";
import Map from "./components/Map";
import Table from "./components/Table";
import { prettyPrintStat, sortData } from "./utils/common";

import "leaflet/dist/leaflet.css";
import './App.css';

const WORLDWIDE = "worldwide";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(WORLDWIDE);
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState ({ lat: 34.80746, lng: -40.4786});
  const [mapZoom, setMapZoom] = useState(3);
  const [dataType, setDataType] = useState("cases");

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then(response => response.json())
      .then(data => {

        setMapCountries(data); //Set all data of each of the countries

        const countries = data.map(country => ({
          name: country.country,
          value: country.countryInfo.iso2, 
        })
        );
        setCountries(countries);
        const sortedData = sortData(data);
        setTableData(sortedData);
      });
    }

    getCountriesData();
    getWorldwideData();
    
  }, []);

  const getWorldwideData = async () => {
    await fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => setCountryInfo(data))
  }

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    if (countryCode === 'worldwide') {
      getWorldwideData();
      setMapCenter([ 34.80746, -40.4786 ]);
      setMapZoom(3);
      return;
    }

    const URL = 'https://disease.sh/v3/covid-19/countries/' + countryCode;

    await fetch(URL)
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })

  }

  return (
    <div className="app">
      
      <div className="app__left">
        <div className="app__header">
        <h1>COVID-19 TRACKER</h1>

        <FormControl className="app__dropdown">
          <Select 
            variant="outlined"
            value={country}
            onChange={onCountryChange}
          >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map(country => (
              <MenuItem
                value={country.value}
              >
                {country.name}
              </MenuItem>
            ))}


            </Select>
        </FormControl>
        </div> 


        <div className="app__stats">
          <InfoBox 
            active={dataType === "cases"}
            onClick={e => setDataType("cases")}
            title="Coronavirus cases" 
            total={countryInfo.cases} 
            cases={prettyPrintStat(countryInfo.todayCases)} 
          />
          <InfoBox
            active={dataType === "recovered"} 
            onClick={e => setDataType("recovered")}
            title="Recovered" 
            total={countryInfo.recovered} 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
          />
          <InfoBox 
            active={dataType === "deaths"}
            onClick={e => setDataType("deaths")}
            title="Deaths" 
            total={countryInfo.deaths}
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
          />
        </div>

        <Map countries={mapCountries} dataType={dataType} center={mapCenter} zoom={mapZoom} />
      </div>

      <Card className="app__right">
          <CardContent>
              <h3> Live cases by country </h3>
              
        {/* Table */}
              <Table countries={tableData} />
              <h3> Worldwide new {dataType} </h3>
       
              <LineGraph dataType={dataType} />
        {/* Graph */}
          </CardContent>

      </Card>


    </div>
  );
}

export default App;