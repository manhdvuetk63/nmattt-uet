import { powerModulo } from "./powerModulo";

// kiểm tra số nguyên tố
export function isPrime(n: number) {
  // Trường hợp đặc biệt
  if (n <= 1n) return false;
  if (n <= 3n) return true;

  // kiểm tra số nguyên tố
  if (n % 2 === 0 || n % 3 === 0) return false;

  for (let i = 5; i * i <= n; i = i + 6)
    if (n % i === 0 || n % (i + 2) === 0) return false;

  return true;
}

// tìm ước nguyên tố
export function findPrimeFactors(s: number[], n: number) {
  while (n % 2 === 0) {
    s.push(2);
    n = n / 2;
  }

  for (let i = 3; i <= Math.sqrt(n); i = i + 2) {
    while (n % i === 0) {
      s.push(i);
      n = n / i;
    }
  }

  if (n > 2) s.push(n);
}

export function findPrimitive(n: number) {
  let s: number[] = [];
  let output: number[] = [];

  // kiểm tra số nguyên tố
  if (isPrime(n) === false) return [-1];

  let phi = n - 1;

  findPrimeFactors(s, phi);

  for (let r = 2; r <= phi; r++) {
    let flag = false;
    for (let it of s) {
      if (powerModulo(r, phi / it, n) === 1) {
        flag = true;
        break;
      }
    }

    if (flag === false) {
      output.push(r);
    }
  }

  return output;
}
