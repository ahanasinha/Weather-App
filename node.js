const http=require('http');
var requests=require('requests');
const fs=require('fs');
const home=fs.readFileSync('index.html','utf-8');
function tocelsius(kel){
    return (kel-273.15).toFixed(2);
}
const replaceVal=(tempval,orgval)=>{
    let temp=tempval.replace("{%temp%}",tocelsius(orgval.main.temp));
    temp=temp.replace("{%mintemp%}",tocelsius(orgval.main.temp_min));
    temp=temp.replace("{%maxtemp%}",tocelsius(orgval.main.temp_max));
    temp=temp.replace("{%city%}",orgval.name);
    temp=temp.replace("{%country%}",orgval.sys.country);
    temp=temp.replace("{%tempstat%}",orgval.weather[0].main);
    return temp;
}
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=814ef4e7ccbb3f389dfade95c90f4ebd')
        .on('data', (chunk)=>{
            const objdata=JSON.parse(chunk);
            const arrdata=[objdata];
            const display=arrdata.map((val)=>replaceVal(home,val)).join("");
            res.write(display);
        })
        .on('end', (err)=> {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
            console.log('end');
        });
    }
});
server.listen(8000);