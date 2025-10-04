import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, addDoc, getDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX_Pqitbh5rq2tc2H5RAh1Winpej_BEGk",
  authDomain: "cnrt-39579.firebaseapp.com",
  projectId: "cnrt-39579",
  storageBucket: "cnrt-39579.firebasestorage.app",
  messagingSenderId: "354210722549",
  appId: "1:354210722549:web:e1d6782423b9d7523e0bbc",
  measurementId: "G-XZCB1NYV8C"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const toast = document.getElementById("toast");
function showToast(msg){
  toast.innerText = msg;
  toast.style.opacity="1";
  setTimeout(()=>{ toast.style.opacity="0"; },2500);
}

// CNRT Registro
document.getElementById("formVehiculo").addEventListener("submit", async e=>{
  e.preventDefault();
  const patente = document.getElementById("patente").value.trim().toUpperCase();
  const empresa = document.getElementById("empresa").value.trim();
  const modelo = document.getElementById("modelo").value.trim();
  const anio = document.getElementById("anio").value;
  const detalles = document.getElementById("detalles").value;
  const descripcion = document.getElementById("descripcion").value;

  const checklist = [
    document.getElementById("cnrtVTV").checked,
    document.getElementById("cnrtSoporte").checked,
    document.getElementById("cnrtAnio").checked,
    document.getElementById("cnrtSeguridad").checked
  ];
  if(checklist.includes(false)){
    showToast("⚠️ Todos los requisitos CNRT deben ser cumplidos.");
    return;
  }

  // Verificar VTV previa
  const vtvSnap = await getDocs(query(collection(db,"vtv"), where("patente","==",patente)));
  if(vtvSnap.empty){
    showToast("❌ Vehículo sin VTV registrada. Registrar VTV primero.");
    return;
  }

  try{
    await setDoc(doc(db,"vehiculos",patente),{ patente, empresa, modelo, anio, detalles, descripcion, registrado: new Date().toISOString() });
    showToast("✅ Vehículo registrado correctamente");
    e.target.reset();
  }catch(err){ console.error(err); showToast("❌ Error al registrar vehículo"); }
});

// Buscar vehículo
document.getElementById("formBuscar").addEventListener("submit", async e=>{
  e.preventDefault();
  const patente = document.getElementById("buscarPatente").value.trim().toUpperCase();
  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML="🔎 Buscando...";
  try{
    const vehiculoDoc = await getDoc(doc(db,"vehiculos",patente));
    let html="";
    if(vehiculoDoc.exists()){
      const v = vehiculoDoc.data();
      html+=`<div class="resultado"><h3>🚍 Vehículo ${v.patente}</h3><p><b>Empresa:</b> ${v.empresa}</p><p><b>Modelo:</b> ${v.modelo}</p><p><b>Año:</b> ${v.anio}</p><p><b>Detalles:</b> ${v.detalles}</p><p><b>Descripción:</b> ${v.descripcion}</p></div>`;
    }else{ html=`<p>❌ No se encontró vehículo con patente <b>${patente}</b>.</p>`; }

    const vtvSnap = await getDocs(query(collection(db,"vtv"), where("patente","==",patente)));
    if(!vtvSnap.empty){
      html+="<h3>📋 Historial de VTV</h3>";
      vtvSnap.forEach(doc=>{
        const v = doc.data();
        html+=`<div class="resultado"><p><b>Modelo:</b> ${v.modelo || '-'}</p><p><b>Fecha vencimiento:</b> ${v.fechaVencimiento}</p><p><b>Observaciones:</b> ${v.observaciones}</p></div>`;
      });
    }
    resultadosDiv.innerHTML=html;
  }catch(err){ console.error(err); resultadosDiv.innerHTML="❌ Error al buscar datos."; }
});

// Registro VTV
document.getElementById("formVtv").addEventListener("submit", async e=>{
  e.preventDefault();
  const patente = document.getElementById("vtvPatente").value.trim().toUpperCase();
  const empresa = document.getElementById("vtvEmpresa").value.trim();
  const modelo = document.getElementById("vtvModelo").value.trim();
  const anio = document.getElementById("vtvAnio").value;
  const fechaVencimiento = document.getElementById("vtvFecha").value;
  const observaciones = document.getElementById("vtvObs").value;

  const checklist = [
    document.getElementById("vtvAnioCheck").checked,
    document.getElementById("vtvPapeles").checked,
    document.getElementById("vtvAA").checked,
    document.getElementById("vtvVelocidad").checked,
    document.getElementById("vtvPloteo").checked
  ];
  if(checklist.includes(false)){ showToast("⚠️ Todos los requisitos VTV deben ser cumplidos."); return; }

  // Próxima VTV
  const fecha = new Date(fechaVencimiento);
  fecha.setFullYear(fecha.getFullYear()+1);
  document.getElementById("proxVTV").innerText = fecha.toISOString().split('T')[0];

  try{
    await addDoc(collection(db,"vtv"),{ patente, empresa, modelo, anio, fechaVencimiento, observaciones, registrada: new Date().toISOString() });
    showToast("✅ VTV registrada correctamente");
    e.target.reset();
  }catch(err){ console.error(err); showToast("❌ Error al registrar VTV"); }
});

// Buscar historial VTV
document.getElementById("formBuscarVTV").addEventListener("submit", async e=>{
  e.preventDefault();
  const patente = document.getElementById("buscarVtvPatente").value.trim().toUpperCase();
  const resultadosDiv = document.getElementById("resultadosVTV");
  resultadosDiv.innerHTML="🔎 Buscando...";
  try{
    const vtvSnap = await getDocs(query(collection(db,"vtv"), where("patente","==",patente)));
    if(vtvSnap.empty){ resultadosDiv.innerHTML="❌ No se encontró historial de VTV."; return; }
    let html="<h3>📋 Historial VTV</h3>";
    vtvSnap.forEach(doc=>{
      const v = doc.data();
      html+=`<div class="resultado"><p><b>Modelo:</b> ${v.modelo || '-'}</p><p><b>Empresa:</b> ${v.empresa}</p><p><b>Fecha vencimiento:</b> ${v.fechaVencimiento}</p><p><b>Observaciones:</b> ${v.observaciones}</p></div>`;
    });
    resultadosDiv.innerHTML=html;
  }catch(err){ console.error(err); resultadosDiv.innerHTML="❌ Error al buscar VTV."; }
});
