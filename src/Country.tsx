import React from "react";
import { gql, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  backLink: {
    textDecoration: "none",
  },
  card: {
    maxWidth: "50%",
    minWidth: "30%",
    padding: 10,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: 50,
  },
  containerContent: {
    padding: 40,
  },
  countryCode: {
    fontSize: 14,
  },
  countryInfoGrid: {
    textAlign: "center",
  },
  countryInfoGridTitle: {
    fontSize: 16,
    margin: "12px 0 7px",
    textTransform: "uppercase",
  },
  countryName: {
    backgroundColor: "#e8f1ff",
    border: "1px solid #235cb2",
    borderRadius: 10,
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: 10,
    padding: "40px 12px",
    textTransform: "uppercase",
  },
  pos: {
    marginBottom: 12,
  },
});

const GET_COUNTRY = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      code
      name
      currency
      continent {
        name
      }
      languages {
        name
      }
      capital
    }
  }
`;

function GridItem(props: any) {
  const classes = useStyles();
  return (
    <Grid item className={classes.countryInfoGrid}>
      <Typography
        className={classes.countryInfoGridTitle}
        color="textSecondary"
      >
        {props.title}
      </Typography>
      {props.children}
    </Grid>
  );
}

export default function Countries() {
  const classes = useStyles();
  let { code } = useParams<{ code: string }>();

  const { loading, error, data } = useQuery(GET_COUNTRY, {
    variables: { code },
  });

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>`Error! ${error.message}`</h1>;

  console.log(data);

  return (
    <Container className={classes.container}>
      <Card className={classes.card} variant="outlined" raised={true}>
        <CardContent>
          <CardActions>
            <Link className={classes.backLink} to="/">
              <Button color="primary" variant="contained" disableElevation>
                Go Back
              </Button>
            </Link>
          </CardActions>
          <Container className={classes.containerContent}>
            <Typography
              className={classes.countryCode}
              color="textSecondary"
              gutterBottom
            >
              {data.country.code}
            </Typography>
            <Typography className={classes.countryName} align="center">
              {data.country.name}
            </Typography>
            <Grid container spacing={3} justifyContent="space-around">
              <GridItem title="Capital City">
                <Typography>
                  <strong>{data.country.capital}</strong>
                </Typography>
              </GridItem>
              <GridItem title="Currency">
                <Typography>
                  <strong>{data.country.currency}</strong>
                </Typography>
              </GridItem>
              <GridItem title="Continent">
                <Typography>
                  <strong>{data.country.continent.name}</strong>
                </Typography>
              </GridItem>
              <GridItem title="Languages Spoken">
                {data.country.languages.map((language: any) => (
                  <Typography>
                    <strong>{language.name}</strong>
                  </Typography>
                ))}
              </GridItem>
            </Grid>
          </Container>
        </CardContent>
      </Card>
    </Container>
  );
}
