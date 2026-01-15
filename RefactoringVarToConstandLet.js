function checkAccess(loggedIn) {
    let accessLevel; //let is more appropriate here than const because accessLevel is reassigned based on conditions. If we used const, it would throw an error because the variable is being reassigned.
    const userRole; //const is more appropriate here than let because userRole does not change. If we used let instead it would still run but could allow for accidental reassignment which could be less safe.
    if (loggedIn) {
        const message = "User is logged in."; //const is more appropriate here than let because message does not change. If we used let instead it would still run but could allow for accidental reassignment which could be less safe.
        console.log(message);
        if (userRole === "admin") {
            accessLevel = "full";
        } else {
            accessLevel = "limited";
        }
    } else {
        const message = "User not logged in."; //const is more appropriate here than let because message does not change. If we used let instead it would still run but could allow for accidental reassignment which could be less safe.
        console.log(message);
        accessLevel = "none";
    }
    return accessLevel;
}

for (let i = 0; i < 3; i++) { // Using let for the loop counter i is appropriate here instead of const because i is reassigned in each iteration of the loop. If we used const it would throw an error.
    console.log("Attempt", i);
    let loggedIn = Math.random() >= 0.5; //let is more appropriate here than const because loggedIn is reassigned in each iteration of the loop. If we used const, it would throw an error because the variable is being reassigned.
    checkAccess(loggedIn);
    console.log("Access Level:", checkAccess(loggedIn));
}