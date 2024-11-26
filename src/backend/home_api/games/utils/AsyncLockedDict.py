import asyncio

class AsyncLockedDict:
    def __init__(self):
        self.dict = {}
        self.lock = asyncio.Lock()

    def _normalize_key(self, key):
        """Convert the key to a string."""
        return str(key)

    async def get(self, key, default=None):
        async with self.lock:
            key = self._normalize_key(key)
            return self.dict.get(key, default)

    async def set(self, key, value):
        async with self.lock:
            key = self._normalize_key(key)
            self.dict[key] = value

    async def delete(self, key):
        async with self.lock:
            key = self._normalize_key(key)
            if key in self.dict:
                del self.dict[key]

    async def get_keys_with_value(self, value):
        async with self.lock:
            return [k for k, v in self.dict.items() if v == value]

    async def set_field_value(self, key, value, field_name):
        async with self.lock:
            key = self._normalize_key(key)
            if key in self.dict:
                setattr(self.dict[key], field_name, value)

    async def print(self):
        async with self.lock:
            print('AsyncLockedDict:')
            for key, value in self.dict.items():
                print(f'{key}: {value}')
            print('')

    async def size(self):
        async with self.lock:
            return len(self.dict)
