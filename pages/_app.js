import { StoreProvider } from "../utils/Store";
import { SessionProvider, useSession } from 'next-auth/react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/styles.scss';
import {useRouter} from "next/router";
import {PayPalScriptProvider} from '@paypal/react-paypal-js';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <StoreProvider>
        <PayPalScriptProvider deferLoading={true}>
          {
            Component.auth ? (
              <Auth>
                <Component {...pageProps} />
              </Auth>
            ) : (
              <Component {...pageProps} />
            )
          }
        </PayPalScriptProvider>
      </StoreProvider>
    </SessionProvider>
  )
}

function Auth({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/unauthorized?message=You are not authorized');
    }
  });

  return children;
}

export default MyApp