def sorted_squared_growth(growthPercentages):

    n = len(growthPercentages)
    result = [0] * n
    
    # two pointers: one at the start and one at the end of the input array
    left = 0
    right = n - 1

    # Output array is filled from the end to the beginning. This will result in squared values being sorted in non-decreasing order.
    for i in range(n - 1, -1, -1):
        left_squared = growthPercentages[left] ** 2
        right_squared = growthPercentages[right] ** 2

        if left_squared > right_squared:
            result[i] = left_squared
            left += 1
        else:
            result[i] = right_squared
            right -= 1

    return result

  

