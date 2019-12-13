/* 
2019-3-19 buffer 和 stream 测试
*/

const {Writable,Readable, Duplex,Transform} = require('stream');

const bf1 = Buffer.alloc(10);

const bf2 = Buffer.from("zhangmingzhii好牛逼est");
debugger;
function printOutBuffer(bufferInstance){
  console.group("-------");
  console.log(`rawBuffer: `, bufferInstance);
  console.log(`buffer.encoding: `, Buffer.isEncoding('ascii'))
  console.log(`buffer.length:`, bufferInstance.length)
  console.log(`buffer.utf8: `, bufferInstance.toString("utf-8"))
  console.log(`buffer.default: `, bufferInstance.toString("ascii"))
  var name = 'shit';
  debugger;
  console.groupEnd()
}
printOutBuffer(bf2);
class MWS extends Writable{
  constructor(options){
    super(options)
    this.data = '';
  }
  _write(chunk, enconding, callback){
    if(chunk.toString() === '@'){
    }else{
      
    }
    this.data += chunk.toString("utf-8").replace('#', "@");
    // this.data +=chunk;
    console.log(chunk, 'single chunk');
    callback();
  }
}

class MRS extends Readable{
  constructor(data){
    super();
    this.data = data;
    
  }
  _read(size){
    for(let i of this.data){
      this.push(i+"#");
    }
    // equals ws.end();
    this.push(null);
  }
}

class MDUP extends Duplex{
  constructor(data){
    super();
    this.data = data;
    this.receivedData = '';
  }
  _write(chunk,endcoding, callback){
    this.receivedData += chunk.toString("utf-8").replace('#', "@");
    // this.data +=chunk;
    // console.log(chunk, 'single chunk');
    callback();
  }
  _read(size){
    for(let i of this.data){
      this.push(i+"#");
    }
    // equals ws.end();
    this.push(null);
  }
}
let name = 'zhangmingzhi到付款路过还是对方好感';
let ws = new MWS();
let rs = new MRS(name);
let dup = new MDUP(name);

dup.on('data', chunk => {
  let r = dup.write(chunk);
  console.log('dup drained!! >> ', r);
})
dup.on('end', () => {
  console.log('dup ended!');
  dup.end();
})


dup.on('drain', (i) => {
  console.log(i, `is drained my balls!!`);
})
dup.on('end', () => {
  console.log(`dup end!! data>>>`, dup.data.toString('UTF-8'));
})
dup.on('close', () => {
  console.log(`dup close!!`, dup.data.toString('UTF-8'));
})
dup.on('finish', () => {
  console.log(`dup finished!! receivedData>>>`,  dup.receivedData.toString('UTF-8'));
})

