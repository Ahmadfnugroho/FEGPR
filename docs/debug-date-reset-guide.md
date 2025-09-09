# 🐛 Debug Guide: Date Reset Issue Tracing

## Overview
This guide helps you trace and debug why selected dates disappear after choosing them in the booking form.

## Debug Implementation Summary

### 1. Global BookingDatesContext ✅
- **Location**: `src/contexts/BookingDatesContext.tsx`
- **Features**:
  - Global state management with localStorage persistence
  - Comprehensive logging for all state changes
  - Stack trace logging for setter calls
  - Update counting and timing
  - Deduplication to prevent unnecessary updates

### 2. Fully Controlled DateRangePicker ✅
- **Location**: `src/components/DateRangePicker.tsx`
- **Changes**:
  - Removed internal date state - now purely controlled
  - Uses `value` prop directly as `selectedStartDate` and `selectedEndDate`
  - Added extensive logging for date clicks and changes
  - Added internal update tracking to prevent conflicts

### 3. Enhanced Components with Debug Logging ✅
- **Details.tsx** and **BundlingDetails.tsx**:
  - Now use global `useBookingDatesContext()` instead of local hook
  - Added comprehensive logging for context state changes
  - Added React Query parameter tracking
  - Added safeguards to detect if React Query affects date state

### 4. EnhancedBookingForm Debug Integration ✅
- Added logging for internal state changes
- Added logging for parent notification events
- Enhanced DateRangePicker onChange logging

## How to Debug the Issue

### Step 1: Open DevTools Console
1. Go to your app in the browser
2. Open DevTools (F12)
3. Go to Console tab
4. Clear console logs

### Step 2: Navigate to Details Page
1. Go to any product page: `/product/[slug]`
2. Look for these initial logs:
```
🔄 Loading dates from localStorage: { savedStartDate: null, savedEndDate: null }
📅 BookingDatesContext state changed: { startDate: null, endDate: null, ... }
🏠 Details.tsx: Date state from context: { startDate: null, endDate: null, ... }
📅 DateRangePicker mounted/updated with value: { value: { startDate: null, endDate: null } }
```

### Step 3: Select Start Date
1. Click on the date picker
2. Select a start date
3. Watch for these log sequences:
```
🎯 DateRangePicker handleDateClick: { clickedDate: "2024-01-15T00:00:00.000Z", ... }
🆕 Starting new date selection: { newRange: { startDate: "2024-01-15T00:00:00.000Z", endDate: null } }
📅 EnhancedBookingForm: DateRangePicker onChange called: { oldDateRange: {...}, newDateRange: {...} }
🔄 setDateRange called: { input: {...}, converted: { startDateString: "2024-01-15", endDateString: null } }
💾 Saved startDate to localStorage: 2024-01-15
📅 BookingDatesContext state changed: { startDate: "2024-01-15", endDate: null, updateCount: 1 }
```

### Step 4: Select End Date
1. Select an end date
2. Watch for completion sequence:
```
🎯 DateRangePicker handleDateClick: { clickedDate: "2024-01-20T00:00:00.000Z", ... }
✅ Completing date range: { newRange: { startDate: "2024-01-15T00:00:00.000Z", endDate: "2024-01-20T00:00:00.000Z" } }
🔄 setDateRange called: { converted: { startDateString: "2024-01-15", endDateString: "2024-01-20" } }
💾 Saved endDate to localStorage: 2024-01-20
📅 BookingDatesContext state changed: { startDate: "2024-01-15", endDate: "2024-01-20", updateCount: 2 }
📤 EnhancedBookingForm: Notifying parent of date change: { oldDates: {...}, newDates: {...} }
🗓️ Details.tsx: handleDateChange called: { newStartDate: "2024-01-15", newEndDate: "2024-01-20" }
🔍 Details.tsx: React Query parameters: { queryKey: ["product", slug, "2024-01-15", "2024-01-20"] }
🌐 Details.tsx: Executing fetchProduct with params: { slug: "...", startDate: "2024-01-15", endDate: "2024-01-20" }
```

### Step 5: Check for Date Loss
**If dates disappear, look for:**

#### A. Context State Reset
```
❌ BAD: BookingDatesContext state changed: { startDate: null, endDate: null, updateCount: 3 }
❌ BAD: setDateRange called with null values
❌ BAD: clearDates called unexpectedly
```

#### B. Component Re-mounting
```
❌ BAD: Multiple "DateRangePicker mounted/updated" logs in quick succession
❌ BAD: Context provider re-initializing
```

