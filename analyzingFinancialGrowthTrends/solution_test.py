import unittest
from solution import sorted_squared_growth

class TestFinancialGrowthTrends(unittest.TestCase):

    #normal cases
    def test_normal_case_negative_positive(self):
        growthPercentages = [-5, -2, 0, 3, 10]
        expected = [0, 4, 9, 25, 100]
        self.assertEqual(sorted_squared_growth(growthPercentages), expected)

    def test_different_array_sizes(self):
        growthPercentages = [1, 2, 3,4,5,6,7,8,9]
        expected = [1, 4, 9, 16, 25, 36, 49, 64, 81]
        self.assertEqual(sorted_squared_growth(growthPercentages), expected)

    def test_all_negative(self):
        growthPercentages = [-3, -2, -1, 0, 1]
        expected = [0, 1, 1, 4, 9]
        self.assertEqual(sorted_squared_growth(growthPercentages), expected)

    #edge cases
    def test_empty_array(self):
        growthPercentages = []
        expected = []
        self.assertEqual(sorted_squared_growth(growthPercentages), expected)
    
    def test_single_element(self):
        growthPercentages = [-4]
        expected = [16]
        self.assertEqual(sorted_squared_growth(growthPercentages), expected)

    def test_matching_squares(self):
        growthPercentages = [-2, -1, 0, 1, 2]
        expected = [0, 1, 1, 4, 4]
        self.assertEqual(sorted_squared_growth(growthPercentages), expected)

if __name__ == '__main__':
    unittest.main()