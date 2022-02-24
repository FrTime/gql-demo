import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function TopNav(props) {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return (
    <nav
      className="bp3-navbar bp3-dark"
      style={{ position: "fixed", top: "0" }}
    >
      <div style={{ margin: "0 auto", paddingLeft: "5rem" }}>
        <div className="bp3-navbar-group bp3-align-left">
          <div className="bp3-navbar-heading">KiwiBot Connector Demo</div>
        </div>
        <div className="bp3-navbar-group bp3-align-right">
          <button className="bp3-button bp3-minimal bp3-icon-home">Home</button>
          <button className="bp3-button bp3-minimal bp3-icon-database">
            Orders
          </button>
          <span className="bp3-navbar-divider"></span>
          {isAuthenticated ? (
            <button
              className="bp3-button bp3-minimal bp3-icon-user"
              style={{ textTransform: "capitalize" }}
            >
              {user["https://hasura.io/jwt/claims"]["x-hasura-default-role"]}
            </button>
          ) : (
            <button
              className="bp3-button bp3-minimal bp3-icon-log-in"
              onClick={() => loginWithRedirect()}
            >
              Log in
            </button>
          )}
          {isAuthenticated && (
            <button
              className="bp3-button bp3-minimal bp3-icon-log-out"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
