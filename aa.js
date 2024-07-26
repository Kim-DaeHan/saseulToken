// async function example() {
//   // 비동기 작업이 완료될 때까지 기다림
//   someAsyncFunction().then((r) => {
//     console.log("aaaa111111");
//   });

//   // 이 부분은 someAsyncFunction이 완료된 후에 실행됨
//   console.log("After await");
// }

// // example 함수 호출
// example();

// async function someAsyncFunction() {
//   console.log("aaaaa");
// }

function test(obj) {
  obj.aaa = "aaa";
}

let item = { fff: "type" };
console.log(item);
test(item);

console.log(item);

function test2(str11) {
  console.log(str11);
  str11 = "bbb";
  console.log(str11);
}

let str22 = "aaa";
test2(str22);
console.log(str22);
