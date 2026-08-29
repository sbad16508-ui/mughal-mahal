# Dining Menu & Table Booking System Documentation

## Overview
The dining section now includes a complete menu system with 10 categories of dishes and a table booking interface with availability tracking across 6 dining restaurants.

## Features Implemented

### 1. **Dining Menu System**
- **10 Menu Categories:**
  1. Appetizers
  2. Bar B Que
  3. Pakistani (Mutton / Desi Murgh / Batair)
  4. Pakistani (Chicken / Rice & Vegetables)
  5. Chinese (Gravies)
  6. Chinese (Soups / Rice & Chowmein)
  7. Continental
  8. Salad / Roti & Naan
  9. Desserts
  10. Hot & Cold Drinks

- **Menu Items:** Each category contains multiple items with prices in PKR
- **Interactive Display:** Users can click through categories to see items and prices
- **Available on all 6 dining pages:** Anarkali, Koh-i-Noor, Diwan-e-Khas, Little China, Wild Safar, Rooftop Buffet

### 2. **Table Selection System**
Six table types with different capacities:

| Table Type | Capacity | Quantity | Seats |
|-----------|----------|----------|-------|
| T1 | 2 | 4 tables | 2 Seats |
| T2 | 4 | 6 tables | 4 Seats |
| T3 | 6 | 7 tables | 6 Seats |
| T4 | 8 | 6 tables | 8 Seats |
| T5 | 10 | 8 tables | Family Seats |
| T6 | 12 | 8 tables | King Seats |

### 3. **Booking Flow**
- **Step 1:** Select Table Type
  - Display all table types with capacity and availability count
  - Show how many tables are available vs total

- **Step 2:** Select Individual Table
  - Only shows available tables (not booked)
  - Display table numbers (1, 2, 3, 4, etc.)
  - User can select one available table

- **Step 3:** Proceed with Booking
  - Show confirmation of selected table type and table number
  - Click "Proceed with Booking" to open the dining query form

## Backend Structure

### API Endpoints

#### Menu Endpoints
- `GET /api/dining/menu` - Get all menu categories with items
- **Response:** Array of menu categories with items and prices

#### Table Endpoints
- `GET /api/dining/tables` - Get all table types with availability
- `GET /api/dining/tables/:tableTypeId` - Get specific table type details
- `GET /api/dining/tables/:tableTypeId/available` - Get available tables of a type
- `POST /api/dining/tables/book` - Book a table
  - **Body:** `{ tableTypeId: "T1", tableNumber: 1 }`
- `POST /api/dining/tables/release` - Release a booked table
  - **Body:** `{ tableTypeId: "T1", tableNumber: 1 }`

### Data Files

#### `/backend/data/diningMenu.json`
- Contains all 10 menu categories
- Each category has an array of items with name and price
- Items are displayed dynamically in the UI

#### `/backend/data/diningTables.json`
- Contains all 6 table types with their configurations
- Each table type has an array of individual tables with booking status
- Updated in real-time when tables are booked/released

### Models

#### `/backend/models/diningTable.js`
- Mongoose schema for dining table management
- Fields: tableTypeId, tableTypeName, capacity, quantity, tables[]
- Table sub-schema: tableNumber, isBooked

## Frontend Components

### `/Frontend/src/Components/Dining/Dining.jsx`
Enhanced Dining component with:
- Menu display with category tabs
- Interactive menu item browsing
- Table selection interface
- Real-time availability updates
- Integration with DiningQueryModal for booking

### Styling (`Dining.css`)
New CSS classes for:
- `.dining-menu-categories` - Category selection
- `.menu-items-grid` - Menu items display
- `.dining-table-section` - Table booking section
- `.table-types-grid` - Table type selection
- `.individual-tables-grid` - Individual table selection
- Responsive design for mobile devices

## Frontend API Helper (`diningApi.js`)
Convenience functions for dining API calls:
- `getDiningMenu()` - Fetch all menu categories
- `getDiningTables()` - Fetch all table types
- `getTablesByType(typeId)` - Fetch specific table type
- `getAvailableTablesByType(typeId)` - Fetch available tables
- `bookTable(typeId, number)` - Book a table
- `releaseTable(typeId, number)` - Release a table

