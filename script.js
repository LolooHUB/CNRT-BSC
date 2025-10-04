import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAX_Pqitbh5rq2tc2H5RAh1Winpej_BEGk",
  authDomain: "cnrt-39579.firebaseapp.com",
  projectId: "cnrt-39579",
  storageBucket: "cnrt-39579.firebasestorage.app",
  messagingSenderId: "354210722549",
  appId: "1:354210722549:web:e1d6782423b9d7523e0bbc",
  measurementId: "G-XZCB1NYV8C"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// Registrar Vehículo
// =======================
document.getElementById("formVehiculo").addEventListener("submit", async e => {
  e.preventDefault();
  const patente = document.getElementById("patente").value.trim().toUpperCase();
  const empresa = document.getElementById("empresa").value.trim();
  const anio = document.getElementById("anio").value;
  const detalles = document.getElementById("detalles").value;
  const descripcion = document.getElementById("descripcion").value;

  if (!patente) { alert("⚠️ La patente es obligatoria."); return; }

  try {
    await setDoc(doc(db, "vehiculos", patente), {
      patente, empresa, anio, detalles, descripcion, registrado: new Date().toISOString()
    });
    alert("✅ Vehículo registrado correctamente");
    e.target.reset();
  } catch (error) {
    console.error(error);
    alert("❌ Error al registrar vehículo");
  }
});

// =======================
// Registrar VTV
// =======================
document.getElementById("formVtv").addEventListener("submit", async e => {
  e.preventDefault();
  const patente = document.getElementById("vtvPatente").value.trim().toUpperCase();
  const empresa = document.getElementById("vtvEmpresa").value.trim();
  const anio = document.getElementById("vtvAnio").value;
  const fechaVencimiento = document.getElementById("vtvFecha").value;
  const observaciones = document.getElementById("vtvObs").value;

  if (!patente) { alert("⚠️ La patente es obligatoria."); return; }

  try {
    await addDoc(collection(db, "vtv"), {
      patente, empresa, anio, fechaVencimiento, observaciones, registrada: new Date().toISOString()
    });
    alert("✅ VTV registrada correctamente");
    e.target.reset();
  } catch (error) {
    console.error(error);
    alert("❌ Error al registrar VTV");
  }
});

// =======================
// Buscar Vehículo por Patente
// =======================
document.getElementById("formBuscar").addEventListener("submit", async e => {
  e.preventDefault();
  const patente = document.getElementById("buscarPatente").value.trim().toUpperCase();
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "🔎 Buscando...";

  try {
    // Vehículo
    const vehiculoDoc = await getDoc(doc(db, "vehiculos", patente));
    let html = "";

    if (vehiculoDoc.exists()) {
      const v = vehiculoDoc.data();
      html += `
        <div class="resultado">
          <h3>🚍 Vehículo ${v.patente}</h3>
          <p><b>Empresa:</b> ${v.empresa}</p>
          <p><b>Año:</b> ${v.anio}</p>
          <p><b>Detalles:</b> ${v.detalles}</p>
          <p><b>Descripción:</b> ${v.descripcion}</p>
        </div>
      `;
    } else {
      html += `<p>❌ No se encontró el vehículo con patente <b>${patente}</b>.</p>`;
    }

    // VTVs relacionadas
    const vtvSnap = await getDocs(query(collection(db, "vtv"), where("patente", "==", patente)));
    if (!vtvSnap.empty) {
      html += "<h3>📋 Historial de VTV</h3>";
      vtvSnap.forEach(doc => {
        const v = doc.data();
        html += `
          <div class="resultado">
            <p><b>Fecha vencimiento:</b> ${v.fechaVencimiento}</p>
            <p><b>Observaciones:</b> ${v.observaciones}</p>
          </div>
        `;
      });
    }

    resultadosDiv.innerHTML = html;
  } catch (error) {
    console.error(error);
    resultadosDiv.innerHTML = "❌ Error al buscar datos.";
  }
});
