import asyncio
import time


async def say_after(delay, what):
    await asyncio.sleep(delay)
    print(what)


async def main():
    await asyncio.sleep(1)
    print('hello')


asyncio.run(main())


async def main():
    # Desde Python 3.7, antes se usaba: asyncio.ensure_future
    task1 = asyncio.ensure_future(
        say_after(1, 'hello'))

    task2 = asyncio.create_task(
        say_after(2, 'world'))

    print(f"started at {time.strftime('%X')}")

    # Wait until both tasks are completed (should take
    # around 2 seconds.)
    await task1
    await task2

    print(f"finished at {time.strftime('%X')}")


asyncio.run(main())
