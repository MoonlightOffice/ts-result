# Usage

Handle errors as return values instead of using try-catch block. Golang-like error handling, in
TypeScript.

## Err

Define your custom error types.

```TypeScript
import { Err } from "https://raw.githubusercontent.com/MoonlightOffice/ts-result/main/index.ts";

const Err1 = new Err("error 1");
const Err2 = new Err("error 2").add(Err1);
const Err3 = new Err("error 3");

console.log(Err1.is(Err1)); // true
console.log(Err2.is(Err1)); // true
console.log(Err2.is(Err3)); // false
console.log(Err3.is(Err1)); // false

console.log(Err1.toString());
// error 1
console.log(Err2.toString());
// error 2: error 1
```

## Result

Return values and errors. Use result() when returning a Result value.

```TypeScript
import {
  Err,
  result,
} from "https://raw.githubusercontent.com/MoonlightOffice/ts-result/main/index.ts";

const ErrNotFound = new Err("not found");

const res1 = result(true, "Success value");
const res2 = result(false, ErrNotFound);
const res3 = result(false, "user doesn't exist", ErrNotFound);
```

Sample usage is as follows.

```TypeScript
import {
  Err,
  type Result,
  result,
} from "https://raw.githubusercontent.com/MoonlightOffice/ts-result/main/index.ts";

const ErrNotFound = new Err("not found");

interface User {
  id: string;
  name: string;
}

async function fetchUserData(): Promise<Result<User>> {
  try {
    const resp = await fetch("https://example.com/api/user");
    const u: User = await resp.json();
    return result(true, u);
  } catch {
    return result(false, ErrNotFound);
  }
}

async function main() {
  const { err, ok, value } = await fetchUserData();
  if (!ok) {
    if (err.is(ErrNotFound)) {
      console.log("invalid user input");
      return;
    }

    console.error("unexpected error had occurred:", err.toString());
    return;
  }

  console.log(`User id: ${value.id}, User name: ${value.name}`);
}

if (import.meta.main) {
  main();
}
```
