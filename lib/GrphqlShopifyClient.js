import { GraphQLClient }                    from 'graphql-request';
import { GRQL_ENDPOINT, APP_ACCESS_TOKEN }  from './config.js';

const endpoint = GRQL_ENDPOINT
const headers = {
    'X-Shopify-Access-Token': APP_ACCESS_TOKEN
};

const client = new GraphQLClient( endpoint, { headers } );

export default client;
