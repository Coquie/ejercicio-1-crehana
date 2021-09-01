import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    paper: {
      backgroundColor: "#c0d9fe0d"
    },
    tableRow: {
      cursor: "pointer",
    },
    title: {
      fontSize: "42px",
      fontWeight: "bold",
      margin: "30px 0 10px",
    },
  })
);

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      currency
      name
      continent {
        code
        name
      }
    }
    continents {
      code
      name
    }
  }
`;

export default function Countries() {
  const classes = useStyles();
  const history = useHistory();
  const [countries, setCountries] = useState([] as any[]);
  const [continents, setContinents] = useState([] as any[]);
  const [currencies, setCurrencies] = useState([] as any[]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterContinentTerm, setFilterContinentTerm] = useState("");
  const [filterCurrencyTerm, setFilterCurrencyTerm] = useState("");
  const { loading, error, data } = useQuery(GET_COUNTRIES);

  useEffect(() => {
    if (data) {
      setCountries(data.countries);
      setContinents(data.continents);
      let currencies = data.countries
        .map((country: any) =>
          country.currency === null ? null : country.currency
        )
        .filter(
          (currency: any, i: any, a: string | any[]) =>
            currency !== null && a.indexOf(currency) === i
        );
      setCurrencies(currencies);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const countries = data.countries.filter((country: any) => {
        return (
          country.currency !== null &&
          country.currency.includes(filterCurrencyTerm) &&
          country.name.toLowerCase().includes(searchTerm) &&
          country.continent.code.includes(filterContinentTerm)
        );
      });
      setCountries(countries);
    }
  }, [data, filterCurrencyTerm, filterContinentTerm, searchTerm]);

  //TODO loading y error components
  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>`Error! ${error.message}`</h1>;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterContinent = (event: any) => {
    setFilterContinentTerm(event.target.value);
  };

  const handleRowClick = (code: any) => {
    history.push(`/${code}`);
  };

  const handleFilterCurrency = (event: any) => {
    setFilterCurrencyTerm(event.target.value);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  return (
    <Container>
      <Typography align="center" component="h1" className={classes.title}>
        List of Countries
      </Typography>
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={3}
          justifyContent="space-around"
          direction="row"
        >
          <Grid item>
            <FormControl className={classes.formControl}>
              <TextField label="Search Country" onChange={handleSearch} />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Continent</InputLabel>
              <Select
                value={filterContinentTerm}
                onChange={handleFilterContinent}
              >
                <MenuItem value="">Filter by Continent</MenuItem>
                {continents.map((continent) => (
                  <MenuItem key={continent.code} value={continent.code}>
                    {continent.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl className={classes.formControl}>
              <InputLabel id="demo-simple-select-label">Currency</InputLabel>
              <Select
                value={filterCurrencyTerm}
                onChange={handleFilterCurrency}
              >
                <MenuItem value="">Filter by Currency</MenuItem>
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Country</TableCell>
                <TableCell>Continent</TableCell>
                <TableCell>Currency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {countries
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((country: any) => (
                  <TableRow
                    className={classes.tableRow}
                    onClick={() => handleRowClick(country.code)}
                    hover
                    key={country.code}
                  >
                    <TableCell component="th" scope="row">
                      {country.name}
                    </TableCell>
                    <TableCell>{country.continent.name}</TableCell>
                    <TableCell>{country.currency}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  count={countries.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
