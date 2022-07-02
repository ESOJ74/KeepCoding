import unittest


def int_to_roman(num):
    val = [
        1000, 900, 500, 400,
        100, 90, 50, 40,
        10, 9, 5, 4,
        1
    ]
    syb = [
        "M", "CM", "D", "CD",
        "C", "XC", "L", "XL",
        "X", "IX", "V", "IV",
        "I"
    ]
    roman_num = ''
    i = 0
    while num > 0:
        for _ in range(num // val[i]):
            roman_num += syb[i]
            num -= val[i]
        i += 1
    return roman_num


class TestSum(unittest.TestCase):

    def _check_int_to_roman(self, num, result_string):
        self.assertEqual(int_to_roman(num), result_string)

    def test_int_to_roman_04(self):
        self._check_int_to_roman(4, "IV")

    def test_int_to_roman_05(self):
        self.assertEqual(int_to_roman(5), "V")

    def test_int_to_roman_0(self):
        self.assertFalse(int_to_roman(0))

    def test_int_to_roman_many_cases(self):
        result = [
            int_to_roman(6),
            int_to_roman(7),
            int_to_roman(8),
        ]
        self.assertTrue(all(result))

if __name__ == '__main__':
    unittest.main()
