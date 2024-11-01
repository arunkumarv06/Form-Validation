// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Your web app's Firebase configuration
const appSetting = {
    databaseURL: "https://js-crud-b301e-default-rtdb.firebaseio.com",
    projectId: "js-crud-b301e"
};

const app = initializeApp(appSetting);
const database = getDatabase(app);
const usersListInDB = ref(database, "USERS");

const idEl = document.querySelector("#id");
const nameEl = document.querySelector("#name");
const ageEl = document.querySelector("#age");
const cityEl = document.querySelector("#city");
const frm = document.querySelector("#frm");
const tblBodyEl = document.querySelector("#tblBody");

frm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim()) {
        alert("Please fill all Details");
        return;
    }
    if (idEl.value) {
        // update record

        set(ref(database, "USERS/" + idEl.value), {
            name: nameEl.value.trim(),
            age: ageEl.value.trim(),
            city: cityEl.value.trim(),
        })
        
        return;
    }
    if (!nameEl.value.trim() || !ageEl.value.trim() || !cityEl.value.trim()) {
        alert("Please fill all Details");
        return;
    }
    // insert
    const newUser = {
        name: nameEl.value.trim(),
        age: ageEl.value.trim(),
        city: cityEl.value.trim(),
    };

    push(usersListInDB, newUser);
    clearElements();
});

function clearElements() {
    nameEl.value = "";
    ageEl.value = "";
    cityEl.value = "";
}

onValue(usersListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let userArray = Object.entries(snapshot.val());
        // console.log(userArray);
        tblBodyEl.innerHTML = "";
        for (let i = 0; i < userArray.length; i++) {
            let currentUser = userArray[i];
            // console.log(currentUser);
            let currentUserID = currentUser[0];
            let currentUserValue = currentUser[1];

            tblBodyEl.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${currentUserValue.name}</td>
                <td>${currentUserValue.age}</td>
                <td>${currentUserValue.city}</td>
                <td>
                    <button class="btn-edit" data-id="${currentUserID}">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                </td>
                <td>
                    <button class="btn-delete" data-id="${currentUserID}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>`
        }
    } else {
        tblBodyEl.innerHTML = "<tr><td colspan='6'>No records found</td></tr>"
    }
})

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("btn-edit")) {
        const id = e.target.dataset.id;
        let data = ref(database, `USERS/${id}`);

        let idElements = e.target.closest("tr").children;
        idEl.value = id
        nameEl.value = idElements[1].innerText;
        ageEl.value = idElements[2].innerText;
        cityEl.value = idElements[3].innerText;
    } else if (e.target.classList.contains("btn-delete")) {
        if (confirm("delete")) {
            const id = e.target.dataset.id;
            let data = ref(database, `USERS/${id}`)
            remove(data)
            console.log("delete", id)
        }
    }
})
