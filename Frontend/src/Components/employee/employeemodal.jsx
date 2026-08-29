import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function EmployeeModal({ show, onClose, onSubmit, selected }) {
  const [form, setForm] = useState({ name: "", position: "", salary: "" });

  
  useEffect(() => {
    if (show) {
      if (selected) {
        setForm({
          name: selected.name || "",
          position: selected.position || "",
          salary: selected.salary?.toString() || "",
        });
      } else {
        setForm({ name: "", position: "", salary: "" });
      }
    }
  }, [show, selected]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, salary: Number(form.salary) });
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{selected ? "Edit Employee" : "Add Employee"}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="position" className="form-label">Position</label>
                <input
                  type="text"
                  className="form-control"
                  id="position"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  placeholder="Enter position"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="salary" className="form-label">Salary</label>
                <input
                  type="number"
                  className="form-control"
                  id="salary"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="Enter salary"
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
