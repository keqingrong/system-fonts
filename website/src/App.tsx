import React from 'react';
import { Table } from 'antd';
import { getFontList } from './data';
import './App.css';

const columns = [
  {
    title: 'Font Name',
    dataIndex: 'fontName',
    key: 'fontName',
  },
  {
    title: 'Font Family',
    dataIndex: 'fontFamily',
    key: 'fontFamily',
  },
  {
    title: 'File Name',
    dataIndex: 'fileName',
    key: 'fileName',
  },
  {
    title: 'Version',
    dataIndex: 'version',
    key: 'version',
  },
  {
    title: 'OS',
    dataIndex: 'osFullName',
    key: 'osFullName',
  }
  // {
  //   title: 'OS',
  //   dataIndex: 'os',
  //   key: 'os',
  // },
  // {
  //   title: 'OS version',
  //   dataIndex: 'osVersion',
  //   key: 'osVersion',
  // },
  // {
  //   title: 'OS Codename',
  //   dataIndex: 'osCodename',
  //   key: 'osCodename',
  // },
];

const data = getFontList();

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>system-fonts (WIP)</h1>
      <Table
        bordered
        size="middle"
        pagination={false}
        scroll={{
          y: 500
        }}
        columns={columns}
        dataSource={data}
      />
    </div>
  );
}

export default App;
