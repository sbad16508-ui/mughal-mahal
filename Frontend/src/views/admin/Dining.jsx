import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaPlus, FaTrashAlt, FaCheckCircle, FaSearch, FaFilter, FaRegEdit, FaEye, FaStar, FaRegClock, FaArrowLeft } from "react-icons/fa"
import api from "../../api"
import "./Dining.css"

const MENU_CATEGORIES = [
  "Appetizers",
  "Bar B Que",
  "Pakistani (Mutton / Desi Murgh / Batair)",
  "Pakistani (Chicken / Rice & Vegetables)",
  "Chinese (Gravies)",
  "Chinese (Soups / Rice & Chowmein)",
  "Continental",
  "Salad / Roti & Naan",
  "Desserts",
  "Hot & Cold Drinks"
]

const LEGACY_CATEGORY_MAP = {
  Appetizer: "Appetizers",
  "Main Course": "Pakistani (Chicken / Rice & Vegetables)",
  Dessert: "Desserts",
  Beverage: "Hot & Cold Drinks"
}

const Dining = () => {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState([])
  const [diningQueries, setDiningQueries] = useState([])
  const [diningTableBookings, setDiningTableBookings] = useState([])
  const [tableTypes, setTableTypes] = useState([])
  const [redboxOrders, setRedboxOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [editingQuery, setEditingQuery] = useState(null)
  const [savingQuery, setSavingQuery] = useState(false)
  const [showMenuUpdate, setShowMenuUpdate] = useState(false)
  const [selectedMenuCategory, setSelectedMenuCategory] = useState(null)
  const [editingMenuItem, setEditingMenuItem] = useState(null)
  const [newMenuItem, setNewMenuItem] = useState({ itemName: '', category: '', price: '' })

  const getMenuCategory = (category) => LEGACY_CATEGORY_MAP[category] || category


  useEffect(() => {
    const fetchDiningData = async () => {
      try {
        setLoading(true)

        const [menuResponse, browseMenuResponse, diningResponse, tableBookingsResponse, tableTypesResponse, redboxResponse] = await Promise.all([
          api.get("/dinings"),
          api.get("/dining/menu"),
          api.get("/dining-queries"),
          api.get("/dining-table-bookings"),
          api.get("/dining/tables"),
          api.get("/redbox-orders")
        ])

        const adminMenu = Array.isArray(menuResponse.data) ? menuResponse.data : menuResponse.data.menu || []
        const browseMenu = Array.isArray(browseMenuResponse.data) ? browseMenuResponse.data : browseMenuResponse.data.menu || []
        const browseMenuItems = browseMenu.flatMap((category) => (category.items || []).map((item, index) => ({
          ...item,
          _id: `menu_${category.categoryId}_${index}`,
          itemName: item.name,
          category: category.categoryName,
          source: 'browse-menu'
        })))
        setMenuItems([...browseMenuItems, ...adminMenu])
        setDiningQueries(Array.isArray(diningResponse.data) ? diningResponse.data : [])
        setDiningTableBookings(Array.isArray(tableBookingsResponse.data) ? tableBookingsResponse.data : [])
        setTableTypes(Array.isArray(tableTypesResponse.data) ? tableTypesResponse.data : [])
        setRedboxOrders(Array.isArray(redboxResponse.data) ? redboxResponse.data : [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching dining dataset:", err)
        setError("Failed to load restaurant menu data.")
        setLoading(false)
      }
    }
    fetchDiningData()
  }, [])

  const handleDeleteItem = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      try {
        await api.delete(`/dining/${itemId}`)
        setMenuItems((previous) => previous.filter((item) => item._id !== itemId))
      } catch (err) {
        alert("Failed to delete item. Please try again.")
      }
    }
  }

  const handleSaveMenuItem = async (item) => {
    try {
      await api.put(`/dining/${item._id}`, {
        itemName: item.itemName,
        category: item.category,
        price: item.price,
        availability: item.availability
      })
      setMenuItems((previous) => previous.map((menuItem) => menuItem._id === item._id ? item : menuItem))
      setEditingMenuItem(null)
    } catch (err) {
      alert('Failed to update menu item.')
    }
  }

  const handleAddMenuItem = async (event) => {
    event.preventDefault()
    const category = newMenuItem.category || selectedMenuCategory
    if (!newMenuItem.itemName.trim() || !category?.trim() || !newMenuItem.price) return
    try {
      const response = await api.post('/dining', {
        itemName: newMenuItem.itemName.trim(),
        category: category.trim(),
        price: Number(newMenuItem.price),
        preparationTime: '',
        servingSize: '',
        calories: 0,
        description: '',
        ingredients: [],
        allergens: [],
        availability: 'available'
      })
      const createdItem = response.data.item || { _id: `new-${Date.now()}`, ...newMenuItem, price: Number(newMenuItem.price), availability: 'available' }
      setMenuItems((previous) => [...previous, createdItem])
      setSelectedMenuCategory(createdItem.category)
      setNewMenuItem({ itemName: '', category: '', price: '' })
    } catch (err) {
      alert('Failed to add menu item.')
    }
  }

  const handleToggleConfirm = async (query) => {
    const currentlyConfirmed = (query.status || 'Pending').toLowerCase() === 'confirmed'
    const newStatus = currentlyConfirmed ? 'Pending' : 'Confirmed'
    try {
      const response = await api.put(`/dining-query/${query._id}`, { status: newStatus })
      const updatedBooking = response.data.booking || { ...query, status: newStatus }
      setDiningQueries((prev) => prev.map((item) => item._id === query._id ? updatedBooking : item))
    } catch (err) {
      alert('Failed to update query status. Please try again.')
    }
  }

  const handleDeleteQuery = async (query) => {
    if (!window.confirm(`Delete dining query for ${query.guestName || 'this guest'}?`)) return
    try {
      await api.delete(`/dining-query/${query._id}`)
      setDiningQueries((prev) => prev.filter((item) => item._id !== query._id))
    } catch (err) {
      alert('Failed to delete dining query. Please try again.')
    }
  }

  const totalItems = 141

  const availableItemsCount = menuItems.reduce((sum, category) => {
    if (Array.isArray(category.items)) {
      return sum + category.items.filter((item) => item.availability === 'available').length
    }
    if (Array.isArray(category.menuItems)) {
      return sum + category.menuItems.filter((item) => item.availability === 'available').length
    }
    return sum + (category.availability === 'available' ? 1 : 0)
  }, 0)

  const getTableTypeIdByGuests = (guests) => {
    const size = Number(guests)
    if (!Number.isFinite(size) || size <= 0) return null
    if (size <= 2) return 'T1'
    if (size <= 4) return 'T2'
    if (size <= 6) return 'T3'
    if (size <= 8) return 'T4'
    if (size <= 10) return 'T5'
    return 'T6'
  }

  const getQueryTableTypeId = (query) => {
    const selected = query.selectedTableType
    if (selected) {
      if (typeof selected === 'string') return selected
      if (typeof selected === 'object') {
        if (selected.tableTypeId) return selected.tableTypeId
        if (selected.tableTypeName) return selected.tableTypeName
      }
    }
    return getTableTypeIdByGuests(query.numberOfGuests)
  }

  const getQueriesForTable = (table) => diningQueries.filter((query) => getQueryTableTypeId(query) === table.id)

  const openTableQueries = (table) => {
    setSelectedTable(table)
    setEditingQuery(null)
  }

  const updateDraftItem = (index, field, value) => {
    setEditingQuery((current) => ({
      ...current,
      menuItems: current.menuItems.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: field === 'price' ? Number(value) || 0 : value } : item)
    }))
  }

  const deleteDraftItem = (index) => {
    setEditingQuery((current) => ({
      ...current,
      menuItems: current.menuItems.filter((_, itemIndex) => itemIndex !== index)
    }))
  }

  const saveQueryMenu = async () => {
    if (!editingQuery) return
    setSavingQuery(true)
    try {
      const menuItems = editingQuery.menuItems || []
      const totalAmount = menuItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0)
      const response = await api.put(`/dining-query/${editingQuery._id}`, { menuItems, totalAmount })
      const updatedQuery = response.data.booking || { ...editingQuery, menuItems, totalAmount }
      setDiningQueries((previous) => previous.map((query) => query._id === updatedQuery._id ? updatedQuery : query))
      setEditingQuery(null)
    } catch (err) {
      alert('Failed to update dishes. Please try again.')
    } finally {
      setSavingQuery(false)
    }
  }

  const totalTables = tableTypes.length > 0
    ? tableTypes.reduce((sum, type) => sum + Number(type.quantity || 0), 0)
    : 42
  const confirmedDiningQueriesCount = diningQueries.filter((query) => (query.status || '').toString().toLowerCase() === 'confirmed').length
  const confirmedTableBookingsCount = diningTableBookings.length
  const activeTablesBooked = confirmedDiningQueriesCount + confirmedTableBookingsCount
  const activeTablesRemaining = Math.max(totalTables - activeTablesBooked, 0)
  const activeTablesValue = `${activeTablesBooked}/${activeTablesRemaining}`

  const totalSaleAmount = [...diningQueries, ...diningTableBookings].reduce((sum, item) => {
    const amount = Number(item.totalAmount) || 0
    return sum + amount
  }, 0)

  const stats = [
    { label: "Total Menu Items", value: totalItems },
    { label: "Categories", value: 10 },
    { label: "Active Tables", value: activeTablesValue },
    { label: "Total Sale", value: `Rs. ${totalSaleAmount.toLocaleString('en-PK')}` },
  ]


  const [tables] = useState([
    { id: "T-01", seats: "2 seats", status: "Available" },
    { id: "T-02", seats: "4 seats", status: "Occupied" },
    { id: "T-03", seats: "4 seats", status: "Reserved" },
    { id: "T-04", seats: "6 seats", status: "Available" },
    { id: "T-05", seats: "8 seats", status: "Occupied" },
    { id: "T-06", seats: "2 seats", status: "Available" },
  ])

  const tableStatusCards = tableTypes.length > 0 ? tableTypes.map((tableType) => {
    const bookedQueriesCount = diningQueries.filter((query) => {
      if ((query.status || '').toString().toLowerCase() !== 'confirmed') return false
      const queryTypeId = getQueryTableTypeId(query)
      if (!queryTypeId) return false
      return queryTypeId === tableType.tableTypeId || queryTypeId === tableType.tableTypeName
    }).length

    const bookedTableBookingsCount = diningTableBookings.filter((booking) => booking.selectedTableType === tableType.tableTypeId).length
    const bookedInventoryCount = Array.isArray(tableType.tables)
      ? tableType.tables.filter((table) => table.isBooked).length
      : 0

    const bookedCount = bookedQueriesCount + bookedTableBookingsCount + bookedInventoryCount
    const remainingCount = Math.max(tableType.quantity - bookedCount, 0)
    const status = bookedCount === 0 ? 'Available' : remainingCount === 0 ? 'Occupied' : 'Reserved'

    return {
      id: tableType.tableTypeId,
      name: tableType.tableTypeName,
      seats: `${tableType.capacity} seats`,
      status,
      bookedCount,
      remainingCount,
      quantity: tableType.quantity
    }
  }) : tables


  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item._id?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const menuCategories = MENU_CATEGORIES
  const selectedCategoryItems = selectedMenuCategory
    ? menuItems.filter((item) => getMenuCategory(item.category) === selectedMenuCategory)
    : []

  const getMenuDisplay = (query) => {
    if (Array.isArray(query.menuItems) && query.menuItems.length > 0) {
      return query.menuItems.map((item) => item.name || item.itemName || '').filter(Boolean).join(', ')
    }
    if (Array.isArray(query.itemDetails) && query.itemDetails.length > 0) {
      return query.itemDetails.map((item) => item.itemName || item.name || '').filter(Boolean).join(', ')
    }
    if (query.itemName) {
      return query.itemName
    }
    return '—'
  }

  const getPriceDisplay = (query) => {
    if (query.totalAmount || query.totalAmount === 0) {
      return `Rs. ${Number(query.totalAmount).toLocaleString()}`
    }
    if (Array.isArray(query.menuItems) && query.menuItems.length > 0) {
      const total = query.menuItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
      return total > 0 ? `Rs. ${total.toLocaleString()}` : '—'
    }
    if (Array.isArray(query.itemDetails) && query.itemDetails.length > 0) {
      const total = query.itemDetails.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      return total > 0 ? `Rs. ${total.toLocaleString()}` : '—'
    }
    if (query.itemPrice || query.itemPrice === 0) {
      return `Rs. ${Number(query.itemPrice).toLocaleString()}`
    }
    return '—'
  }

  if (loading) return <div style={{ padding: "30px", textAlign: "center" }}>Loading menu database...</div>
  if (error) return <div style={{ padding: "30px", color: "red", textAlign: "center" }}>{error}</div>

  return (
    <div className="dining-container">
      <div className="dining-header-row">
        <div className="header-text">
          <h1>Dining Management</h1>
          <p>Manage restaurant menu and orders</p>
        </div>
      </div>


      <div className="stats-cards-grid">
        {stats.map((s, index) => (
          <div key={index} className="stat-card-item">
            <span className="stat-label">{s.label}</span>
            <h2 className="stat-value">{s.value}</h2>
          </div>
        ))}
      </div>


      <div className="white-card-section">
        <div className="section-heading-with-action">
          <h3>Table Status</h3>
          <button className="menu-update-btn" type="button" onClick={() => { setSelectedMenuCategory(null); setEditingMenuItem(null); setShowMenuUpdate(true) }}>
            <FaRegEdit /> Menu Update
          </button>
        </div>
        <div className="tables-status-grid">
          {tableStatusCards.map((table, index) => (
            <div key={index} className="table-status-box">
              <span className="table-name">{table.name}</span>
              <span className="table-capacity">{table.seats}</span>
              <span className={`status-tag ${table.status.toLowerCase()}`}>{table.status}</span>
              {table.bookedCount !== undefined && (
                <div className="table-count-wrapper">
                  <div className="table-count-item">
                    <span className="table-count-label">Booked:</span>
                    <span className="table-count-value">{table.bookedCount}</span>
                  </div>
                  <div className="table-count-item">
                    <span className="table-count-label">Remaining:</span>
                    <span className="table-count-value">{table.remainingCount}</span>
                  </div>
                </div>
              )}
              <button className="table-menu-btn" type="button" onClick={() => openTableQueries(table)}>
                <FaEye /> View Queries & Dishes
              </button>
            </div>
          ))}
        </div>
      </div>

      {showMenuUpdate && (
        <div className="dining-modal-overlay" onClick={(event) => event.target === event.currentTarget && setShowMenuUpdate(false)}>
          <div className="dining-modal menu-update-modal">
            <button className="dining-modal-close" type="button" onClick={() => setShowMenuUpdate(false)}>×</button>
            <h2>Update Menu</h2>
            {!selectedMenuCategory ? (
              <div className="menu-category-grid">
                {menuCategories.map((category) => {
                  const itemCount = menuItems.filter((item) => getMenuCategory(item.category) === category).length
                  return (
                    <button className="menu-category-btn" type="button" key={category} onClick={() => setSelectedMenuCategory(category)}>
                      <span>{category}</span>
                      <small>{itemCount} {itemCount === 1 ? 'dish' : 'dishes'}</small>
                    </button>
                  )
                })}
              </div>
            ) : (
              <>
                <button className="menu-back-btn" type="button" onClick={() => { setSelectedMenuCategory(null); setEditingMenuItem(null) }}>
                  <FaArrowLeft /> All Categories
                </button>
                <h3 className="selected-menu-category">{selectedMenuCategory}</h3>
                <form className="new-menu-item-form" onSubmit={handleAddMenuItem}>
                  <input placeholder="Dish name" value={newMenuItem.itemName} onChange={(event) => setNewMenuItem({ ...newMenuItem, itemName: event.target.value })} required />
                  <select value={newMenuItem.category || selectedMenuCategory} onChange={(event) => setNewMenuItem({ ...newMenuItem, category: event.target.value })} required>
                    {MENU_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                  <input type="number" min="0" placeholder="Rate" value={newMenuItem.price} onChange={(event) => setNewMenuItem({ ...newMenuItem, price: event.target.value })} required />
                  <button type="submit"><FaPlus /> Add Dish</button>
                </form>
                <div className="menu-update-list">
              {selectedCategoryItems.length === 0 ? (
                <p className="dining-modal-empty">No dishes in this category yet. Add one using the form above.</p>
              ) : selectedCategoryItems.map((item) => {
                const isEditing = editingMenuItem?._id === item._id
                const currentItem = isEditing ? editingMenuItem : item
                return (
                  <div className={`menu-update-row${isEditing ? ' is-editing' : ''}`} key={item._id} onClick={() => !isEditing && setEditingMenuItem({ ...item })}>
                    {isEditing ? (
                      <>
                        <input value={currentItem.itemName || ''} onChange={(event) => setEditingMenuItem({ ...currentItem, itemName: event.target.value })} aria-label="Dish name" />
                        <input type="number" min="0" value={currentItem.price || 0} onChange={(event) => setEditingMenuItem({ ...currentItem, price: Number(event.target.value) || 0 })} aria-label="Dish price" />
                        <button type="button" className="save-dishes-btn" onClick={() => handleSaveMenuItem(currentItem)}>Save</button>
                      </>
                    ) : (
                      <>
                        <span><strong>{item.itemName}</strong><small>{item.category}</small></span>
                        <strong>Rs. {Number(item.price || 0).toLocaleString()}</strong>
                        <button type="button" className="edit-dishes-btn" onClick={(event) => { event.stopPropagation(); setEditingMenuItem({ ...item }) }}><FaRegEdit /></button>
                        <button type="button" className="delete-query-btn" onClick={(event) => { event.stopPropagation(); handleDeleteItem(item._id) }}><FaTrashAlt /></button>
                      </>
                    )}
                  </div>
                )
              })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {selectedTable && (
        <div className="dining-modal-overlay" onClick={(event) => event.target === event.currentTarget && setSelectedTable(null)}>
          <div className="dining-modal">
            <button className="dining-modal-close" type="button" onClick={() => setSelectedTable(null)}>×</button>
            <h2>{selectedTable.name} Queries & Dishes</h2>
            {getQueriesForTable(selectedTable).length === 0 ? (
              <p className="dining-modal-empty">No dining queries found for this table type.</p>
            ) : getQueriesForTable(selectedTable).map((query) => {
              const queryItems = editingQuery?._id === query._id ? editingQuery.menuItems || [] : query.menuItems || []
              return (
                <div className="query-dishes-box" key={query._id}>
                  <div className="query-dishes-header">
                    <div>
                      <strong>{query.guestName || 'Guest'}</strong>
                      <span>{query.selectedPage || 'Dining query'}</span>
                    </div>
                    <div className="query-dishes-actions">
                      {editingQuery?._id === query._id ? (
                        <button type="button" className="save-dishes-btn" onClick={saveQueryMenu} disabled={savingQuery}>{savingQuery ? 'Saving...' : 'Save'}</button>
                      ) : (
                        <button type="button" className="edit-dishes-btn" onClick={() => setEditingQuery({ ...query, menuItems: (query.menuItems || []).map((item) => ({ ...item })) })}><FaRegEdit /> Edit</button>
                      )}
                      <button type="button" className="delete-query-btn" onClick={() => handleDeleteQuery(query)} title="Delete query"><FaTrashAlt /></button>
                    </div>
                  </div>
                  {queryItems.length === 0 ? <p className="dining-modal-empty">No dishes added.</p> : queryItems.map((item, index) => (
                    <div className="query-dish-row" key={`${query._id}-${index}`}>
                      {editingQuery?._id === query._id ? (
                        <>
                          <input value={item.name || item.itemName || ''} onChange={(event) => updateDraftItem(index, 'name', event.target.value)} aria-label="Dish name" />
                          <input type="number" min="0" value={item.price || 0} onChange={(event) => updateDraftItem(index, 'price', event.target.value)} aria-label="Dish price" />
                          <button type="button" onClick={() => deleteDraftItem(index)} title="Delete dish"><FaTrashAlt /></button>
                        </>
                      ) : (
                        <><span>{item.name || item.itemName || 'Dish'}</span><strong>Rs. {Number(item.price || 0).toLocaleString()}</strong></>
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="white-card-section">
        <h3>Recent Dining Queries</h3>
        <div className="table-responsive-wrapper">
          <table className="dining-menu-table">
            <thead>
              <tr>
                <th>Dining Venue</th>
                <th>Guest</th>
                <th>Contact</th>
                <th>Number of Guests</th>
                <th>Duration</th>
                <th>Time Slot</th>
                <th>Menu</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {diningQueries.slice(0, 5).map((query) => (
                <tr key={query._id}>
                  <td>{query.selectedPage || "—"}</td>
                  <td>{query.guestName || "—"}</td>
                  <td>{query.phone || "—"}</td>
                  <td>{query.numberOfGuests || "—"}</td>
                  <td>{query.recommendedTiming || "—"}</td>
                  <td>{query.selectedTimeSlot || query.timing || "—"}</td>
                  <td>{getMenuDisplay(query)}</td>
                  <td>{getPriceDisplay(query)}</td>
                  <td>{(query.status || 'Pending')}</td>
                  <td>
                    <button
                      className="btn-icon"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: (query.status || 'Pending').toLowerCase() === 'confirmed' ? '#2e7d32' : '#888'
                      }}
                      title={((query.status || 'Pending').toLowerCase() === 'confirmed') ? 'Confirmed' : 'Mark as confirmed'}
                      onClick={() => handleToggleConfirm(query)}
                    >
                      <FaCheckCircle size={18} />
                    </button>
                    <button
                      className="btn-icon"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        color: '#c62828',
                        marginLeft: '10px'
                      }}
                      title="Delete query"
                      onClick={() => handleDeleteQuery(query)}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Dining