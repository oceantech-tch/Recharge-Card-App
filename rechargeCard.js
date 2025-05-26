const chooseNetwork = document.getElementById("choose-network");
const selectAmount = document.getElementById("select-amount");
const generatePin = document.getElementById("generate-pin");
const generateBtn = document.getElementById("generateBtn");
const tableBody = document.getElementById("table-body");
const rechargeInput = document.getElementById("recharge-input");
let currentDate = new Date();
currentDate = currentDate.toLocaleString();
let selectedCardDetails = JSON.parse(localStorage.getItem("table-body")) || [];

chooseNetwork.addEventListener("change", disableButton);
selectAmount.addEventListener("change", disableButton);
function disableButton() {
    const choosedNetwork = chooseNetwork.value;
    const choosedAmount = selectAmount.value;
    if (choosedNetwork === "" || choosedAmount === "") {
        generateBtn.classList.add("disableGenBtn");
        generateBtn.classList.remove("enableGenBtn", "btn");
        generateBtn.setAttribute("disabled", "disabled");
    } else {
        generateBtn.classList.remove("disableGenBtn");
        generateBtn.classList.add("enableGenBtn", "btn");
        generateBtn.removeAttribute("disabled");
    }
    return;
}
disableButton();

const addToLocal = () => {
    
}


// check if the array in localstorage has been modified or not. if so, we set a conditon (default desc), otherwise we refresh the tablebody and then fetch the modified array elements to display them inside tablebody.
const generate = () => {
    const choosedNetwork = chooseNetwork.value;
    const choosedAmount = selectAmount.value;
    const generatedPin = Math.floor(Math.random() * 900990000 * 5000000);
    const isUsed = true;
    const printRef = (generatePin.value = `*333*${generatedPin}#`);

    selectedCardDetails.push({
        network: choosedNetwork,
        date: currentDate,
        amount: choosedAmount,
        pin: generatedPin,
        ref: printRef,
        status: isUsed,
    });
    renderTableAndDeleteButton();
    chooseNetwork.value = "";
    selectAmount.value = "";
    generatePin.value = "";
    disableButton();
    // localStorage.setItem("table-body", JSON.stringify(selectedCardDetails));

};
//  check if the array in localstorage has been modified or not. if so, we set a conditon (default desc), otherwise we refresh the tablebody and then fetch the modified array elements to display them inside tablebody

const renderTableAndDeleteButton = () => {
    tableBody.innerHTML = "";

    // selectedCardDetails = JSON.parse(localStorage.getItem("table-body")) || [];
    // if (selectedCardDetails.length === 0) {
    //     tableBody.innerHTML = 'No history found'
    //     return;
    // }

    selectedCardDetails.forEach((el, index) => {
        tableBody.innerHTML += `
            <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${el.network}</td>
                <td>${el.date}</td>
                <td><strong style='color: #444;'>NGN</strong>${el.amount}</td>
                <td>${el.pin}</td>
                <td>${el.ref}</td>
                <td>${el.status ? "Unused" : "Used"}</td>
                <td><button style='background-color: #e70b0b; color: #fff; margin: auto' class='delete-btn' data-index='${index}'>Delete</button></td>
            </tr>
        `;
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const delIndex = parseInt(this.getAttribute('data-index'));
            selectedCardDetails.splice(delIndex, 1);
            renderTableAndDeleteButton();
        });
        btn.addEventListener('mouseover', function () {
            this.style.backgroundColor = '#b41a1a'
        });
        btn.addEventListener('mouseout', function () {
            this.style.backgroundColor = '#e70b0b'
        });
    });
}
renderTableAndDeleteButton();

const rechargeBtn = document.getElementById("rechargeBtn");
const purchasedCardPin = selectedCardDetails;
const recharge = () => {
    const rechargeInputVal = rechargeInput.value;
    if (rechargeInputVal === "" || rechargeInputVal.length < 15) {
        rechargeBtn.setAttribute("disabled", "disabled");
        rechargeBtn.classList.add("disableGenBtn");
    } else {
        rechargeBtn.removeAttribute("disabled", "disabled");
        rechargeBtn.classList.remove("disableGenBtn");
        rechargeBtn.classList.add('btn');
    }
};
recharge();

rechargeInput.addEventListener("input", recharge);
rechargeBtn.addEventListener("click", () => {
    const rechargeInputVal = rechargeInput.value;
    const validatePin = purchasedCardPin.filter((el) =>
        el.ref.toString().includes(rechargeInputVal)
    );
    if (validatePin.length > 0 && validatePin.every(el => el.status === false)) {
        showAlert('Sorry, this card has already been used!');
    } else if (validatePin.length > 0) {
        purchasedCardPin.forEach((el) => {
            if (el.ref.toString().includes(rechargeInputVal)) {
                el.status = false;
            }
        });
        showAlert('Recharge Successful!');
        tableBody.innerHTML = "";
        purchasedCardPin.forEach((el, index) => {
            tableBody.innerHTML += `
                <tr>
                <td><strong>${index + 1}</strong></td>
                <td>${el.network}</td>
                <td>${el.date}</td>
                <td><strong style='color: #444;'>NGN</strong>${el.amount}</td>
                <td>${el.pin}</td>
                <td>${el.ref}</td>
                <td>${el.status ? "Unused" : "Used"}</td>
                <td><button style='background-color: #f00; color: #fff; margin: auto' class='delete-btn' data-index='${index}'>Delete</button></td>
                </tr>
                `
            });
    } else {
        document.getElementById('alertMessage').style.color = '#f00';
        showAlert('Invalid pin🛑');
    }
    rechargeInput.value = '';
    recharge();
    rechargeBtn.classList.remove('btn');
    renderTableAndDeleteButton();
});

const showAlert = (message) => {
    const alertMessage = document.getElementById('alertMessage');
    const overlay = document.getElementById('overlay');
    alertMessage.textContent = message;
    overlay.style.display = 'block';
}

const closeAlert = () => {
    const overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
}
document.getElementById('closeButton').addEventListener('click', closeAlert);

// console.log(currentDate);
// console.log(currentDate.getFullYear());
// console.log(currentDate.getMonth() + 1);
// console.log(currentDate.getDate());
// console.log(currentDate.toLocaleString());
