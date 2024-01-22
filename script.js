"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-01-17T17:01:17.194Z",
    "2024-01-19T23:36:17.929Z",
    "2024-01-21T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

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

// FUNCTIONS //

// -- FUNCTION to calculate movement times, cleaning code by adding it into a function instead of scope of displayMovements function --//
// Receives a date as an input and formats the given date
const formatMovementDate = function (date, locale) {
  // Takes in two dates on calcDatePassed function
  const calcDatePassed = (date1, date2) =>
    // Doing the maths on the 2 dates when they get passed
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  // Passing the two dates two the calcDatePassed function to begin doing the math
  // Sending current date as date1 and movementsDate as date2
  const daysPassed = calcDatePassed(new Date(), date);
  // Based on calDatePassed calculation, if it's 0, log 'Today'
  if (daysPassed === 0) return "Today";
  // Based on calDatePassed calculation, if it's 1, log 'Yesterday'
  if (daysPassed === 1) return "Yesterday";
  // Based on calDatePassed calculation, less than or equal to 7 (within the week)
  // log how many days and string 'Days Ago'
  if (daysPassed <= 7) return `${daysPassed} Days Ago`;
  // If non of the above are true, log the full date
  else {
    // Old Setup //
    //const day = `${date.getDate()}`.padStart(2, 0);
    //const month = `${date.getMonth() + 1}`.padStart(2, 0);
    //const year = date.getFullYear();
    //return `${day}/${month}/${year}`;
    // New Setup //

    return new Intl.DateTimeFormat(locale).format(date); // We don't need to pass ooptions here, because it's default return is fine without hours/min
  }
};

// -- FUNCTION to format all numbers and currencies --//

// This function takes a numeric value, locale, and currency as parameters
// and returns a formatted string representing the numeric value in the specified currency format.
const formatCur = function (value, locale, currency) {
  // Create a new Intl.NumberFormat object with the specified locale and currency options
  const numberFormatter = new Intl.NumberFormat(locale, {
    style: "currency", // Format as currency
    currency: currency, // Use the provided currency
  });

  // Format the numeric value using the numberFormatter
  const formattedValue = numberFormatter.format(value);

  // Return the formatted string
  return formattedValue;

  // Example usage:
  // const formattedAmount = formatCur(12345.67, 'en-US', 'USD');
  // The 'formattedAmount' will contain the value formatted as currency (e.g., $12,345.67) based on the specified locale and currency.
};

