// Go To Page
const navList = {
    goMaMe: "./",
    goReFo: "./registForm.html",
    goPoCo: "./postalCode.html",
    goDyDrDoLi: "./dynaDropDown.html"
};

for(const [buttonId, targetPage] of Object.entries(navList)) {
    const button = document.getElementById(buttonId);

    if(button) {
        button.addEventListener("click", () => {
            setTimeout(() => {
                window.location.href = targetPage;
            }, 100);
        });
    }
}

// College Student Registration Form
const mtKlSelect = document.getElementById("mataKuliah");
const dosnSelect = document.getElementById("dosenPengajar");

fetch("./registFormData.json")
  .then(res => res.json())
  .then(data => {
    const regform = document.getElementById("regForm");
    const mahasiswaInput = document.getElementById("mahasiswaNim");
    const mataKuliahInput = document.getElementById("mataKuliah");
    const dosnSelect = document.getElementById("dosenPengajar");

    // Alert box
    const alertBox = document.createElement("div");
    const alertMessage = document.createElement("span");
    const alertButton = document.createElement("button");
    
    alertBox.style.cssText = `
      display:none; position:fixed; top:20px; right:20px;
      background:#ffe0e0; color:#900; border:1px solid #900;
      padding:12px 20px; border-radius:5px; z-index:9999;
    `;

    alertButton.textContent = "Oke";
    alertButton.style.marginLeft = "15px";
    alertButton.style.padding = "5px";
    alertButton.style.borderRadius = "5px";
    alertBox.appendChild(alertMessage);
    alertBox.appendChild(alertButton);
    document.body.appendChild(alertBox);

    function showAlert(msg, onConfirm) {
      alertMessage.textContent = msg;
      alertBox.style.display = "block";
      alertButton.onclick = () => {
        alertBox.style.display = "none";
        if (onConfirm) onConfirm();
      };
    }

    // Suggestion function
    function suggestion(input, items, getLabel) {
      input.addEventListener("input", function () {
        const val = input.value.toLowerCase();
        const rect = input.getBoundingClientRect();
        const list = document.createElement("div");

        closeAllLists();

        if (!val) return;

        list.className = "suggestion-items";
        list.style.cssText = `
          position:absolute; top:${rect.bottom + window.scrollY}px;
          left:${rect.left + window.scrollX}px; width:${rect.width}px;
          background:#fff; border:1px solid #d4d4d4; max-height:200px;
          overflow-y:auto; z-index:9999;
        `;

        document.body.appendChild(list);

        items.forEach(item => {
          if (getLabel(item).toLowerCase().includes(val)) {
            const div = document.createElement("div");

            div.textContent = getLabel(item);
            div.style.padding = "8px"; div.style.cursor = "pointer";
            div.addEventListener("mouseenter", () => div.style.backgroundColor = "#e9e9e9");
            div.addEventListener("mouseleave", () => div.style.backgroundColor = "#fff");
            div.addEventListener("click", () => {
              input.value = getLabel(item);

              if(input === mataKuliahInput) updateDosenOptions(item);

              closeAllLists();
            });
            list.appendChild(div);
          }
        });

        function closeAllLists(elmnt) {
          document.querySelectorAll(".suggestion-items").forEach(i => {
            if (i != elmnt) i.remove();
          });
        }
        document.addEventListener("click", e => closeAllLists(e.target));
      });
      input.setAttribute("suggestion","off");
    }
    suggestion(mahasiswaInput, data.mahasiswa, m => `${m.nim} - ${m.nama}`);
    suggestion(mataKuliahInput, data.mataKuliah, c => `${c.kode} - ${c.nama}`);

    // Dosen
    dosnSelect.disabled = true;

    function updateDosenOptions(course){
      dosnSelect.innerHTML = '<option value="">Tidak Ada</option>';

      if(!course) {
        dosnSelect.disabled = true;
        return;
      }

      course.dosen.forEach(d => {
        const opt = document.createElement("option");

        opt.value = opt.textContent = d;
        dosnSelect.appendChild(opt);
      });
      dosnSelect.disabled = false;
    }

    mataKuliahInput.addEventListener("input", () => {
      const val = mataKuliahInput.value.trim().toLowerCase();
      const matched = data.mataKuliah.find(c => `${c.kode} - ${c.nama}`.toLowerCase() === val);

      updateDosenOptions(matched || null);
    });

    // Submit
    regform.addEventListener("submit", e => {
      e.preventDefault();
      const mahasiswaVal = mahasiswaInput.value.trim();
      const mataKuliahVal = mataKuliahInput.value.trim();
      const dosenVal = dosnSelect.value;
      const courseMatch = data.mataKuliah.find(c=>`${c.kode} - ${c.nama}`===mataKuliahVal);

      let errors = [];

      if(!data.mahasiswa.find(m=>`${m.nim} - ${m.nama}` === mahasiswaVal)) errors.push("Mahasiswa");

      if(!courseMatch) errors.push("Mata Kuliah");
      else if(!courseMatch.dosen.includes(dosenVal)) errors.push("Dosen");

      if(errors.length){ 
        showAlert(`Data ${errors.join(", ")} tidak valid.`); 
        return; 
      }

      // Success
      showAlert("Formulir telah dikirimkan.", () => {
        regform.reset()
        dosnSelect.disabled = true;
      });
    });
  })
  .catch(err => console.error(err));

