import ApolloClient from "apollo-boost";

import * as config from '../config';

const client = new ApolloClient({
  uri: `${config.PROTO}://${config.HOST}:${config.PORT}/graphql`,
  credentials: "include"
});

export default client;