// -- FUNCTION to display movements in the UI -- //
// Added sort = false, new sort functionality to order movements, but by default, it should be off (false)
const displayMovements = function (acc, sort = false) {
  // Clear the existing content of the movements container
  containerMovements.innerHTML = "";

  // Create a copy of movements and sort it if 'sort' is true; otherwise, use the original movements
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // Iterate through each movement in the provided array
  movs.forEach(function (mov, i) {
    // Determine the type of movement (deposit or withdrawal)
    const type = mov > 0 ? "deposit" : "withdrawal";
    // While looping through each movement and having index place, use same index to loop MovementDate (another array) and create new date
    const date = new Date(acc.movementsDates[i]);
    // displayDate which goes into the HTML is calling the format function creating the formatted date then inserting to HTML
    const displayDate = formatMovementDate(date, acc.locale);

    // The following code uses the Internationalization API to format the movement value as currency
    // based on the account's locale. This ensures that the currency symbol, formatting, and precision
    // adhere to the user's preferred formatting rules.

    // Create a new Intl.NumberFormat object with the specified locale and formatting options
    // New //
    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    // Old //
    //const formattedMov = new Intl.NumberFormat(acc.locale, {
    //  style: "currency", // Format as currency
    //  currency: acc.currency, // Use USD as the currency
    //}).format(mov);

    // The resulting 'formattedMov' will contain the movement value formatted as currency
    // according to the user's preferred locale and currency symbol.

    // Create HTML structure for each movement
    const html = `<div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class ="movements__date">${displayDate}</div>
            <div class="movements__value">${formattedMov}</div>
        </div>`;

    // Insert the HTML at the beginning of the movements container
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// -- FUNCTION to calculate and display the account balance -- //
const calcDisplayBalance = function (acc) {
  // Calculate the total balance by summing up all movements
  const balance = acc.movements.reduce((accum, mov) => accum + mov, 0);
  // Update the account's balance property
  acc.balance = balance;
  // Display the balance in the UI
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

// -- FUNCTION to calculate and display summary information (incomes, outflows, interest) -- //
const calcDisplaySummary = function (acc) {
  // Calculate total incomes by summing up positive movements
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((previous, next) => previous + next, 0);
  // Display total incomes in the UI
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  // Calculate total outflows by summing up negative movements
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((previous, next) => previous + next, 0);
  // Display total outflows in the UI (absolute value)
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  // Calculate and display total interest earned on deposits
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((previous, next) => previous + next, 0);
  // Display total interest in the UI
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// -- FUNCTION to create a username for each account based on the owner's name -- //
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

// -- FUNCTION Screen re loader -- //

const updateUI = function (acc) {
  // Display Movement
  displayMovements(acc);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

// EVENT HANDLERS //
let currentAccount;

// TEMP CODE -- FAKE ALWAYS LOGGED IN (WHILST DEVELOPING TO STOP HAVING TO LOGIN AFTER REFRESH) //
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// -- Login Event Handler -- //
btnLogin.addEventListener("click", (e) => {
  // Prevent form from submitting
  e.preventDefault();
  // Find the account with the entered username
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  // Check if the entered PIN matches the found account's PIN
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Welcome Message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    // If correct, put opacity from 0 to 100
    containerApp.style.opacity = 100;

    // Create Current date
    const now = new Date();

    // Options for formatting the date and time
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      //weekday: "long",
    };

    // Get the user's preferred language from the browser
    const locale = navigator.language;

    // Format the current date according to the specified options and locale
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input field (This happens after all the code is executed in IF statement)
    inputLoginUsername.value = inputLoginPin.value = "";
    // Remove focus from input fields
    inputLoginPin.blur();
    // Call re loader on page
    updateUI(currentAccount);
  }
});

// -- Transfer Event Handler -- //
btnTransfer.addEventListener("click", function (e) {
  // Remove auto refresh on submission
  e.preventDefault();
  // Save Transfer Amount Into a Variable
  const amount = +inputTransferAmount.value;
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
    // Executing the transfer (sender and receiver)
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);
    // Sending a date for movementsDate on transfer for sender and receiver
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());
    // Call re loader on page
    updateUI(currentAccount);
  }
});

// -- Request Loan Event Handler -- //
btnLoan.addEventListener("click", (e) => {
  // Stopped reload on form submission (button click)
  e.preventDefault();
  // Store the input loan amount in the variable
  const amount = Math.floor(inputLoanAmount.value);
  // Checking if input is positive and the account has atleast 1 deposit
  // more than or equal to 10% of the loan requested
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // Add movement for accepted loan request
    currentAccount.movements.push(amount);
    // Add loan request date as current time on request
    currentAccount.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

// -- Close Account Event Handler -- //
btnClose.addEventListener("click", (e) => {
  // Prevent auto refresh on clicks
  e.preventDefault();
  // Checking conditions are valid to create close. User and Pin match close inputs data.
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
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

// -- Sort Transactions Event Handler -- //

// Initialize a variable to keep track of whether transactions are sorted or not
let sorted = false;

// Add a click event listener to the "Sort" button
btnSort.addEventListener("click", (e) => {
  // Prevent the default behavior of the button, which is to refresh the page
  e.preventDefault();

  // Call the function to display movements (transactions) with the current sorting status
  // If 'sorted' is false, it sorts in ascending order; if true, it sorts in descending order
  displayMovements(currentAccount, !sorted);

  // Toggle the value of 'sorted' for the next click
  sorted = !sorted;
});
