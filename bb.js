function test() {
  for (let i = 0; i < 5; i++) {
    console.log(i);
    for (let j = 0; j < 5; j++) {
      console.log(i, j);
      if (j == 1) {
        continue;
      }
      console.log("aaa");
    }
  }
}

// test();

function tt() {
  console.log("aaa");
  function cc() {
    console.log("bbb");
  }
  cc();
}

// tt();

async function dd(i) {
  return i + 1;
}

async function mm() {
  const methodArray = [];
  for (let i = 0; i < 5; i++) {
    methodArray.push(() => dd(i));
  }
  console.log(methodArray);

  const test = await Promise.all(methodArray.map((func) => func()));

  console.log(test);
}

// mm();

try {
  var foo = "inside try";
  console.log(foo); // 'inside try'
} catch (error) {
  console.error(error);
}

console.log(foo); // 'inside try'
