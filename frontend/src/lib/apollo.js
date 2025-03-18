import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { from } from '@apollo/client';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message }) => console.error(message));
  }
  if (networkError) console.error(`Network error: ${networkError.message}`);
});

const httpLink = new HttpLink({
  uri: '/api/graphql',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});
