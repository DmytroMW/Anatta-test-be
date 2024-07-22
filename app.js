import client from './lib/GrphqlShopifyClient.js';

(async function () {
    try {
        const search = process.argv[3];
        if ( !search ) {
            console.error('Search string is absent.');
            return;
        }
        
        const document = { 
            query: `
                query( $numRows: Int!, $search: String! ) {
                    products( first: $numRows, query: $search ) {
                        edges {
                            node {
                                title
                                variants( first: $numRows ) {
                                    edges {
                                        node {
                                            id
                                            title   
                                            price
                                        }
                                    }
                                }
                            }
                        }
                    }
                }`,
            variables: {
                numRows: 250,
                search: `title:${process.argv[3]}*`
            }
        };
        
        const data = await client.request( document.query, document.variables );

        if ( !data?.products?.edges?.length ) {
            console.log("No products found.");
            return;
        }

        const productEdges = data.products.edges;
        const resultArray = [];

        productEdges.forEach( productEdge  => {
            const variants = productEdge.node.variants.edges;
            variants.forEach( variant => {
                resultArray.push({
                    productTitle: productEdge.node.title,
                    variantTitle: variant.node.title,
                    price: variant.node.price,

                });
            })
        });
        resultArray.sort(( a, b ) => a.price - b.price );
        
        resultArray.forEach( variant => {
            console.log(`${variant.productTitle} - variant ${variant.variantTitle} - price $${parseFloat( variant.price )}`);
        });


    } catch ( error ) {
        console.log('ERROR: ', error);
    }
})();