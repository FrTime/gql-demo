import { useState } from "react";
import "./App.css";
import OrdersTable from "./components/OrdersTable";
import TopNav from "./components/TopNav";
import ApolloClientProvider from "./providers/ApolloClientProvider";
import { useAuth0 } from "@auth0/auth0-react";

function App(props) {
  const { getIdTokenClaims, isAuthenticated } = useAuth0();
  const [jwt, setJwt] = useState();
  async function fetchJwt() {
    console.log("fetching jwt...");
    await getIdTokenClaims().then((res) => {
      res && res.__raw && setJwt(res.__raw);
    });
  }

  !jwt && isAuthenticated && fetchJwt();

  return (
    <ApolloClientProvider token={jwt}>
      <TopNav />
      <OrdersTable />
    </ApolloClientProvider>
  );
}

export default App;
