import unittest
from solution import merge_customers

class TestCustomerMerge(unittest.TestCase):
    def test_interleave(self):
        c1 = [101, 104, 107, 0, 0, 0]; m = 3; c2 = [102, 105, 108]; n = 3
        merge_customers(c1, m, c2, n)
        self.assertEqual(c1, [101, 102, 104, 105, 107, 108])

    def test_c1_smaller(self):
        c1 = [201, 202, 0, 0]; m = 2; c2 = [203, 204]; n = 2
        merge_customers(c1, m, c2, n)
        self.assertEqual(c1, [201, 202, 203, 204])

    def test_duplicates(self):
        c1 = [301, 303, 0, 0, 0]; m = 2; c2 = [302, 303, 304]; n = 3
        merge_customers(c1, m, c2, n)
        self.assertEqual(c1, [301, 302, 303, 303, 304])

    def test_empty_c1(self):
        c1 = []; m = 0; c2 = [401, 402, 403]; n = 3
        merge_customers(c1, m, c2, n)
        self.assertEqual(c1, [401, 402, 403])

    def test_empty_c2(self):
        c1 = [401, 402, 403]; m = 3; c2 = []; n = 0
        merge_customers(c1, m, c2, n)
        self.assertEqual(c1, [401, 402, 403])

    def test_single_elements(self):
        c1 = [501, 0]; m = 1; c2 = [500]; n = 1
        merge_customers(c1, m, c2, n)
        self.assertEqual(c1, [500, 501])