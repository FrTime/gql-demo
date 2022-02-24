import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";

const ORDERS_SUBSCRIPTION = gql`
  subscription {
    mt_doc_order {
      status: data(path: "Status")
      created_at: data(path: "CreatedAt")
      delivery_id: data(path: "ExternalId")
      worker_id: data(path: "ShipmentInformation.FreightCarrier")
      item: data(path: "OrderLines[0].Item.Sku")
      qty: data(path: "OrderLines[0].QuatityRequired")
    }
  }
`;

function OrdersTable() {
  const { data, loading, error } = useSubscription(ORDERS_SUBSCRIPTION);
  const { isAuthenticated, isLoading } = useAuth0();
  try {
    {
      if (isLoading) return <h4 style={{ padding: "2rem" }}>Loading...</h4>;
      if (!isAuthenticated)
        return <h4 style={{ padding: "2rem" }}>You are not logged in.</h4>;

      if (error)
        return (
          <h4 style={{ padding: "2rem" }}>
            You do not have access to this data.
          </h4>
        );
      return !loading ? (
        data.mt_doc_order.map((order) => {
          const date = new Date(order.created_at);
          return (
            <div
              className="bp3-tree bp3-elevation-0"
              style={{ padding: "2rem" }}
              key={`order-${order.delivery_id}`}
            >
              <ul className="bp3-tree-node-list bp3-tree-root">
                <li className="bp3-tree-node bp3-tree-node-expanded">
                  <div className="bp3-tree-node-content">
                    <span className="bp3-tree-node-caret bp3-tree-node-caret-open bp3-icon-standard"></span>
                    <span className="bp3-tree-node-icon bp3-icon-standard bp3-icon-archive"></span>
                    <span className="bp3-tree-node-label">
                      {order.delivery_id} ({order.status})
                    </span>
                    <span className="bp3-tree-node-secondary-label">
                      {new Intl.DateTimeFormat("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "long",
                      }).format(date)}
                    </span>
                  </div>
                  <ul className="bp3-tree-node-list">
                    <li className="bp3-tree-node">
                      <div className="bp3-tree-node-content">
                        <span className="bp3-tree-node-caret-none bp3-icon-standard"></span>
                        <span className="bp3-tree-node-icon bp3-icon-standard bp3-icon-inheritance"></span>
                        <span className="bp3-tree-node-label">
                          {order.worker_id}
                        </span>
                      </div>
                    </li>
                    <li className="bp3-tree-node" key={`item-${order.item}`}>
                      <div className="bp3-tree-node-content">
                        <span className="bp3-tree-node-caret-none bp3-icon-standard"></span>
                        <span className="bp3-tree-node-icon bp3-icon-standard bp3-icon-dot"></span>
                        <span className="bp3-tree-node-label">
                          {order.item} x {order.qty} ea.
                        </span>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          );
        })
      ) : (
        <h4 style={{ padding: "2rem" }}>Loading...</h4>
      );
    }
  } catch {
    return (
      <h4 style={{ padding: "2rem" }}>Encountered an unexpected error.</h4>
    );
  }
}

export default OrdersTable;
