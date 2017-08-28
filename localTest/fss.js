var fs = require("fs");
var buf = new Buffer(1024);
var path = require("path")

// fukcyou
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
var rawUrl = 'C:\Users\zmz\Desktop\PIC\LG';
var url = 'C:/Users/zmz/Desktop/stuff/PIC/LG';
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
async function stats(parentUrl,data){
   var startTime = new Date().valueOf();
   var list1 = [];
   var list = []
   for(let s = 0; s < data.length; s++){
      let src = `${parentUrl}/${data[s]}`
      let r = await proStat(src, data[s])
      list.push(r);
   }
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
fs.readdir(url, (err, data) => {
   stats(url,data).then( val => {
      var list = val.list;
      var costTime = val.costTime;
      console.log(`${list.length} of photos`)
      console.log(costTime)
   }).catch(val => {
      console.log(val.toString())
   })
})
// var r = fs.symlinkSync("C:/Users/zmz/Desktop/PIC/LG/20140702_171657.jpg", `C:/Users/zmz/Desktop/222.jpg`);
// console.log(r);
// try{
//    var rr = fs.unlinkSync("C:/Users/zmz/Desktop/222.jpg")
//    console.log(rr);
// }catch(e){
//    console.log(e);
// }
var dir = path.relative(path.resolve(__dirname, "../client/src"), "C:/Users/zmz/Desktop/Github/nodeFS/photolist/20140709_062212.jpg");
console.log(dir, "  *******************  ")

// var rrr = fs.linkSync("C:/Users/zmz/Desktop/PIC/LG/20140702_171657.jpg", `C:/Users/zmz/Desktop/222.jpg`);

// console.log(rrr);

