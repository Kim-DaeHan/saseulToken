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

tt();
