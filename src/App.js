import React, { useEffect, useState } from "react";
import {API, matchQuery, formatNumber, duplicateCheck, fetchRequest} from "./utils";
import logo from "./assets/logo.svg";
import search from "./assets/search.svg";
import "./App.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isError, setError] = useState(false);
  // useEffect(() => getProducts(), []);

  useEffect(()=>{
    (async () => {
    try {
      //fetching all json files into a single array
      let data = (
        await Promise.all([
              fetchRequest(`${API}/branch1.json`),
	      fetchRequest(`${API}/branch2.json`),
	      fetchRequest(`${API}/branch3.json`),
	      ])
      )

      data = data?.reduce(
        //flatening the array to have single products list
        (acc, curr) => [...acc, ...(curr?.products ? curr?.products : [])],
        [] //initial value
      );
      data = data?.reduce(
        (acc, curr) => {
          const duplicate = acc?.find((item) => duplicateCheck(item, curr));
          // returns first element from accumulator when item and curr product is same

          if (!!duplicate) {
            //if duplicate found
            return acc?.map((item) => {
              //loops through accumulator
              return item === duplicate // if item is accumulator is same as duplicate item
                ? { ...duplicate, sold: item?.sold + curr?.sold } // adds sold amount of duplicate items
                : item;
            });
          }

          return [...acc, curr]; // if duplicate not found it will add the product to accumulator
        },
        [] //initial value
      );

      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.log({error})
    }
  })();
}, []);

  const filteredProducts = products?.filter(({ name }) => matchQuery(name?.toLowerCase(), searchQuery.toLowerCase())
  );

  if (loading) return 'Loading...';

  return (
    <React.Fragment>
      <header>
        <img src={logo} alt="wowcher logo" />
      </header>

      <div className="product-list">
        <div className="search-bar">
          <input
            placeholder="search products"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <img alt="Search icon" src={search} />
        </div>
        {loading ? (
	<p>Loading...</p>
	) : !!filteredProducts?.length ? (
          <table className="product-list-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts
                ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))
                ?.map(({ id, name, sold, unitPrice }) => (
                  <tr key={name}>
                    <td>{name}</td>
                    <td>{formatNumber(sold * unitPrice)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>
                  {formatNumber(
                    filteredProducts?.reduce(
                      (acc, { sold, unitPrice }) => acc + sold * unitPrice,
                      0
                    )
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        ) : isError ? (//if api error
          <div className="product-list-no-data">
            <p>Some issue occured. Please try reloading.</p>
          </div>
        ) : (//no. of products is 0
          <div className="product-list-no-match">
            <p>Found no products</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default App;
