import * as bigintModArith from 'bigint-mod-arith';

export function modPow(b: bigint, e: bigint, n: bigint): bigint {
  if (typeof b === 'number') b = BigInt(b);
  if (typeof e === 'number') e = BigInt(e);
  if (typeof n === 'number') n = BigInt(n);

  if (n <= 0n) {
    throw new RangeError('n must be > 0');
  } else if (n === 1n) {
    return 0n;
  }

  b = bigintModArith.toZn(b, n);

  if (e < 0n) {
    return bigintModArith.modInv(
      modPow(b, BigInt(bigintModArith.abs(e)), n),
      n
    );
  }

  let r = 1n;
  while (e > 0) {
    if (e % 2n === 1n) {
      r = (r * b) % n;
    }
    e = e / 2n;
    b = b ** 2n % n;
  }
  return r;
}
