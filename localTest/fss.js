var fs = require("fs");
var buf = new Buffer(1024);

// fs.open('‪C:/Users/zmz/Desktop/particle.txt', 'r+', function(err, fd) {
//    if (err) {
//        return console.error(err);
//    }
//    console.log("文件打开成功！");
//    console.log("截取10字节后的文件内容。");
   
//    // 截取文件
//    fs.ftruncate(fd, 10, function(err){
//       if (err){
//          console.log(err);
//       } 
//       console.log("文件截取成功。");
//       console.log("读取相同的文件"); 
//       fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
//          if (err){
//             console.log(err);
//          }

//          // 仅输出读取的字节
//          if(bytes > 0){
//             console.log(buf.slice(0, bytes).toString());
//          }

//          // 关闭文件
//          fs.close(fd, function(err){
//             if (err){
//                console.log(err);
//             } 
//             console.log("文件关闭成功！");
//          });
//       });
//    });
// });
fs.readFile('C:/Users/zmz/Desktop/particle.txt', (err, data) => {
   // console.log(data.toString());
})
var rawUrl = `C:\Users\zmz\Desktop\PIC\\2015年暑假成都`;
var url = rawUrl.replace(/\\{1,}/g,"/")
var desktop = 'C:/Users/zmz/Desktop';
function proStat(src, filename){
   return new Promise((resolve, reject) => {
      fs.stat(src, (err, info) => {
         resolve({
            name: filename,
            readtime: new Date().valueOf(),
            size: info.size,
            isFile: info.isFile(),
            isDir: info.isDirectory()
         })
      })
   })
}
async function stats(data){
   var startTime = new Date().valueOf();
   var list1 = [];
   var list = []
   for(let s = 0; s < data.length; s++){
      let src = `${desktop}/${data[s]}`
      let r = await proStat(src, data[s])
      list.push(r);
   }
   // data.forEach( item => {
   //    let src = `${desktop}/${item}`
   //    let r = await proStat(src, item)
   //    list.push(r);
   // })
   // for(let j = 0; j < list.length; j++){
   //    let r = await list[j];
   //    list1.push(r);
   // }
   var endTime = new Date().valueOf();
   return {
      list: list,
      costTime: endTime - startTime
   }
}
fs.readdir(desktop, (err, data) => {
   stats(data).then( val => {
      var list = val.list;
      var costTime = val.costTime;
      console.log(list)
      console.log(costTime)
   }).catch(val => {
      console.log(val.toString())
   })
})
// fs.stat(`${desktop}/particle.txt`, (err, info) => {
//    console.log(info);
//    console.log(new Date().valueOf())
// })

// async function hehe(){
//    var a = [1,2,3,4,5];
//    // return await new Promise( (resolve, reject) => {
//    //    resolve(a+"@")
//    // })
//    var b = [];
//    // for(let s = 0; s<a.length; s++){
//    //    var r = await new Promise( (resolve, reject) => {
//    //       resolve(a[s]+"@")
//    //    })
//    //    b.push(r);
//    // }
//    // return b;
//    a.forEach( item => {
//       var r = await new Promise( (resolve, reject) => {
//          resolve(item+"@")
//       })
//       return b.push(r);
//    })
//    return b;
   
// }
// hehe().then(val => { console.log(val)})
// var me = Buffer.from("张明之");
// console.log(me.toString("hex"))
// console.log(me.toString("base64"))
// console.log(me.toString("utf8"))

// var aaa = [1,2,3,4,5];
// for(let s of aaa.values()){
//    console.log(s)
// }
for (let [index, value] of [1,2].entries()) {
  console.log(index, value);
}
console.log(__filename.replace(/\\/g,"/"))
console.log(require.main)