<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CNRT - Registro Vehículos y VTV</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<header>
  <img src="logo.png" alt="CNRT Logo" class="logo">
  <h1>Comisión Nacional de Regulación del Transporte</h1>
  <nav>
    <button onclick="mostrarPagina('cnrt')">Registro CNRT</button>
    <button onclick="mostrarPagina('vtv')">Registro VTV</button>
  </nav>
</header>

<main>
  <!-- Página CNRT -->
  <section id="pagina-cnrt" class="pagina card">
    <h2>Registrar Vehículo / CNRT</h2>
    <form id="formVehiculo">
      <input id="patente" placeholder="Patente" required>
      <input id="empresa" placeholder="Empresa" required>
      <input id="modelo" placeholder="Modelo del Bus" required>
      <input id="anio" type="number" placeholder="Año de Fabricación" required>
      <textarea id="detalles" placeholder="Detalles"></textarea>
      <textarea id="descripcion" placeholder="Descripción"></textarea>
      <button type="submit">Registrar Vehículo</button>
    </form>

    <h3>Buscar Vehículo</h3>
    <form id="formBuscar">
      <input id="buscarPatente" placeholder="Patente" required>
      <button type="submit">Buscar</button>
    </form>
    <div id="resultados"></div>
  </section>

  <!-- Página VTV -->
  <section id="pagina-vtv" class="pagina card" style="display:none;">
    <h2>Registrar VTV</h2>
    <form id="formVtv">
      <input id="vtvPatente" placeholder="Patente" required>
      <input id="vtvEmpresa" placeholder="Empresa" required>
      <input id="vtvAnio" type="number" placeholder="Año de Fabricación" required>
      <input id="vtvFecha" type="date" placeholder="Fecha VTV" required>
      <textarea id="vtvObs" placeholder="Observaciones"></textarea>
      <button type="submit">Registrar VTV</button>
    </form>
  </section>
</main>

<footer>
© 2025 CNRT - Ministerio de Transporte
</footer>

<script type="module" src="script.js"></script>
<script>
  function mostrarPagina(pagina){
    document.getElementById("pagina-cnrt").style.display = (pagina === 'cnrt') ? 'block' : 'none';
    document.getElementById("pagina-vtv").style.display = (pagina === 'vtv') ? 'block' : 'none';
  }
</script>
</body>
</html>
