class Vector3:
    def __init__(self, x=0.0, y=0.0, z=0.0):
        self.x = x
        self.y = y
        self.z = z

    def __add__(self, other):
        if isinstance(other, Vector3):
            return Vector3(self.x + other.x, self.y + other.y, self.z + other.z)
        raise TypeError("Operand must be of type Vector3")

    def __sub__(self, other):
        if isinstance(other, Vector3):
            return Vector3(self.x - other.x, self.y - other.y, self.z - other.z)
        raise TypeError("Operand must be of type Vector3")

    def __mul__(self, scalar):
        if isinstance(scalar, (int, float)):
            return Vector3(self.x * scalar, self.y * scalar, self.z * scalar)
        raise TypeError("Operand must be a number")

    def __truediv__(self, scalar):
        if isinstance(scalar, (int, float)):
            return Vector3(self.x / scalar, self.y / scalar, self.z / scalar)
        raise TypeError("Operand must be a number")

    def __repr__(self):
        return f"Vector3(x={self.x}, y={self.y}, z={self.z})"

    def to_list(self):
        return [self.x, self.y, self.z]

    @staticmethod
    def from_list(lst):
        if len(lst) != 3:
            raise ValueError("List must have exactly three elements")
        return Vector3(lst[0], lst[1], lst[2])