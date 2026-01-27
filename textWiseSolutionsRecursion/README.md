# TextWise Solutions | Recursion

## Diagram of Approach


## Clarifying Questions
- Should the function preserve special characters and spaces?
- What should happen with empty strings?
- Are there any character encoding concerns? i.e. unicode or emojis.
- Is there a maximum string length?
- Should the function be case-sensitive?
- How should null inputs be handled?

## Test Cases
- normal case 1. Short string: "hello" > "olleh"
- normal case 2. String with spaces "hello world" > "dlrow olleh"
- normal case 3. String with special characters "abc123!@#" > "#@!321cba"

- edge case 1. Empty string "" > ""
- edge case 2. Single character "a" > "a"
- edge case 3. Palindrome "racecar" > "racecar"
- edge case 4. Long string "[insert paragraph]" > "[paragraph reversed]"
- edge case 5. String with only spaces "    " > "    "

## Time & Space Complexity
- Time complexity: 0(n) must process each character once.
- Space complexity: 0(n) recursive call stack depth equals length of string + 0(n) for string concatenation in each call. *string concatenation in recursion creates new strings at each level. In this sense it is less efficient for large strings. i.e. if the algorithm is applied to reversing paragraphs or similar.