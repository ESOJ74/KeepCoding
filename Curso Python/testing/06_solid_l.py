import unittest

# MAL!!!
class Rectangle:

    def get_width(self):
        return self._width

    def set_width(self, width):
        self._width = width

    def get_height(self):
        return self._height

    def set_height(self, height):
        self._height = height

    def calculateArea(self):
        return self._width * self._height


class Square(Rectangle):
    def set_width(self, width):
        self._width = width
        self._height = width

    def set_height(self, height):
        self._height = height
        self._width = height


class TestRectangle(unittest.TestCase):

    def setUp(self):
        pass

    def test_calculateArea(self):
        r = Square()
        r.set_width(5)
        r.set_height(4)
        self.assertEqual(r.calculateArea(), 20)
