function sum(a,b,c) {
    return a + b + c;
}

const numbers = [0,1,2];
const resultsum = sum(...numbers);
console.log(resultsum); // Outputs: 3


const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const mergedArray = [...array1, ...array2];
console.log(mergedArray); // Outputs: [1, 2, 3, 4, 5, 6]


const colors = ['red', 'green', 'blue'];
const extendedColors = ['yellow', ...colors, 'purple'];
console.log(extendedColors); // Outputs: ['yellow', 'red', 'green', 'blue', 'purple']


const person = { name: 'John', age: 30 };
const newPerson = { ...person, name: 'Jane', gender: 'female' };
console.log(person);    // Outputs: { name: 'John', age: 30 }
console.log(newPerson); // Outputs: { name: 'Jane', age: 30, gender: 'female' }


const object1 = { a: 1, b: 2 };
const object2 = { b: 3, c: 4 }; 
const combinedObject = { ...object1, ...object2 }; //the value of 'b' from object2 will overwrite the value from object1 because it comes later
console.log(combinedObject); // Outputs: { a: 1, b: 3, c: 4 }