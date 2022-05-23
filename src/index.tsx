import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
const App = React?.lazy(() => import('./App'));
import reportWebVitals from './reportWebVitals';

import { ApolloClient, ApolloProvider, InMemoryCache, HttpLink, from, split } from '@apollo/client';
import config from './config';
import { WebSocketLink } from '@apollo/client/link/ws';
import { onError } from '@apollo/client/link/error';
import { notification, Spin } from 'antd';
import { getMainDefinition } from '@apollo/client/utilities';
import { updateLoginState } from './apis/axios';
import { Criteria } from './types';
import './i18n';

const httpLink = new HttpLink({
  uri: `${config.SERVER_BASE_URL}/graphql`,
  credentials: 'include',
});

const wsLink = new WebSocketLink({
  uri: `${config.SERVER_BASE_URL.replace('http', 'ws')}/graphql`,
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

const errorLink = onError(({ networkError, graphQLErrors }) => {
  try {
    if (networkError) {
      if ('statusCode' in networkError && networkError.statusCode === 401) {
        updateLoginState(null);
        notification.error({
          placement: 'bottomRight',
          message: `Session timeout`,
        });
      } else if ('statusCode' in networkError && networkError.statusCode === 400) {
        notification.error({
          placement: 'bottomRight',
          message: `Bad data input request.`,
        });
      } else {
        notification.error({
          placement: 'bottomRight',
          message: `[Network error]`,
          description: "Can't connect to server",
        });
      }
    }
    // else if (graphQLErrors) {
    //   graphQLErrors.forEach(({ message }) =>
    //     notification.error({
    //       placement: 'bottomRight',
    //       message,
    //     }),
    //   );
    // }
  } catch (error) {
    notification.error({
      message: 'Something failed with server',
      placement: 'bottomRight',
    });
  }
});

const client = new ApolloClient({
  link: from([errorLink, splitLink]),
  connectToDevTools: true,
  cache: new InMemoryCache({
    addTypename: true,
    resultCaching: true,
    typePolicies: {
      Query: {
        fields: {
          getCriteriaList: {
            merge(existing = [], incoming) {
              console.log(existing, incoming);
              return incoming;
            },
          },
          // team: {
          //   read(_, { args, toReference }) {
          //     return toReference({
          //       __typename: 'Team',
          //       id: args?.teamId,
          //     });
          //   },
          // },
          // board: {
          //   read(_, { args, toReference }) {
          //     return toReference({
          //       __typename: 'Board',
          //       id: args?.boardId,
          //     });
          //   },
          // },
        },
      },
      Column: {
        fields: {
          opinion: {},
        },
      },
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
    <Suspense
      fallback={
        <div className="flex flex-ai-c flex-jc-c" style={{ flex: 1, height: '100vh' }}>
          <Spin size="large" />
        </div>
      }
    >
      <App />
    </Suspense>
  </ApolloProvider>,
  // </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
