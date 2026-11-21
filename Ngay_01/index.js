console.log("He thong da san sang! Bat dau hanh trinh Fullstack");
const device =[
    { name: "Router-Core", ip: "10.0.0.1", pingMS:2 },
    { name: "Switch-Tang1", ip: "10.0.0.2", pingMS: 15 },
    { name: "Switch-Tang2", ip: "10.0.0.3", pingMS: 120 },
    {name: "AP-PhongHop", ip: "10.0.0.4", pingMS: 250 }
]
const svr = device.filter((dev) => dev.pingMS > 100);

const message = svr.map((dev) => `Mạng chậm tại ${dev.name} - IP${dev.ip} (${dev.pingMS}ms)`);

console.log(message);