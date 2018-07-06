import { message } from 'antd';

let ws1 = null;
const hostUrl = '192.168.0.151';
const wsUrl = `ws://${hostUrl}:9001`;
const wsProtocal = 'localSensePush-protocol';
const wsProtocalPivate = 'localSensePivate-protocol';
let listeners = [];

const defaultOpts = {
  hostUrl,
  wsUrl,
  wsProtocal,
  wsProtocalPivate,
};

function handlePosData(data) {
  const array_data = new Uint8Array(data);
  const tagnum = array_data[0];
  if (tagnum < 1) {
    return;
  }
  let offset = 1;
  const posArr = [];
  for (let i = 0; i < tagnum; i++) {
    const pos = {};
    pos.id = array_data[offset] * 256 + array_data[offset + 1];
    offset += 2;
    pos.x =
      array_data[offset] * 16777216 +
      array_data[offset + 1] * 65536 +
      array_data[offset + 2] * 256 +
      array_data[offset + 3];
    if (array_data[offset] & (0x80 === 0x80)) {
      // 有符号判断
      pos.x = -(0xffffffff - pos.x + 1);
    }
    offset += 4;
    pos.y =
      array_data[offset] * 16777216 +
      array_data[offset + 1] * 65536 +
      array_data[offset + 2] * 256 +
      array_data[offset + 3];
    if (array_data[offset] & (0x80 === 0x80)) {
      // 有符号判断
      pos.y = -(0xffffffff - pos.y + 1);
    }
    offset += 4;
    pos.z = array_data[offset] * 256 + array_data[offset + 1];
    offset += 2;
    if (array_data[offset] & (0x80 === 0x80)) {
      pos.z = -(0xffff - pos.z + 1);
    }
    pos.Indicator = array_data[offset];
    offset += 1;
    pos.capacity = array_data[offset];
    offset += 1;
    pos.sleep = array_data[offset];
    offset += 1;
    pos.timestamp =
      array_data[offset] * 16777216 +
      array_data[offset + 1] * 65536 +
      array_data[offset + 2] * 256 +
      array_data[offset + 3];
    offset += 4;
    const didian_no = array_data[offset];
    const louceng = array_data[offset + 1];
    pos.reserverd = array_data[offset] * 256 + array_data[offset + 1];
    offset += 2;
    posArr.push(pos);
    const hour = parseInt(pos.timestamp / 3600000);
    const min = parseInt((pos.timestamp - hour * 3600000) / 60);
  }
  return posArr;
}

function pushDataHandler(event) {
  if (event.data instanceof Blob) {
    const blob = event.data;
    // 先把blob进行拆分，第一个字节是标识
    let newblob = blob.slice(0, 3);
    // js中的blob没有没有直接读出其数据的方法，通过FileReader来读取相关数据
    const reader = new FileReader();
    reader.readAsArrayBuffer(newblob);
    let msgtype = -1;
    //  当读取操作成功完成时调用.
    reader.onload = function(evt) {
      if (evt.target.readyState == FileReader.DONE) {
        const data = evt.target.result;
        if (data.byteLength == 3) {
          const x = new Uint8Array(data);
          if (x[0] == 0xcc && x[1] == 0x5f && x[2] == 0x01) {
            // 位置信息
            msgtype = 1;
          } else if (x[0] == 0xcc && x[1] == 0x5f && x[2] == 0x05) {
            // 电量信息
            msgtype = 2;
          } else if (x[0] == 0xcc && x[1] == 0x5f && x[2] == 0x03) {
            msgtype = 3;
          } else if (x[0] == 0xcc && x[1] == 0x5f && x[2] == 0x08) {
            msgtype = 8;
          }
          newblob = blob.slice(3);
          reader.readAsArrayBuffer(newblob);
        } else if (msgtype == 1) {
          const posArr = handlePosData(data);
          listeners.forEach(listener => listener(posArr));
        }
      }
    };
  }
}

export function subscribe(listener) {
  listeners.push(listener);
}

export function clear() {
  listeners = [];
}

export function initConnection(opts = {}) {
  const resOpts = {
    ...defaultOpts,
    ...opts,
  };
  return new Promise((resolve, reject) => {
    const loadFinish = message.loading('联接位置服务器中');

    ws1 = new WebSocket(resOpts.wsUrl, [resOpts.wsProtocal]);
    ws1.addEventListener('open', () => {
      console.log('WebSocket open', ws1);
      loadFinish();
      message.success('成功联接位置服务器');
      resolve();
    });
    ws1.addEventListener('message', pushDataHandler);
    ws1.addEventListener('error', () => {
      loadFinish();
      message.error('联接位置服务器失败');
      reject();
    });
  });
}
