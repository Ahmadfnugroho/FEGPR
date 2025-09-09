# Testing Guide for Booking Date Optimizations

## Pre-Test Setup

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open browser console** to monitor debug logs

## Test Scenarios 🧪

### Test 1: Date Persistence Across Page Reloads
**Expected**: Selected dates should persist after page reload

1. Navigate to any product detail page (e.g., `/product/some-product-slug`)
2. Select a date range in the DateRangePicker (start and end date)
3. **Verify**: Console shows context updates and localStorage writes
4. Reload the page (F5)
5. **Expected Result**: ✅ Date range should remain selected after reload
6. **Debug**: Check console for localStorage loading messages

### Test 2: No Automatic API Calls on Date Selection
**Expected**: Selecting dates should NOT trigger immediate React Query refetches

1. Open browser Network tab
2. Navigate to a product detail page
3. Select a start date
4. **Verify**: No new API calls in Network tab
5. Select an end date
6. **Expected Result**: ✅ Still no API calls triggered
7. **Debug**: Console should show debounced date logs but no fetchProduct calls

### Test 3: Manual Availability Checking
**Expected**: API calls only happen when user clicks "Cek Ketersediaan"

1. Navigate to a product detail page
2. Select both start and end dates
3. Scroll to "Cek Ketersediaan" button in booking form
4. Click the button
5. **Expected Result**: ✅ API call is made with selected dates
6. **Verify**: Network tab shows new request with date parameters
7. **Debug**: Console shows "fetchProduct_call" with correct dates

### Test 4: Context Synchronization Across Components
**Expected**: Date changes should sync across multiple DateRangePicker instances

1. Navigate to a product detail page
2. Select dates in the main booking form
3. If there are multiple date selectors on the page, verify they all show the same dates
4. **Expected Result**: ✅ All date components show synchronized values
5. **Debug**: Console shows context updates with consistent state

### Test 5: Debouncing Behavior
**Expected**: Rapid date changes should be debounced and not cause excessive API calls

1. Navigate to a product detail page
2. Rapidly click different dates in the calendar (click 5+ dates quickly)
3. **Verify**: Console logs show debounced behavior
4. **Expected Result**: ✅ Only the final date selection triggers processing
5. **Debug**: Look for "debounced" messages in console

### Test 6: No Page Refresh on Date Selection
**Expected**: Page should remain stable during date selection

1. Navigate to any product detail page
2. Fill out some form data or scroll to a specific position
3. Select dates in the DateRangePicker
4. **Expected Result**: ✅ Page position and form data remain unchanged
5. **Verify**: No page reload or unexpected navigation

### Test 7: BundlingDetails Integration
**Expected**: Same behavior should work for bundling pages

1. Navigate to a bundling detail page (e.g., `/bundling/some-bundle-slug`)
2. Repeat Tests 1-6 for bundling pages
3. **Expected Results**: ✅ All behaviors should be identical to product pages

## Debug Console Patterns 📋

### Normal Operation Logs:
```
📅 BookingDatesContext: Loading dates from localStorage
🔄 DateRangePicker: controlled values changed
📅 EnhancedBookingForm: State update
🏠 BookingDatesContext value updated
💾 Saved startDate to localStorage
```

### Expected NO-SHOWS (Bad Patterns):
- ❌ Immediate "fetchProduct_call" after date selection
- ❌ Multiple rapid localStorage writes
- ❌ Page reload indicators
- ❌ Context state resets

### Availability Check Logs:
```
🔍 Checking availability for product/bundling
🌐 Executing fetchProduct/fetchBundling with params
✅ React Query success
```

## Performance Verification 📈

### Network Tab Checks:
- **Date Selection**: Should show minimal network activity
- **Availability Check**: Should show single targeted API call
- **Page Reload**: Should reload context from localStorage, not API

### Console Performance:
- **Log Frequency**: Context logs should be throttled (max once per second)
- **localStorage Writes**: Should be debounced (not on every keystroke)
- **Re-render Count**: Minimal re-renders during date selection

## Common Issues & Troubleshooting 🔧

### Issue: Dates Reset After Selection
**Cause**: Context not properly initialized or localStorage conflicts
**Check**: Console for context loading errors
**Fix**: Verify BookingDatesProvider wraps the app

### Issue: Excessive API Calls
**Cause**: Debouncing not working or query keys not stable
**Check**: Network tab for multiple rapid requests
**Fix**: Verify debounced dates are used in query keys

### Issue: localStorage Not Persisting
**Cause**: Browser storage disabled or errors
**Check**: Browser dev tools → Application → Local Storage
**Fix**: Check console for localStorage errors

### Issue: Page Refresh on Date Selection
**Cause**: Form submission or navigation triggered
**Check**: Look for navigation logs or form events
**Fix**: Ensure calendar clicks don't trigger form submission

## Success Criteria ✅

The optimizations are working correctly if:

1. ✅ **Date Persistence**: Selected dates survive page reloads
2. ✅ **No Auto-Fetch**: Date selection doesn't trigger API calls
3. ✅ **Manual Control**: "Cek Ketersediaan" button controls API calls
4. ✅ **Context Sync**: All components show consistent date state
5. ✅ **Debounced Performance**: Rapid changes are handled smoothly
6. ✅ **Stable UI**: No unexpected page refreshes or resets
7. ✅ **Clean Logs**: Structured, throttled debug output

## Performance Benchmarks 📊

### Before Optimization:
- ~10-15 API calls during date selection
- ~5-10 localStorage writes per selection
- Multiple component re-renders
- Occasional date resets

### After Optimization:
- 0 API calls during date selection
- 1-2 localStorage writes per selection (debounced)
- Minimal component re-renders
- No date resets

If all tests pass, the booking date system is successfully optimized! 🎉
