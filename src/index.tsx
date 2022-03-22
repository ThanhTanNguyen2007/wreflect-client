import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './styles/css/style.css';

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, split } from '@apollo/client';
import config from './config';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
import { notification } from 'antd';
import { getMainDefinition } from '@apollo/client/utilities';
import { updateLoginState } from './apis/axios';

const httpLink = new HttpLink({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: `${config.SERVER_BASE_URL.replace('https', 'ws').replace('wss', 'ws')}/graphql`,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const errorLink = onError((error) => {
  try {
    if (error.networkError) {
      console.log(error.networkError.message);
      if ('statusCode' in error.networkError && error.networkError.statusCode === 401) {
        updateLoginState(null);
        notification.error({
          placement: 'bottomRight',
          message: `Session timeout`,
        });
      } else {
        notification.error({
          placement: 'bottomRight',
          message: `[Network error]`,
          description: "Can't connect to server",
        });
      }
    }
  } catch (error) {
    notification.error({
      message: 'Something failed with server',
      placement: 'bottomRight',
    });
  } finally {
    if (error?.response?.errors) {
      error.graphQLErrors = null;
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  connectToDevTools: true,
  cache: new InMemoryCache({
    addTypename: true,
    resultCaching: true,

    typePolicies: {
      // Query: {
      //   fields: {
      //     team: {
      //       read(_, { args, toReference }) {
      //         return toReference({
      //           __typename: 'Team',
      //           id: args?.teamId,
      //         });
      //       },
      //     },
      //     board: {
      //       read(_, { args, toReference }) {
      //         return toReference({
      //           __typename: 'Board',
      //           id: args?.boardId,
      //         });
      //       },
      //     },
      //   },
      // },
      // Column: {
      //   fields: {
      //     opinion: {
      //     }
      //   }
      // }
      // Column: {
      //   fields: {
      //     opinions: {
      //       merge(existing: Opinion[], incoming: Opinion[]) {
      //         return [...incoming];
      //       },
      //     },
      //   },
      // },
      // Board: {
      //   fields: {
      //     columns: {
      //       merge(existing: Column[], incoming: Column[]) {
      //         return [...incoming];
      //       },
      //     },
      //   },
      // },
    },
  }),
});

ReactDOM.render(
  // <React.StrictMode>
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