## Routes Integration

### Backend Routes (`/backend/routes/diningRoutes.js`)
All dining endpoints are registered under `/api/dining` prefix

### Backend Index (`/backend/index.js`)
- Imported `diningRoutes`
- Registered routes at `server.use('/api/dining', diningRoutes)`

## Usage Flow

### For Users
1. Navigate to any dining page (e.g., /dining/anarkali)
2. Scroll down to see the menu categories
3. Click on category tabs to browse items and prices
4. Continue scrolling to "Select Your Table" section
5. Click on a table type (T1-T6) based on group size
6. Select an available table number
7. Click "Proceed with Booking"
8. Complete the booking form

### For Admins/Developers
1. To add/modify menu items, edit `/backend/data/diningMenu.json`
2. To manage table availability, edit `/backend/data/diningTables.json`
3. To update table types, modify both JSON and diningTable.js model
4. All changes are immediately reflected in the UI

## State Management

### Frontend States (Dining.jsx)
- `menuData` - All menu categories and items
- `tablesData` - All table types and availability
- `selectedTableType` - Currently selected table type
- `selectedTable` - Currently selected individual table
- `availableTables` - Filtered available tables for selected type
- `activeMenuCategory` - Currently displayed menu category

## Responsive Design
- Mobile: Single-column layout for all grids
- Tablet: 2-column grids
- Desktop: 3-4 column grids
- Touch-friendly button sizes on all devices
- Flexible category buttons

## Data Persistence
- Menu data stored in JSON (file-based)
- Table availability updated in real-time
- No database required for menu (scalable to MongoDB if needed)
- Table bookings can be persisted to MongoDB using diningTable model

## Future Enhancements
1. Database integration for table bookings with timestamps
2. Real-time availability sync using WebSockets
3. Menu item filtering by price range
4. Dietary preference filters (Vegetarian, Gluten-free, etc.)
5. Kitchen integration for order management
6. Table availability calendar with time slots
7. Special requests/notes per table booking

## Testing

### Manual Testing Checklist
- [ ] All 6 dining pages load correctly
- [ ] Menu categories display all items
- [ ] Table type selection shows correct availability
- [ ] Available tables display correctly
- [ ] Clicking "Proceed with Booking" opens form
- [ ] Form submission works as expected
- [ ] Responsive design works on mobile/tablet
- [ ] All 10 menu categories functional

### API Testing
```bash
# Get menu
curl http://localhost:3000/api/dining/menu

# Get tables
curl http://localhost:3000/api/dining/tables

# Get table type
curl http://localhost:3000/api/dining/tables/T1

# Get available tables
curl http://localhost:3000/api/dining/tables/T1/available

# Book a table
curl -X POST http://localhost:3000/api/dining/tables/book \
  -H "Content-Type: application/json" \
  -d '{"tableTypeId":"T1","tableNumber":1}'
```

## File Summary

### Files Created/Modified
1. ✅ `/backend/data/diningMenu.json` - Menu data
2. ✅ `/backend/data/diningTables.json` - Table data
3. ✅ `/backend/models/diningTable.js` - Mongoose model
4. ✅ `/backend/controllers/diningMenuController.js` - API logic
5. ✅ `/backend/routes/diningRoutes.js` - Route definitions
6. ✅ `/backend/index.js` - Route registration
7. ✅ `/Frontend/src/Components/Dining/Dining.jsx` - UI component
8. ✅ `/Frontend/src/Components/Dining/Dining.css` - Styling
9. ✅ `/Frontend/src/diningApi.js` - API helper functions

## Troubleshooting

### Menu not loading
- Verify `diningMenu.json` is properly formatted
- Check backend console for JSON parsing errors
- Ensure `/api/dining/menu` endpoint is accessible

### Tables not showing
- Verify `diningTables.json` is in correct format
- Check if `/api/dining/tables` endpoint returns data
- Inspect browser console for fetch errors

### Styling issues
- Clear browser cache
- Verify Dining.css is properly linked
- Check for CSS conflicts with other components

## Contact & Support
For issues or questions about the dining menu and table system, refer to the backend routes and frontend components listed above.
