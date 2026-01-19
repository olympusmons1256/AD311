import unittest
from solution import count_four_legged_animals

class TestAnimalLegCount(unittest.TestCase):
    #Normal cases
    def test_standard_input(self):
        animals = ['lion', 'monkey', 'deer', 'snake', 'elephant']
        self.assertEqual(count_four_legged_animals(animals), 3)

    def test_all_four_legged(self):
        self.assertEqual(count_four_legged_animals(['horse', 'dog', 'cat']), 3)

    def test_no_four_legged(self):
        self.assertEqual(count_four_legged_animals(['spider', 'ant', 'centipede']), 0)

    #Edge cases
    def test_empty_list(self):
        self.assertEqual(count_four_legged_animals([]), 0)

    def test_cast_sensitivity(self):
        self.assertEqual(count_four_legged_animals(['LION', 'Dog', 'ElePhant']), 3)

    def test_unknown_animals(self):
        self.assertEqual(count_four_legged_animals(['dragon', 'unicorn', 'phoenix']), 0)

if __name__ == '__main__':
    unittest.main()