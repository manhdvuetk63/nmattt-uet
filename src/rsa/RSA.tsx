import { Button, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { gcd } from '../utils/extendedEuclid';
import { BigNumber } from 'bignumber.js';
// import * as bigintCryptoUtils from 'bigint-crypto-utils';
// import * as bigintModArith from 'bigint-mod-arith';
import bigInt from 'big-integer';

const RSA = () => {
  const [p, setP] = useState<any>();
  const [q, setQ] = useState<any>();
  const [m, setM] = useState<any>();
  const [g, setG] = useState<any>();
  const [d, setD] = useState<any>();
  const [de, setDe] = useState<any>();
  const [x, setX] = useState<any>();
  const [y, setY] = useState<any>();
  const [n, setN] = useState<any>();
  const [e, setE] = useState<any>();

  useEffect(() => {
    if (!(p && q)) {
      return;
    }
    try {
      setN(new BigNumber(p).multipliedBy(q).toFixed());
      setM(
        new BigNumber(new BigNumber(p).minus(1))
          .multipliedBy(new BigNumber(q).minus(1))
          .toFixed()
      );
    } catch (error) {
      console.log(error);
    }
  }, [p, q]);

  useEffect(() => {
    if (!(e && m)) {
      return;
    }
    try {
      setG(gcd(e, m));
      setD(bigInt(e).modInv(m).toString());
    } catch (error) {
      console.log(error);
    }
  }, [e, m]);

  useEffect(() => {
    if (!(x && e && n)) {
      return;
    }
    try {
      setY(bigInt(x).modPow(e, n).toString());
    } catch (error) {
      console.log(error);
    }
  }, [x, e, n]);

  useEffect(() => {
    if (!(y && d && n)) {
      return;
    }
    try {
      setDe(bigInt(y).modPow(d, n).toString());
    } catch (error) {
      console.log(error);
    }
  }, [y, d, n]);

  const reset = () => {
    setP('');
    setQ('');
    setE('');
    setX('');
    setM('');
    setG('');
    setD('');
    setDe('');
    setY('');
    setN('');
  };

  const autoFill = () => {
    setX('123456789');
    setP(
      '60189309855228152582080418108842142489913101192853892029893420328887351871793'
    );
    setQ(
      '74714197566136059701452833471216875182865235128709397697022189913844351225357'
    );
    setE(65537);
  };

  return (
    <div>
      <h3 className='mb-4'>
        <b>Xây dựng hệ mật RSA</b>
      </h3>
      <Space>
        <Button onClick={autoFill}>Example (Auto Fill)</Button>
        <Button onClick={reset}>Clear All</Button>
        <Button
          onClick={() => {
            window.open(
              'https://asecuritysite.com/encryption/nprimes?y=256',
              '_blank'
            );
          }}
        >
          Generate P,Q
        </Button>
      </Space>
      <hr />
      <Space className='w-100' direction='vertical' size='large'>
        <Input
          value={x}
          onChange={(e) => setX(e.target.value)}
          addonBefore='x'
          placeholder='Nhập bản rõ x'
          type='number'
        />
        <Input
          value={p}
          onChange={(e) => setP(e.target.value)}
          addonBefore='p'
          placeholder='Nhập p'
          type='number'
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          addonBefore='q'
          placeholder='Nhập q'
          type='number'
        />
        <Input
          value={e}
          onChange={(e) => setE(e.target.value)}
          addonBefore='e'
          placeholder='Nhập e'
          type='number'
        />
      </Space>
      <hr />

      <Space direction='vertical'>
        <div>
          <b>Bản rõ x = </b>
          {x || 'undefined'}
        </div>
        <div>
          <b>Bản mã y = </b>
          {y || 'undefined'}
        </div>
        <div>
          <b>p = </b>
          {p || 'undefined'}
        </div>
        <div>
          <b>q = </b>
          {q || 'undefined'}
        </div>
        <div>
          <b>Khóa công khai (e,n) = </b>({e || 'undefined'} , {n || 'undefined'}
          )
        </div>
        <div>
          <b>Khóa bí mật (d,n) = </b>({d || 'undefined'} , {n || 'undefined'})
        </div>
      </Space>
      <hr />
      <Space>
        {p * q > 0 && (
          <div>
            <p>
              <b>n = p * q = </b> {p} * {q} = {n}
            </p>
            <p>
              <b>m = phi(n) = (p - 1)(q - 1) = </b>
              {p - 1} * {q - 1} ={BigInt(m || 0).toString()}
            </p>
            <p>
              <b>gcd(e, m)</b> = <code>{g}</code>
            </p>
            {g !== 1 && (
              <b className='text-danger'>
                <b> gcd(e, m) =</b> <code>{g} != 1</code> ==&gt; e được chọn
                không thỏa mãn !
              </b>
            )}
            {g === 1 && (
              <div>
                <p>
                  Ta nhân thấy e được chọn thỏa mãn{' '}
                  <b>
                    <code>gcd(e, m) = 1</code>
                  </b>
                  .
                </p>
                <hr />
                <h4>Bước 1: Thực hiện tính khóa bí mật d</h4>
                <p>Áp dụng thuật toán Euclid mở rộng, ta có:</p>
                <b>d = e ^ -1 mod m</b>= {e} ^ -1 mod {m} = {d}
                {!x || x <= 0 ? (
                  <div>
                    <hr />
                    <h4 className='text-danger'>Hãy nhập x &gt; 0 !!!</h4>
                  </div>
                ) : (
                  <div>
                    <hr />
                    <h4>Bước 2: Mã hóa bản rõ x = {x}</h4>
                    <p>
                      <b>y = x ^ e mod n = </b>
                      {x} ^ {e} mod {n} = {y}
                    </p>
                    <hr />
                    <h4>Bước 3: Giải mã y khi biết d, n</h4>
                    <p>
                      <b>x = y ^ d mod n = </b>
                      {y} ^{d} mod {n}
                      <hr />
                      <h4 className='text-danger'>
                        <b>x = {de}</b>
                      </h4>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Space>
    </div>
  );
};

export default RSA;
