export function generateDistinctRandomInt(quantity, max){
  const set = new Set()
  while(set.size < quantity) {
    set.add(Math.floor(Math.random() * (max+1)))
  }
  let a = [];

  let fun = function (val1) {
        a.push(val1);
  };
  set.forEach(fun);
  return a
}