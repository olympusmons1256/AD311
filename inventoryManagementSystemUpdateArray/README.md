## Clarifying Questions
- Fixed Length: Should the array length remain strictly constant even if we find many zeros?
- Input Validation: How should the system handle empty arrays or null inputs?
- Data Range: Are product counts always non-negative integers?

## Test Cases
- Normal Case 1. Multiple Zeros: [4, 0, 1, 3, 0, 2, 5, 0] > [4, 0, 0, 1, 3, 0, 0, 2]
- Normal Case 2. No Zeros: [1, 2, 3] > [1, 2, 3] 
- Normal Case 3. Zeros at the Start: [0, 1, 2] > [0, 0, 1] //immediate shift 

- Edge Case 1. Empty Array: [] > []
- Edge Case 2. Single Zero: [0] > [0] //no room to duplicate
- Edge Case 3. Zero at the Very End: [1, 2, 0] > [1, 2, 0] //no room to duplicate
- Edge Case 4. All Zeros: [0, 0, 0] > [0, 0, 0] //all zeros
- Edge Case 5. Large Inventory: [1, 0, 2, 0, 3, 0, 4, 0, ...] > [1, 0, 0, 2, 0, 0, 3, 0, ...]

## Time & Space Complexity
- Time Complexity: O(n) because we only pass through the inventory twice.
- Space Complexity: O(1) as we modify the array in place.