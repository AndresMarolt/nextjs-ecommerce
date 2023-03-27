import '@/styles/globals.css'
import { Store, StoreProvider } from '@/utils/Store'
import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useContext } from 'react'


export default function App({ Component, pageProps: {session, ...pageProps} }) {

  return (
    <SessionProvider session={session}>
      <StoreProvider>
        {Component.auth ? 
          (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          )
          :
          (
            <Component {...pageProps} />
          )
        }
      </StoreProvider>
    </SessionProvider>
  ) 
}

const Auth = ({children}) => {
  const {state, dispatch} = useContext(Store);
  const router = useRouter();
  const {status} = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  });

  if(status === 'loading') {
    return <p>Loading...</p>
  }

  return children;
}
 