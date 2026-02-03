import unittest
from inventory_manager import duplicate_zeros

class TestInventory(unittest.TestCase):
    # Normal Cases
    def test_normal_1(self):
        inv = [4, 0, 1, 3, 0, 2, 5, 0]
        duplicate_zeros(inv)
        self.assertEqual(inv, [4, 0, 0, 1, 3, 0, 0, 2])

    def test_normal_2(self):
        inv = [1, 2, 3]
        duplicate_zeros(inv)
        self.assertEqual(inv, [1, 2, 3])

    def test_normal_3(self):
        inv = [0, 1, 2]
        duplicate_zeros(inv)
        self.assertEqual(inv, [0, 0, 1])

    # Edge Cases
    def test_edge_empty(self):
        inv = []
        duplicate_zeros(inv)
        self.assertEqual(inv, [])

    def test_edge_end_zero(self):
        inv = [1, 2, 0]
        duplicate_zeros(inv)
        self.assertEqual(inv, [1, 2, 0])

    def test_edge_all_zeros(self):
        inv = [0, 0, 0]
        duplicate_zeros(inv)
        self.assertEqual(inv, [0, 0, 0])

if __name__ == "__main__":
    unittest.main()