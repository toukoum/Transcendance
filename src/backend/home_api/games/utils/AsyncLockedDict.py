
import asyncio

class AsyncLockedDict:
    def __init__(self):
        self.dict = {}
        self.lock = asyncio.Lock()

    async def get(self, key, default=None):
        async with self.lock:
            return self.dict.get(key, default)

    async def set(self, key, value):
        async with self.lock:
            self.dict[key] = value

    async def delete(self, key):
        async with self.lock:
            if key in self.dict:
                del self.dict[key]

    async def get_keys_with_value(self, value):
        async with self.lock:
            return [k for k, v in self.dict.items() if v == value]
        
    async def set_field_value(self, key, value, field_name):
        async with self.lock:
            setattr(self.dict[key], field_name, value)