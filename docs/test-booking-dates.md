# 🧪 Testing Guide for Booking Date Management

## Quick Test Checklist

### ✅ Test 1: Date Persistence After Component Updates
1. Navigate to `/product/[any-product-slug]` or `/bundling/[any-bundling-slug]`
2. Open browser DevTools Console
3. Select start date and end date in the booking form
4. Look for console logs: `🗓️ Date changed in Details:` or `🗓️ Date changed in BundlingDetails:`
5. Change quantity or trigger any other component update
6. **✅ Expected**: Dates remain selected in the form
7. **❌ Before**: Dates would reset to empty

### ✅ Test 2: API Integration Without Infinite Loops
1. Open Network tab in DevTools
2. Select dates in booking form
3. **✅ Expected**: See API calls to `/product/[slug]` or `/bundling/[slug]` with `start_date` and `end_date` parameters
4. **✅ Expected**: API calls stop after initial load (no infinite loop)
5. **❌ Before**: Continuous API calls or missing date parameters

### ✅ Test 3: Check Availability Button
1. Select start and end dates
2. Click "Cek Ketersediaan" button
3. **✅ Expected**: API call with selected dates, dates remain selected after response
4. **✅ Expected**: Availability results show without losing date selection
5. **❌ Before**: Dates would be lost after availability check

### ✅ Test 4: Date Validation
1. Try selecting invalid date ranges (end before start)
2. **✅ Expected**: Proper error messages, no crashes
3. **✅ Expected**: Form prevents invalid bookings

### ✅ Test 5: Page Refresh Recovery
1. Select dates
2. Refresh the page (F5)
3. **ℹ️ Expected**: Dates reset (this is normal - they're stored in component state, not localStorage)
4. **✅ Expected**: No errors during re-initialization

## Console Commands for Testing

Open browser console and run these commands to test the hook directly:

```javascript
// Test if the hook is working (should not throw errors)
console.log('Testing useBookingDates hook availability...');

// Check for date persistence logs
console.log('Look for "🗓️ Date changed" logs when selecting dates');

// Check for availability calculation logs  
console.log('Look for "📦 Bundling availability calculated" or product availability logs');
```

## Expected Console Output

When working correctly, you should see logs like:

```
🗓️ Date changed in Details: {
  startDate: "2024-01-15", 
  endDate: "2024-01-20",
  previousDates: { startDate: null, endDate: null }
}

📦 Bundling availability calculated: {
  bundling: "Professional Photography Kit",
  isAvailable: true,
  availableQuantity: 3,
  unavailableCount: 0,
  period: "2024-01-15 - 2024-01-20"
}
```

## Troubleshooting Common Issues

### Issue: Dates disappear after selection
**Possible Cause**: Component not using the `useBookingDates` hook
**Check**: Look for the import in the component file

### Issue: Infinite API calls
**Possible Cause**: useEffect dependency array issues
**Check**: Look for rapidly repeating network requests

### Issue: TypeScript errors
**Possible Cause**: Missing types or incorrect imports
**Check**: Ensure all imports are correct

## Success Criteria

✅ Dates persist after:
- Clicking "Check Availability"  
- Changing quantity
- Component re-renders
- API responses

✅ No infinite loops:
- Network tab shows finite number of requests
- Console doesn't spam with repeated logs

✅ Proper API integration:
- API calls include `start_date` and `end_date` parameters
- Availability results are accurate

✅ Good user experience:
- DatePicker shows selected dates consistently
- Form validation works properly
- No unexpected page refreshes

## Performance Check

The implementation should be performant with:
- No unnecessary re-renders
- Memoized calculations
- Efficient state updates
- No memory leaks

Run React DevTools Profiler to verify performance if needed.