// Indonesia Postal Code
const provSelect = document.getElementById("provinsi");
const kotaSelect = document.getElementById("kotaKab");
const kodePosInput = document.getElementById("wilayahKodePos");
const resultDiv = document.querySelector(".result");

if (provSelect && kotaSelect && kodePosInput && resultDiv) {
  const form = document.getElementById("postalCode");
  const hideButton = resultDiv.querySelector(".button-form");

  hideButton.addEventListener("click", () => {
    resultDiv.style.display = "none";
  });

  resultDiv.style.display = "none";
  kotaSelect.disabled = true;
  kodePosInput.disabled = true;

  fetch("./postalCodeData.json")
    .then(res => res.json())
    .then(data => {
      Object.keys(data).forEach(p => provSelect.appendChild(new Option(p, p)));

      provSelect.addEventListener("change", () => {
        kotaSelect.innerHTML = '<option value="">Tidak Ada</option>';
        kotaSelect.disabled = !provSelect.value;
        kodePosInput.value = '';
        kodePosInput.disabled = true;

        if (!provSelect.value) return;

        Object.keys(data[provSelect.value]).forEach(kota => {
          kotaSelect.appendChild(new Option(kota, kota));
        });
      });

      kotaSelect.addEventListener("change", () => {
        const items = data[provSelect.value][kotaSelect.value];

        kodePosInput.value = "";
        kodePosInput.disabled = !kotaSelect.value;

        if (!kotaSelect.value) return;

        setupsuggestion(kodePosInput, items);
      });

      function setupsuggestion(input, items) {
        input.addEventListener("input", () => {
          const val = input.value.trim().toLowerCase();
          const rect = input.getBoundingClientRect();
          const list = document.createElement("div");
          const isNumber = /^\d+$/.test(val);

          document.querySelectorAll(".suggestion-items").forEach(i => i.remove());

          if (!val) return;

          list.className = "suggestion-items";
          list.style.cssText = `
            position:absolute; top:${rect.bottom + window.scrollY}px;
            left:${rect.left + window.scrollX}px; width:${rect.width}px;
            background:#fff; border:1px solid #d4d4d4; max-height:200px;
            overflow-y:auto; z-index:9999;
          `;

          document.body.appendChild(list);

          items.forEach(item => {
            const matchValue = isNumber ? item.kodePos : item.nama.toLowerCase();

            if (matchValue.includes(val)) {
              const div = document.createElement("div");

              div.textContent = isNumber ? item.kodePos : item.nama;
              div.style.cssText = "padding:8px;cursor:pointer";
              div.onmouseenter = () => div.style.backgroundColor = "#e9e9e9";
              div.onmouseleave = () => div.style.backgroundColor = "#fff";

              div.onclick = () => {
                input.value = isNumber ? item.kodePos : item.nama;
                list.remove();
              };
              list.appendChild(div);
            }
          });
        });
        input.setAttribute("suggestion", "off");
      }

      // Submit
      form.addEventListener("submit", e => {
        e.preventDefault();
        const provVal = provSelect.value;
        const kotaVal = kotaSelect.value;
        const kodePosVal = kodePosInput.value.trim();
        const items = data[provVal][kotaVal];
        const match = items.find(i => i.kodePos === kodePosVal || i.nama.toLowerCase() === kodePosVal.toLowerCase());

        let errors = [];
        if (!provVal) errors.push("Provinsi");

        if (!kotaVal) errors.push("Kota/Kabupaten");

        if (!kodePosVal) errors.push("Kode Pos/Wilayah");

        if (errors.length) {
          resultDiv.style.display = "block";
          resultDiv.querySelector("p").textContent = `Lengkapi ${errors.join(", ")}`;
          return;
        }

        if (!match) {
          resultDiv.style.display = "block";
          resultDiv.querySelector("p").textContent = "Kode Pos/Wilayah tidak tersedia.";
          return;
        }

        resultDiv.style.display = "block";
        resultDiv.querySelector("p").textContent =
          `Provinsi: ${provVal}, Kota/Kab: ${kotaVal}, Kode Pos - Wilayah: ${match.kodePos} - ${match.nama}`;
      });

    })
    .catch(console.error);
}

// Dynamic Drop Down List
const prktSelect = document.getElementById("perangkat");
const merkSelect = document.getElementById("merek");

fetch("./dynaDropDownData.json")
    .then(response => response.json())
    .then(data => {
        Object.keys(data.device).forEach(deviceType => {
            const option = document.createElement("option");
            option.value = deviceType;
            option.textContent = deviceType.charAt(0).toUpperCase() + deviceType.slice(1);
            prktSelect.appendChild(option);
        });

        prktSelect.addEventListener("change", function() {
            const selectedDevice = this.value;

            if (!selectedDevice) {
                merkSelect.disabled = true;
                merkSelect.innerHTML = '<option value="">Tidak Ada</option>';
                return;
            }
            merkSelect.disabled = false;
            merkSelect.innerHTML = '<option value="">Tidak Ada</option>';

            data.device[selectedDevice].forEach(brand => {
                const option = document.createElement("option");
                option.value = brand.toLowerCase();
                option.textContent = brand;
                merkSelect.appendChild(option);
            });
        });
    })
.catch(error => console.error("Error loading JSON:", error));
