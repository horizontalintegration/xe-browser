'use client'; // For Next.js only. Remove this line in React Vite projects.

import { useEffect, useState, useRef } from 'react';
import { ClientSDK } from '@sitecore-marketplace-sdk/client';
import { XMC } from '@sitecore-marketplace-sdk/xmc';

const SITECORE_CONTEXT_ID = 'uBjOkcOFhpDfMDliSU9mV';
const defaultHostURL = 'https://xmapps.sitecorecloud.io';
/* Host URL options:
- XM Cloud full page: https://xmapps.sitecorecloud.io
- XM Cloud page builder: https://pages.sitecorecloud.io
- Cloud Portal: https://marketplace-app.sitecorecloud.io
*/

export default function MarketplaceSDKComponent() {
  const [client, setClient] = useState(false);
  const [user, setUser] = useState({});
  const [applicationContext, setApplicationContext] = useState({});
  const [pagesContext, setPagesContext] = useState({});
  const [xmcCollections, setXmcCollections] = useState({});

  const clientRef = useRef<ClientSDK | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const origin = (queryParams.get('origin') as string) || defaultHostURL;

    // Initialize the Marketplace SDK:
    const init = async () => {
      try {
        const client = await ClientSDK.init({
          origin,
          target: window.parent,
          // Extend Client SDK with the `xmc` package:
          modules: [XMC],
        });
        clientRef.current = client;
        setClient(true);
      } catch (error) {
        console.error('Client initialization failed:', error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (client) {
      return () => {
        clientRef.current?.destroy();
        clientRef.current = null;
        setClient(false);
      };
    }
  }, [client]);

  // Get the details of the user currently logged in to Sitecore:
  const fetchUser = async () => {
    const user = await clientRef.current!.query('host.user');
    if (user?.data) setUser(user.data);
  };

  // Get the application context
  const fetchApplicationContext = async () => {
    const applicationContext = await clientRef.current!.query('application.context');
    if (applicationContext?.data) setApplicationContext(applicationContext.data);
  };

  // Specific to Pages integrations:
  const fetchPagesContext = async () => {
    const pagesContext = await clientRef.current!.query('pages.context');
    if (pagesContext?.data) setPagesContext(pagesContext.data);
  };

  // Example of XMC request:
  const fetchXMCCollections = async () => {
    const graphQLQuery = await clientRef.current!.mutate('xmc.preview.graphql', {
      params: {
        body: {
          query: `
        {
  site {
    allSiteInfo {
      results {
        name
      }
    }
  }
}
      `,
        },
        query: {
          sitecoreContextId: SITECORE_CONTEXT_ID,
        },
      },
    });
    console.log(graphQLQuery);
    // const collections = await clientRef.current!.query('xmc.xmapp.listCollections', {
    //   params: {
    //     query: {
    //       sitecoreContextId: SITECORE_CONTEXT_ID,
    //     },
    //   },
    // });
    // console.log(collections);
    // if (collections?.data?.data) {
    //   const collectionsData = collections.data.data;
    //   collectionsData.forEach((collection) => {
    //     console.log(collection.id);
    //     console.log(collection.name);
    //     console.log(collection.description);
    //     console.log(collection.image);
    //     console.log(collection.url);
    //     console.log(collection.tags);
    //     console.log(collection.createdAt);
    //     console.log(collection.updatedAt);
    //   });
    // }

    setXmcCollections(graphQLQuery);
  };

  return (
    <>
      <div>
        <button onClick={fetchUser}>Get user details</button>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
      <div>
        <button onClick={fetchApplicationContext}>Fetch application context</button>
        <pre>{JSON.stringify(applicationContext, null, 2)}</pre>
      </div>
      <div>
        <button onClick={fetchPagesContext}>Fetch pages context</button>
        <pre>{JSON.stringify(pagesContext, null, 2)}</pre>
      </div>
      <div>
        <button onClick={fetchXMCCollections}>Fetch XMC collections</button>
        <pre>{JSON.stringify(xmcCollections, null, 2)}</pre>
      </div>
    </>
  );
}
