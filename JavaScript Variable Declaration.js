let fullName = "John Doe"; //let is more appropriate here because we reassign fullName later to Jane Doe. If we used const, it would throw an error because the variable is being reassigned.
fullName = "Jane Doe";
console.log(fullName);


const age = 30; //const is more appropriate here than let because age does not change. If we used let instead it would still run but could allow for accidental reassignment which could be less safe.
if (age > 18) {
const adult = true; //const is more appropriate here than let because adult does not change. If we used let instead it would still run but could allow for accidental reassignment which could be less safe.
console.log(adult);
}

const loopArray = []; //const is more appropriate here than let because const allows mutations but doesn't allow reassignments. If we used let it could allow for accidental reassignment of loopArray. Using const here is safer by ensuring that loopArray always refers to the same array.
for ( let i = 0; i < 5; i++) {
loopArray.push(i);
} // Using let for the loop counter i is appropriate here instead of const because i is reassigned in each iteration of the loop. If we used const it would throw an error.
console.log(loopArray);

let MAXIMUM = 100; //let is more appropriate here than const because we reassign MAXIMUM to 200. If we used const, it would throw an error because the variable is being reassigned.
MAXIMUM = 200;

let colors = ["Red", "Green", "Blue"]; //let is more appropriate here than const because we reassign the array instead of mutating it. If we used const, it would throw an error when we try to reassign the array.
colors = ["Yellow", "Pink", "Purple"];
console.log(colors);