#### C. React Query Interference
```
❌ BAD: React Query settled with different date params than expected
❌ BAD: Context state corruption after API calls
```

## Common Causes and Solutions

### Issue 1: DatePicker Fighting with External State
**Symptoms:**
- Dates selected but immediately reset to null
- Multiple rapid state changes

**Debug Logs to Look For:**
```
🔄 DateRangePicker controlled values changed: (multiple rapid changes)
⏭️ setDateRange: No changes, skipping update (should prevent loops)
```

**Solution:** 
- DateRangePicker is now fully controlled ✅
- No internal state conflicts ✅

### Issue 2: Component Re-mounting
**Symptoms:**
- Context resets on every interaction
- localStorage gets cleared unexpectedly

**Debug Logs to Look For:**
```
🔄 Loading dates from localStorage: (happening too frequently)
📅 BookingDatesContext state changed: { updateCount: 0 } (reset to 0)
```

**Solution:**
- Context is now at App level ✅
- Should persist across navigation ✅

### Issue 3: React Query Resetting State
**Symptoms:**
- Dates disappear after API calls complete

**Debug Logs to Look For:**
```
🏁 React Query settled: { contextPreserved: { startDate: null, endDate: null } }
❌ React Query error/success with different date state than expected
```

**Solution:**
- Added safeguards to detect this ✅
- Context state is independent of React Query ✅

### Issue 4: EnhancedBookingForm Internal Conflicts
**Symptoms:**
- Dates selected in picker but not reflected in booking form

**Debug Logs to Look For:**
```
📅 EnhancedBookingForm: DateRangePicker onChange called (but no context update)
🔄 EnhancedBookingForm: Checking if should notify parent: { willNotify: false }
```

**Solution:**
- Added comprehensive logging to trace the flow ✅
- Deduplication prevents infinite loops ✅

## Testing Script

Run this in the browser console to monitor date state:

```javascript
// Monitor BookingDatesContext state changes
let previousDates = { startDate: null, endDate: null };
setInterval(() => {
  // This assumes context is accessible globally - adjust as needed
  console.log('🔍 Periodic date state check:', {
    timestamp: new Date().toISOString(),
    localStorage: {
      startDate: localStorage.getItem('booking_start_date'),
      endDate: localStorage.getItem('booking_end_date')
    }
  });
}, 5000);

// Log all console messages containing date-related keywords
const originalConsoleLog = console.log;
console.log = function(...args) {
  const message = args.join(' ');
  if (message.includes('📅') || message.includes('🗓️') || message.includes('📦')) {
    originalConsoleLog('🔍 DATE DEBUG:', new Date().toISOString(), ...args);
  } else {
    originalConsoleLog(...args);
  }
};
```

## Success Indicators

When the fix is working correctly, you should see:

1. **Persistent State:**
   ```
   💾 Saved startDate to localStorage: 2024-01-15
   💾 Saved endDate to localStorage: 2024-01-20
   ```

2. **Controlled Components:**
   ```
   🔄 DateRangePicker controlled values changed: { selectedStartDate: "2024-01-15", selectedEndDate: "2024-01-20" }
   ```

3. **Context Stability:**
   ```
   📅 BookingDatesContext state changed: { startDate: "2024-01-15", endDate: "2024-01-20", updateCount: 2 }
   (updateCount should increment, not reset)
   ```

4. **No Unwanted Resets:**
   ```
   ✅ Details.tsx: Date state preserved after React Query success
   ✅ BundlingDetails.tsx: Date state preserved after React Query success
   ```

## Additional Debug Commands

### Check localStorage directly:
```javascript
console.log('LocalStorage dates:', {
  startDate: localStorage.getItem('booking_start_date'),
  endDate: localStorage.getItem('booking_end_date')
});
```

### Manually trigger date selection (for testing):
```javascript
// This would need to be adapted based on your actual context implementation
// Example: context.setDates('2024-01-15', '2024-01-20');
```

## Next Steps

1. **Follow the debug steps above** to identify exactly where dates are being reset
2. **Look for the specific log patterns** that indicate the root cause
3. **Check the browser's localStorage** to see if persistence is working
4. **Monitor React Query behavior** to ensure it's not interfering with date state
5. **Verify the DateRangePicker** is truly controlled and not fighting with external state

The extensive logging should make it very clear where the date reset is happening in the component lifecycle.
