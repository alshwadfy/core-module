//1
const path = require("node:path")
const fsA = require("node:fs/promises")
const fs = require("node:fs")
const EventEmitter = require("node:events");
const os = require("node:os");
const stream = require("node:stream");
const zlib = require("node:zlib");


let pathName = "D:/std/Node JS/session 1/index.js"
let pathObject = {
    dir:"/folder",
    name:"app",
    ext: ".js"
}
let relativePath = "../index.js"




function logFile(){
    return [__dirname,__filename]

}
console.log(logFile())



//2

function getFileName(pathName){

return path.basename(pathName)

}
console.log(getFileName(pathName));



//3
function buildPath(pathObject){
return path.posix.format(pathObject)
}
console.log(buildPath(pathObject));


//4

function getExtention(file){
    return path.extname(file)

}
console.log(getExtention(pathName))


//5
function getNameAndExtention(file){

        return [`Name : ${path.parse(file).name}`,`extention : ${path.extname(file)}`]

}
console.log(getNameAndExtention(pathName));

//6

function isAbsolute(file){

    return path.isAbsolute(file)
}

//7

function pathJoin(...pathName){
return path.join(...pathName)

}
console.log(pathJoin("src", "components", "App.js"));


//8
function pathResolve(filepath){
    return path.resolve(filepath)

}
console.log(pathResolve(relativePath));

//9

function join2Paths(path1,path2){
    return path.join(path1,path2)
}

//10
async function deletFile(name){
    try {
         await fs.rm(name)
        
    } catch (error) {
        console.error("error deleting file");
        
    }
}

//11
 function createFile(filepath){

    try{
    fs.mkdirSync(filepath)
    console.log("success");
    
    }
    catch(error){
    console.error("error");
    }

}

//12
const emitter = new EventEmitter()
emitter.on("start",()=>{
    console.log("welcome even emitter");
    
})

//13
emitter.on("login",(username)=>{
    console.log(`User logged in ${username}`);
    
})
//14

function readfile(filepath) {
    const content= fs.readFileSync(filepath, "utf-8")
    console.log(`file content : ${content}`);

    
}
//15
async function WriteileAsync(filePath, content){
    try {
        await fs.promises.writeFile(filePath,content,"utf-8")
            console.log("File written asynchronously.");
        
    } catch (error) {
        console.error("error happend",error.message);
        
        
    }


}
//16

function checkDir(filePath){
    return fs.existsSync(filePath)

}

//17
function name(params) {
    return [`platform:${os.platform} ,Arch ${os.arch}`]
    
}

//18
function readFileInChunks(filePath) {
  const readStream = fs.createReadStream(filePath, { encoding: "utf8" });
  readStream.on("data", (chunk) => {
    console.log("Chunk:", chunk);
  });
  readStream.on("end", () => {
    console.log("Finished reading file.");
  });
  readStream.on("error", (err) => {
    console.error("Read stream error:", err.message);
  });
}

//19
function pipeReadWrite(destpath,srcpath){
    const readStream =fs.createReadStream(srcpath)
    const writeStream =fs.createWriteStream(destpath)

    readStream.on("error",(err)=>{console.error(err.message)});
    writeStream.on("error",(err)=>{console.error(err.message)});
    writeStream.on("finish",()=>{console.log("DONE !")})

    readStream.pipe(writeStream)
}

//20

function compressFile(srcPath, destPath) {
  pipeline(
    fs.createReadStream(srcPath),
    zlib.createGzip(),
    fs.createWriteStream(destPath),
    (err) => {
      if (err) {
        console.error("Compression pipeline failed:", err.message);
      } else {
        console.log("File compressed successfully.");
      }
    }
  );
}

//part 2
