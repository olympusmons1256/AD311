import unittest
from solution import reverse_string

class TestReverseString(unittest.TestCase):
    # normal cases
    def test_basic_word(self):
        self.assertEqual(reverse_string("hello"), "olleh")

    def test_with_spaces(self):
        self.assertEqual(reverse_string("hello world"), "dlrow olleh")

    def test_with_specials_and_numbers(self):
        self.assertEqual(reverse_string("abc123!@#"), "#@!321cba")

    # edge cases
    def test_empty_string(self):
        self.assertEqual(reverse_string(""), "")

    def test_single_character(self):
        self.assertEqual(reverse_string("a"), "a")

    def test_palindrome(self):
        self.assertEqual(reverse_string("madam"), "madam")

    def test_unicode_emojis(self):
        self.assertEqual(reverse_string("hello😊👍"), "👍😊olleh")
    
    def test_only_spaces(self):
        self.assertEqual(reverse_string("     "), "     ")

    def test_long_string(self):
        long_str = "a" * 901
        self.assertEqual(reverse_string(long_str), long_str)

    if __name__ == "__main__":
        unittest.main()
