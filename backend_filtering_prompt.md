# Backend Filtering Request: Exclude Rental Include Products

## Requirement
Modify the `/products` API endpoint to exclude products that are used as rental includes in other products.

## Current Situation
- Products have a `rentalIncludes` relationship that contains other products
- Currently, all products are returned in the browse products API
- Need to filter out products that appear as `included_product` in any `rentalIncludes`

## Database Structure (Based on Frontend Types)
```
Products Table:
- id
- name
- slug
- price
- etc.

RentalIncludes Table (pivot/relationship):
- id
- product_id (parent product)
- included_product_id (product to be excluded from browse)
- quantity
```

## Required Changes

### Option 1: Add Query Parameter (Recommended)
Modify the `/products` endpoint to accept a new query parameter:

**Endpoint**: `GET /api/products`

**New Query Parameter**: 
- `exclude_rental_includes=true` (boolean, default: false)

**Implementation Logic**:
```sql
-- When exclude_rental_includes=true, exclude products that are rental includes
SELECT * FROM products 
WHERE id NOT IN (
    SELECT DISTINCT included_product_id 
    FROM rental_includes 
    WHERE included_product_id IS NOT NULL
)
-- Add other existing filters (category, brand, price, etc.)
```

### Option 2: Create New Endpoint
Create a dedicated endpoint for browse products:

**New Endpoint**: `GET /api/browse-products`

This endpoint would have the same functionality as `/products` but automatically excludes rental include products.

### Option 3: Default Behavior Change
Modify the existing `/products` endpoint to exclude rental includes by default, and add `include_rental_includes=true` parameter to include them when needed.

## Frontend Integration
The frontend will call the API like this:
```javascript
// Current call
axiosInstance.get(`/products`, {
  params: { ...otherParams, exclude_rental_includes: true }
})
```

## Expected Response Format
Same as current `/products` response, but with rental include products filtered out:

```json
{
  "data": [
    // Only products that are NOT used as rental includes
  ],
  "meta": {
    "current_page": 1,
    "last_page": 10,
    "total": 150
    // etc.
  }
}
```

## Testing Requirements
1. Create test products where some are rental includes of others
2. Verify that rental include products don't appear in filtered results
3. Verify that parent products (those with rental includes) still appear
4. Ensure pagination and other filters still work correctly
5. Performance test with large datasets

## Migration Consideration
- Ensure backward compatibility if modifying existing endpoint
- Update API documentation
- Consider impact on other parts of the system that use `/products` endpoint

## Questions for Backend Team
1. Which option do you prefer for implementation?
2. What's the exact table structure for rental includes in your database?
3. Are there any performance considerations with the current database indexes?
4. Should this filtering apply to admin panels as well, or only public-facing APIs?

## Priority: High
This affects the user experience on the browse products page.
