import ApolloClient from "apollo-boost";

import * as config from '../config';

const client = new ApolloClient({
  uri: `/graphql`,
  credentials: "include"
});

export default client;