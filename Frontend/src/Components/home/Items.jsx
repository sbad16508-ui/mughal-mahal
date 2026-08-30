import React from "react";
import itemImage from "../../assets/Mediacenter/Banner/download.jpg";

export default function Items() {
  const items = [
    { id: 1, title: "Item 1", img: itemImage, price: "100" },
    { id: 2, title: "Item 2", img: itemImage, price: "150" },
    { id: 3, title: "Item 3", img: itemImage, price: "200" },
    { id: 4, title: "Item 4", img: itemImage, price: "250" }
  ];

  return (
    <div className="row mt-4">
      {items.map(item => (
        <div className="col-md-3 mb-4" key={item.id}>
          <div className="card h-100 shadow-sm">
            <img
              src={item.img}
              className="card-img-top"
              style={{ height: "180px", objectFit: "cover" }}
              alt={item.title}
            />

            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">Price: ${item.price}</p>
              <button className="btn btn-primary w-100">View</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
