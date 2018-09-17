const readline = require('readline');// using readline
const fs = require('fs');
// using fs
const rl = readline.createInterface({
  input: fs.createReadStream('./input/Crimes_-_2001_to_present.csv'), // Read CSV file.
});
const rob = new Array(16);
const burg = new Array(16);
const v = [];
rob.fill(0);
burg.fill(0);
const vehicle = new Array(16);// array of counters for given time frame 2001-2016
const property = new Array(16);
const statesup = new Array(16);
vehicle.fill(0);
property.fill(0);
statesup.fill(0);
const hasvehicle = /TO PROPERTY/;
const hasprop = /TO VEHICLE/;
const hasstate = /TO STATE SUP PROP/;
const has = /CRIMINAL DAMAGE/;
const v2 = [];
const mySet = new Set();
const myMap = new Map();
const hasrobbery1 = /ROBBERY/;

rl.on('line', (line) => {
  let s;
  let index;
  if (line.search('ROBBERY') !== -1) {
    s = line.split(',');

    for (let i = 0; i < s.length; i += 1) {
      if (Number(s[i]) > 2000 && Number(s[i]) < 2017) {
        index = Number(s[i]);
        break;
      }
    }
    index -= 2001;
    rob[index] += 1;
  }
  if (line.search('BURGLARY') !== -1) {
    s = line.split(',');

    for (let i = 0; i < s.length; i += 1) {
      if (Number(s[i]) > 2000 && Number(s[i]) < 2017) {
        index = Number(s[i]);
        break;
      }
    }
    index -= 2001;
    burg[index] += 1;
  }


  let index1;
  let x;
  if (has.test(line)) {
    if (hasvehicle.test(line)) {
      x = line.split(',');
      for (let i = 0; i < x.length; i += 1) {
        if (Number(x[i]) > 2000 && Number(x[i]) < 2017) {
          index1 = Number(x[i]);
          break;
        }
      }
      vehicle[index1 - 2001] += 1;// (index1-2001) as index1 0 refers to the year 2001
    }
    if (hasstate.test(line)) {
      x = line.split(',');
      for (let i = 0; i < x.length; i += 1) {
        if (Number(x[i]) > 2000 && Number(x[i]) < 2017) {
          index1 = Number(x[i]);
          break;
        }
      }
      statesup[index1 - 2001] += 1;
    }
    if (hasprop.test(line)) {
      x = line.split(',');
      for (let i = 0; i < x.length; i += 1) {
        if (Number(x[i]) > 2000 && Number(x[i]) < 2017) {
          index1 = Number(x[i]);
          break;
        }
      }
      property[index1 - 2001] += 1;
    }
  }

  if (hasrobbery1.test(line)) {
    x = line.split(',');
    let index2 = x.indexOf('ROBBERY');
    index2 += 1;
    const previousSize = mySet.size;
    mySet.add(x[index2]);
    const afterSize = mySet.size;
    if (previousSize < afterSize) {
      myMap.set(x[index2], 1);
    } else {
      const currentSize = myMap.get(x[index2]);
      myMap.set(x[index2], currentSize + 1);
    }
  }
});
rl.on('close', () => {
  for (let i = 0; i < burg.length; i += 1) {
    const obj = {
      YEAR: '',
      ROBBERY: 0,
      BURGLARY: 0,
    };
    const year = 2000 + i + 1;
    obj.YEAR = year;
    obj.BURGLARY = burg[i];
    obj.ROBBERY = rob[i];
    v.push(obj);
  }


  const v1 = [];
  for (let i = 0; i < vehicle.length; i += 1) {
    const type = {
      Year: '',
      Property: '',
      Vehicle: '',
      State: '',
    };
    type.Year = i + 2001;
    type.Property = property[i];
    type.State = statesup[i];
    type.Vehicle = vehicle[i];
    v1.push(type);
  }

  const iterator1 = myMap[Symbol.iterator]();
  for (const item of iterator1) {
    const prop = {};
    prop.Type = item[0];
    prop.Count = item[1];
    v2.push(prop);
  }

  console.log(v);
  const myJSON1 = JSON.stringify(v); // JSON creation

  fs.writeFile('./json/output1.json', myJSON1, 'utf8', () => {
  });

  console.log('JSON1 file has been saved.');
  console.log(v1);
  const myJSON2 = JSON.stringify(v); // JSON creation

  fs.writeFile('./json/output2.json', myJSON2, 'utf8', () => {
  });
  console.log('JSON2 file has been saved.');

  console.log(v2);
  const myJSON3 = JSON.stringify(v2); // JSON creation

  fs.writeFile('./json/output3.json', myJSON3, 'utf8', () => {
  });
  console.log('JSON3 file has been saved.');
});
