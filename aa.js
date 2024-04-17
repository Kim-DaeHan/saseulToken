async function example() {
  // 비동기 작업이 완료될 때까지 기다림
  someAsyncFunction().then((r) => {
    console.log("aaaa111111");
  });

  // 이 부분은 someAsyncFunction이 완료된 후에 실행됨
  console.log("After await");
}

// example 함수 호출
example();

async function someAsyncFunction() {
  console.log("aaaaa");
}
