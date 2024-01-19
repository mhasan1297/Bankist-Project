"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Function to display movements in the UI
const displayMovements = function (movements) {
  // Clear the existing content of the movements container
  containerMovements.innerHTML = "";

  // Iterate through each movement in the provided array
  movements.forEach(function (mov, i) {
    // Determine the type of movement (deposit or withdrawal)
    const type = mov > 0 ? "deposit" : "withdrawal";

    // Create HTML structure for each movement
    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__value">${mov}€</div>
        </div>`;

    // Insert the HTML at the beginning of the movements container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Function to calculate and display the account balance
const calcDisplayBalance = function (acc) {
  // Calculate the total balance by summing up all movements
  const balance = acc.movements.reduce((accum, mov) => accum + mov, 0);
  // Update the account's balance property
  acc.balance = balance;
  // Display the balance in the UI
  labelBalance.textContent = `${balance}€`;
};

// Function to calculate and display summary information (incomes, outflows, interest)
const calcDisplaySummary = function (acc) {
  // Calculate total incomes by summing up positive movements
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((previous, next) => previous + next, 0);
  // Display total incomes in the UI
  labelSumIn.textContent = `${incomes}€`;

  // Calculate total outflows by summing up negative movements
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((previous, next) => previous + next, 0);
  // Display total outflows in the UI (absolute value)
  labelSumOut.textContent = `${Math.abs(out)}€`;

  // Calculate and display total interest earned on deposits
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((previous, next) => previous + next, 0);
  // Display total interest in the UI
  labelSumInterest.textContent = `${interest}€`;
};

// Function to create a username for each account based on the owner's name
const createUsername = function (accs) {
  accs.map(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((name) => name[0])
        .join(""))
  );
};
// Call the createUsername function to generate usernames for each account
createUsername(accounts);

// Screen re loader

const updateUI = function (acc) {
  // Display Movement
  displayMovements(acc.movements);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

// Event Handlers
let currentAccount;

// Login Event Handler
btnLogin.addEventListener("click", (e) => {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input field (This happens after all the code is executed in IF statement)
    inputLoginUsername.value = inputLoginPin.value = "";
    // Remove focus from input fields
    inputLoginPin.blur();
    // Call re loader on page
    updateUI(currentAccount);
  }
});

// Transfer Event Handler
btnTransfer.addEventListener("click", function (e) {
  // Remove auto refresh on submission
  e.preventDefault();
  // Save Transfer Amount Into a Variable
  const amount = Number(inputTransferAmount.value);
  // Save account information of where transfer is going to
  const receiverAccount = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  // Clear input field (This happens after all the code is executed in IF statement)
  inputTransferAmount.value = inputTransferTo.value = "";
  // Check if transfer amount is above 0, balance contains enough or more than transfer amount, receiver account exists (receiver?.)
  // and receiver account is not the same as the current account it's being sent from.
  if (
    amount > 0 &&
    receiverAccount &&
    currentAccount.balance >= amount &&
    receiverAccount.username !== currentAccount.username
  ) {
    // Executing the transfer
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // Call re loader on page
    updateUI(currentAccount);
  }
});

// Close Account Event Handler
btnClose.addEventListener("click", (e) => {
  // Prevent auto refresh on clicks
  e.preventDefault();
  // Checking conditions are valid to create close. User and Pin match close inputs data.
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    // If true, find the index of the selected account and store it in variable Index.
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    console.log(index);
    // Now delete the data from accounts. Start at index number and remove 1 element.
    accounts.splice(index, 1);
    // Hide UI (Essentially login the user out since account is deleted)
    containerApp.style.opacity = 0;
  }
  // Clear input field (This happens after all the code is executed in IF statement)
  inputCloseUsername.value = inputClosePin.value = "";
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
