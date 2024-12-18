import { assertEquals } from "@std/assert";
import { Err, Result, result } from "./result.ts";

Deno.test("Err and is", () => {
  const Err1 = new Err("error 1");
  const Err2 = new Err("error 2").add(Err1);
  const Err3 = new Err("error 3");

  assertEquals(Err1.is(Err1), true);
  assertEquals(Err2.is(Err1), true);
  assertEquals(Err2.is(Err3), false);
  assertEquals(Err3.is(Err1), false);
});

Deno.test("Result", () => {
  const ErrInvalid = new Err("invalid error");

  function fibonacci(k: number): Result<number> {
    if (k < 0) {
      return result(false, "k must be greater than or equal to 0", ErrInvalid);
    }

    if (k == 0 || k == 1) {
      return result(true, k);
    }

    const { value: a } = fibonacci(k - 1);
    const { value: b } = fibonacci(k - 2);

    return result(true, a + b);
  }
  {
    const { ok, value } = fibonacci(3);
    assertEquals(ok, true);
    assertEquals(value, 2);
  }
  {
    const { err, ok, value } = fibonacci(-1);
    assertEquals(ok, false);
    assertEquals(err.is(ErrInvalid), true);
    assertEquals(value, null);
  }
});
