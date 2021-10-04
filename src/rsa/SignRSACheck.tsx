import { Button, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
// import * as bigintCryptoUtils from 'bigint-crypto-utils';
import bigInt from 'big-integer';

const SignCheckRSA = () => {
  const [x, setX] = useState<any>();
  const [n, setN] = useState<any>();
  const [e, setE] = useState<any>();
  const [s, setS] = useState<any>();
  const [result, setResult] = useState<any>();
  const [check, setCheck] = useState<boolean>(false);

  useEffect(() => {
    if (!(s && e && n)) {
      return;
    }
    try {
      let _result = bigInt(s).modPow(e, n).toString();
      setResult(_result);
      setCheck(_result === x.toString());
    } catch (error) {
      console.log(error);
    }
  }, [x, e, n, s]);

  const reset = () => {
    setE('');
    setX('');
    setS('');
    setN('');
    setCheck(false);
  };

  const autoFill = () => {
    setX('123');
    setS('2746');
    setE('17');
    setN('3233');
  };

  return (
    <div>
      <h3 className='mb-4'>
        <b>Kiểm tra chữ ký</b>
      </h3>
      <Space>
        <Button onClick={autoFill}>Example (Auto Fill)</Button>
        <Button onClick={reset}>Clear All</Button>
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
          value={s}
          onChange={(e) => setS(e.target.value)}
          addonBefore='s'
          placeholder='Nhập chữ ký s'
          type='number'
        />
        <Input
          value={e}
          onChange={(e) => setE(e.target.value)}
          addonBefore='d'
          placeholder='Nhập khóa công khai e'
          type='number'
        />
        <Input
          value={n}
          onChange={(e) => setN(e.target.value)}
          addonBefore='n'
          placeholder='Nhập n công khai'
          type='number'
        />
      </Space>
      <hr />
      <p>
        <b>Bản rõ x = {x || 'undefined'}</b>
      </p>
      <p>
        <b>Chữ ký số = {s || 'undefined'}</b>
      </p>
      <p>
        <b>Khóa công khai e = {e || 'undefined'}</b>
      </p>
      <p>
        <b>Modulo khóa công khai n = {n || 'undefined'}</b>
      </p>
      <hr />
      <div>
        <p>
          <b>
            Verify (x, s) = (x === s ^ e mod n) ?{' '}
            <code>{check.toString()}</code>{' '}
          </b>
        </p>
      </div>
      {s && e && n && (
        <>
          <hr />
          <p>
            <b>s ^ e mod n = </b>
            {s} ^ {e} mod {n} = {result}
          </p>
          {check ? (
            <p>
              <b className='text-danger'>
                x = {x} === {result}
              </b>
            </p>
          ) : (
            <p>
              <b className='text-danger'>
                x == {x} !== {result}
              </b>
              <hr />
            </p>
          )}
          {check ? (
            <h4 className='text-danger'>
              <b>Đây là chữ ký hợp lệ</b>
            </h4>
          ) : (
            <h4 className='text-danger'>
              <b>Chữ ký không hợp lệ</b>
            </h4>
          )}
        </>
      )}
    </div>
  );
};

export default SignCheckRSA;
