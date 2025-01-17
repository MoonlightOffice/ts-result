export class Err {
  msg: string;
  #history: Err[] = [];

  constructor(msg: string) {
    this.msg = msg;
  }

  is(err: Err): boolean {
    if (err === this) {
      return true;
    }

    for (const child of this.#history) {
      if (child.is(err)) {
        return true;
      }
    }

    return false;
  }

  add(err: Err): Err {
    if (this !== err) {
      this.#history.unshift(err);
    }

    return this;
  }

  toString(): string {
    let errText = this.msg;
    for (const err of this.#history) {
      errText += `: ${err.toString()}`;
    }

    return errText;
  }
}

export interface Result<T> {
  val: T;
  err: Err | null;
}

export function result<T>(ok: true, val: T): Result<T>;
export function result<T>(ok: false, ...errs: (Err | string)[]): Result<T>;
export function result<T>(ok: boolean, ...args: [T] | (Err | string)[]): Result<T> {
  if (!ok) {
    let err: Err;

    args = args as (Err | string)[];
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      if (i == 0) {
        if (typeof arg === "string") {
          err = new Err(arg);
        } else {
          err = arg;
        }
        continue;
      }

      if (typeof arg === "string") {
        err!.add(new Err(arg));
      } else {
        err!.add(arg);
      }
    }

    return { val: null as T, err: err! };
  }

  return { val: args[0] as T, err: null };
}
