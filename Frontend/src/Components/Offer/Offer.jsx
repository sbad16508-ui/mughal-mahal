import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OfferModal from "../modal/Offer";
import "./Offer.css";

const ITEMS_PER_PAGE = 5;

let MOCK_OFFERS = [
  {
    id: 1,
    title: "Ramadan Special",
    description: "50% off on all buffet packages",
    discount: "50%",
    validTill: "2026-05-30",
  },
  {
    id: 2,
    title: "Weekend Deal",
    description: "Free dessert with dinner",
    discount: "Free Dessert",
    validTill: "2026-06-15",
  },
];

const AdminOffer = () => {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchOffers = async (page, limit) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    const start = (page - 1) * limit;
    const end = start + limit;

    setList(MOCK_OFFERS.slice(start, end));
    setTotal(MOCK_OFFERS.length);
    setLoading(false);
  };

  const saveOffer = async (data) => {
    await new Promise((res) => setTimeout(res, 300));

    if (data.id) {
      MOCK_OFFERS = MOCK_OFFERS.map((o) => (o.id === data.id ? data : o));
    } else {
      MOCK_OFFERS.push({ ...data, id: Date.now() });
    }
    fetchOffers(page, ITEMS_PER_PAGE);
  };

  const deleteOffer = async (id) => {
    await new Promise((res) => setTimeout(res, 300));
    MOCK_OFFERS = MOCK_OFFERS.filter((o) => o.id !== id);
    fetchOffers(page, ITEMS_PER_PAGE);
  };

  useEffect(() => {
    fetchOffers(page, ITEMS_PER_PAGE);
  }, [page]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="admin-offer">
      <div className="offer-header">
        <h2>Offer Management</h2>
        <button
          className="add-btn"
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
        >
          + Add Offer
        </button>
      </div>

      <motion.table
        className="offer-table"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Discount</th>
            <th>Valid Till</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="5" className="center">
                Loading...
              </td>
            </tr>
          ) : list.length ? (
            list.map((o) => (
              <tr key={o.id}>
                <td>{o.title}</td>
                <td>{o.description}</td>
                <td>{o.discount}</td>
                <td>{o.validTill}</td>
                <td className="action-col">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditData(o);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deleteOffer(o.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="center">
                No Offers Found
              </td>
            </tr>
          )}
        </tbody>
      </motion.table>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <OfferModal
          editData={editData}
          onClose={() => setShowModal(false)}
          onSubmit={saveOffer}
        />
      )}
    </div>
  );
};

export default AdminOffer;
