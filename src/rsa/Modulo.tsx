import { Button, Input, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import bigInt from 'big-integer';

const ModuloCaculate = () => {
  const [x, setX] = useState<any>();
  const [y, setY] = useState<any>();
  const [n, setN] = useState<any>();
  const [e, setE] = useState<any>();

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

  const reset = () => {
    setE('');
    setX('');
    setY('');
    setN('');
  };

  const autoFill = () => {
    setX('123');
    setE('2753');
    setN('3233');
  };

  return (
    <div>
      <h3 className='mb-4'>
        <b>Tính mũ theo Modulo y = x ^ e mod n</b>
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
          placeholder='Nhập x'
          type='number'
        />
        <Input
          value={e}
          onChange={(e) => setE(e.target.value)}
          addonBefore='e'
          placeholder='Nhập e'
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
      <h3>
        <b>y = {y || 'undefined'}</b>
      </h3>
    </div>
  );
};

export default ModuloCaculate;
