import unittest
from unittest.mock import patch

import pytest


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


def test_int_to_roman_1():
    assert int_to_roman(1) == "I"

def test_int_to_roman_2():
    assert int_to_roman(2) == "II"



@pytest.mark.parametrize("input_function,expected", [
    (1, "I"),
    (2, "II"),
    (3, "III"),
    (4, "IV"),
    (5, "V"),
    (6, "VI"),
])
def test_int_to_roman(input_function, expected):
    assert int_to_roman(input_function) == expected
