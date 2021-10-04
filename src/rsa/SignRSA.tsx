import { Button, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import bigInt from 'big-integer';

const SignRSA = () => {
  const [x, setX] = useState<any>();
  const [n, setN] = useState<any>();
  const [d, setD] = useState<any>();
  const [s, setS] = useState<any>();

  useEffect(() => {
    if (!(x && d && n)) {
      return;
    }
    try {
      setS(bigInt(x).modPow(d, n).toString());
    } catch (error) {
      console.log(error);
    }
  }, [x, d, n]);

  const reset = () => {
    setD('');
    setX('');
    setN('');
    setS('');
  };

  const autoFill = () => {
    setX('123');
    setD('2753');
    setN('3233');
  };

  return (
    <div>
      <h3 className='mb-4'>
        <b>Ký văn bản X bằng cặp khóa bí mật (d, n)</b>
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
          value={d}
          onChange={(e) => setD(e.target.value)}
          addonBefore='d'
          placeholder='Nhập khóa ký d'
          type='number'
        />
        <Input
          value={n}
          onChange={(e) => setN(e.target.value)}
          addonBefore='n'
          placeholder='Nhập n'
          type='number'
        />
      </Space>
      <hr />
      <p>
        <b>Bản rõ x = {x || 'undefined'}</b>
      </p>
      <p>
        <b>
          Khóa bí mật (d,n) = ({d || 'undefined'},{n || 'undefined'})
        </b>
      </p>
      <hr />
      <div>
        <p>
          <b>Chữ ký s = x ^ d mod n = </b>
          {x || 'undefined'} ^{d || 'undefined'} mod {n || 'undefined'} =
          {x || 'undefined'} ^{d || 'undefined'} mod {n || 'undefined'} =
          <b> {s || 'undefined'}</b>
        </p>
      </div>
      {s && s !== '0' && (
        <>
          <hr />
          <h4 className='text-danger'> =&gt; Chữ ký số: {s}</h4>
        </>
      )}
    </div>
  );
};

export default SignRSA;
