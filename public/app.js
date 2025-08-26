//alertas
function veralerta(texto) {
  return new Promise((resolve) => {
    const overlay = document.getElementById("custom-alert-overlay");
    const modal   = document.getElementById("custom-alert");
    const msg     = document.getElementById("custom-alert-msg");
    const okBtn   = document.getElementById("custom-alert-ok");

    msg.textContent = texto;

    // mostrar
    overlay.style.display = "block";
    modal.style.display   = "grid";

    // al hacer click en OK, cerrar
    okBtn.onclick = () => {
      overlay.style.display = "none";
      modal.style.display   = "none";
      resolve(); // <- aquí se desbloquea el await
    };
  });
}

//precios de comprar recursos
const madera = 2;
const hachas = 3;
const hierro = 3;
const menaoro = 5;
const lingoteoro = 12;
const anillo = 35;
const corona = 400;
//precio de venta recursos
const maderaventa = 3;
const hachasventa = 6;
const hierroventa = 5;
const menaoroventa = 12;
const lingoteoroventa = 40;
const anilloventa = 130;
const coronaventa = 3000;
// coins requeridos por nivel
const coin1 = 9;
const coin2 = 39;
const coin3 = 2999;

//dias por nivel
const dias1 = 6;
const dias2 = 7;
const dias3 = 12;

//poner los recursos en local Storage
async function cargarecursos () {
  try {
    const respuesta = await fetch('https://juego-comercio.onrender.com/recursos')
    const datos = await respuesta.json();
    localStorage.setItem('recursosjuego',JSON.stringify(datos));
    console.log('recursos guardados');
  }
  catch (error){
    console.log('error al cargar recursos:', error)
  }
}
//subir los recursos del local storage al
async function setrecursos(){
  const recursos = JSON.parse(localStorage.getItem('recursosjuego'));
  if (recursos !== undefined){
    try {
      const r = await fetch(`https://juego-comercio.onrender.com/recursos/set`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
      "coin": recursos.coin,
      "hachas": recursos.hachas,
      "madera": recursos.madera,
      "dias": recursos.dias,
      "nivel": recursos.nivel,
      "hierro": recursos.hierro,
      "menaoro": recursos.menaoro,
      "lingoteoro": recursos.lingoteoro,
      "anillo": recursos.anillo,
      "corona": recursos.corona 
      })
    });}
      catch (error){
      console.log('error al subir los recursos:', error)
    }}
}

// modifica los recursos, permite sumar, restar e igualar
function modificarRecurso(recurso, operacion, valor) {
  const recursos = JSON.parse(localStorage.getItem('recursosjuego'));

  if (recursos && recursos[recurso] !== undefined) {
    switch (operacion) {
      case "sumar":
        recursos[recurso] += valor;
        break;
      case "restar":
        recursos[recurso] -= valor;
        break;
      case "igualar":
        recursos[recurso] = valor;
        break;
      default:
        console.log("Operación no reconocida");
        return;
    }
    // Guardar de nuevo en localStorage
    localStorage.setItem('recursosjuego', JSON.stringify(recursos));
    console.log(`Nuevo valor de ${recurso}:`, recursos[recurso]);
  } else {
    console.log(`El recurso ${recurso} no existe en localStorage`);
  }
}

//modificar todos los recursos 
function modificartodo(valorcoin, numerodias, nivel) {
   modificarRecurso('coin', 'igualar', valorcoin);
   modificarRecurso('hachas', 'igualar', 0);
   modificarRecurso('madera', 'igualar', 0);
   modificarRecurso('dias', 'igualar', numerodias);
   modificarRecurso('nivel', 'igualar', nivel);
   modificarRecurso('hierro', 'igualar', 0);
   modificarRecurso('menaoro', 'igualar', 0);
   modificarRecurso('lingoteoro', 'igualar', 0);
   modificarRecurso('anillo', 'igualar', 0);
   modificarRecurso('corona', 'igualar', 0);
}
//modificar recursos por compra
function comprar(recurso, precio) {
  modificarRecurso(recurso, 'sumar', 1);
  modificarRecurso('coin', 'restar', precio);
  mostrarrecurso('coin');
}
//modificar recursos por venta
function vender (recurso, precio){
    modificarRecurso(recurso, 'restar', 1);  
    modificarRecurso('coin', 'sumar', precio);
    mostrarrecurso('coin'); 
}
// activa un botón comprar
async function clickcompar(id, recurso, precio) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener('click', async () => {
          comprar(recurso, precio);
          mostrarrecurso(recurso);
          bloqueoscompra();
          bloqueosventa()
        });
    }
}
// activa un botón vender
async function clickvender(id, recurso, precio) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener('click', async () => {
          vender(recurso, precio);
          mostrarrecurso(recurso);
          victoria ()
          bloqueoscompra();
          bloqueosventa();
        });
    }
}
//bloquear botones 
function bloquearpueblos (boolean){
  document.getElementById('pueblomadera').disabled = boolean;
  document.getElementById('pueblohierro').disabled = boolean;
  document.getElementById('pueblojoyas').disabled = boolean;
  document.getElementById('castillo').disabled = boolean;
}
// activa botones de pueblo
async function clickpueblo(id, htmlpueblo) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener('click', async () => {
          bloquearpueblos (true);
          modificarRecurso('dias', 'restar', 1);
          mostrarrecurso('dias');
          await derrota ()
          await setrecursos();
          bloquearpueblos (false);
          window.location.href = htmlpueblo;
        });
    }
}
// activa boton de carga
async function clickcargar(id, htmlpueblo) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener('click', async () => {
          await cargarecursos();
          window.location.href = htmlpueblo;
        });
    }
}
// activa boton de reset
async function clickreset(id, htmlpueblo) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener('click', async () => {
          await cargarecursos();
          modificartodo(2, 6, 1);
          await setrecursos();
          window.location.href = htmlpueblo;
        });
    }
}
//mostar un recurso en pantalla
function mostrarrecurso(recurso){
  const recursos = JSON.parse(localStorage.getItem('recursosjuego'));
  if (recursos && recursos[recurso] !== undefined){
    console.log(recursos[recurso]);
    var valor = document.getElementById(recurso);
    if (valor){
    valor.innerText = recursos[recurso];
    }
  } else {
    console.log('No se encontro la propiedad coin en recursos');
  }
}
//ver todos los recursos en pantalla
function mostartodoslosrecursos() {
  mostrarrecurso('coin');
  mostrarrecurso('dias');
  mostrarrecurso('nivel');
  mostrarrecurso('madera');
  mostrarrecurso('hachas');
  mostrarrecurso('hierro');
  mostrarrecurso('menaoro');
  mostrarrecurso('lingoteoro');
  mostrarrecurso('anillo');
  mostrarrecurso('corona');
}
mostartodoslosrecursos();

//obtener el valor de 1 recurso
function obtenerValor(recurso) {
  const recursos = JSON.parse(localStorage.getItem('recursosjuego'));
  if (recursos && recursos[recurso] !== undefined){
    console.log(recursos[recurso]);
    return recursos[recurso];
  }
  return null; // no existe
}
//Comparar dos recursos
function compararRecurso(recursoMayor, recursoMenor) {
  const valorMayor = recursoMayor;
  const valorMenor = recursoMenor;
  if (valorMayor === null || valorMenor === null) {
    return false; // alguno no existe
  }
  return valorMayor > valorMenor;
}

//habilita o desactiva los botones de comprar o vender segun los recursos de jugador
function bloqueo (id, recursoMayor, recursoMenor){
  const boton = document.getElementById(id);
  if (boton){
    boton.disabled = compararRecurso(recursoMayor, recursoMenor);    
  }        
}
//trigger derrota
async function derrota (){
  const comprovar = compararRecurso(1, obtenerValor('dias'))
  if (comprovar){
    if (1 === obtenerValor('nivel')){
        modificartodo(2, dias1, 1);
        await setrecursos();
        await veralerta('No alcanzaste a juntar lo suficiente. El Rey no perdona las deudas.');
        window.location.href = 'mapa.html';
    } else if (2 === obtenerValor('nivel')){
        modificartodo(2, dias2, 2);
        await setrecursos();
        await veralerta('No alcanzaste a juntar lo suficiente. El Rey no perdona las deudas.');
        window.location.href = 'mapa.html';
    }else if (3 === obtenerValor('nivel')){
        modificartodo(3, dias3, 3);
        await setrecursos();
        await veralerta('No alcanzaste a juntar lo suficiente. El Rey no perdona las deudas.');
        window.location.href = 'mapa.html';
    }
  }
}
//trigger victoria
async function victoria (){
  if (1 === obtenerValor('nivel') && compararRecurso(obtenerValor('coin'), coin1)){
      modificartodo(2, dias2, 2);
      await setrecursos();
      await veralerta('Has cumplido el primer pago. El Rey espera impaciente el siguiente.');
      window.location.href = 'mapa.html';
  } else if (2 === obtenerValor('nivel') && compararRecurso(obtenerValor('coin'), coin2)){
      modificartodo(3, dias3, 3);
      await setrecursos();
      await veralerta('Triunfaste de nuevo. Prepara el último pago.');
      window.location.href = 'mapa.html';
  }else if (3 === obtenerValor('nivel') && compararRecurso(obtenerValor('coin'), coin3)){
      modificartodo(0, 99, 3);
      await setrecursos();
      await veralerta('La deuda está saldada. Ahora el Rey exige tu presencia.');
      window.location.href = 'lore2.html';
  }
}
//mostar los coin nesesarios por nivel
function coinnivel (coin){
     var valor = document.getElementById('coinnivel');
   if (valor) {
    valor.innerText = (coin + 1);  
  } 
}
//ocultar pueblos y recursos hasta los niveles nesesarios
function ocultar (nivel){
  const elementosocultables = document.querySelectorAll(nivel);
  elementosocultables.forEach(elemento => {
    elemento.style.display = 'none';
  });
}
ocultar('.nivel2');
ocultar('.nivel3');
function desocultar (nivel, clase, coin, style){
        const elementosocultables = document.querySelectorAll(clase);
        if (nivel < obtenerValor('nivel')){
          coinnivel(coin);
          elementosocultables.forEach(elemento => {
          elemento.style.display = style;
      });
     }
    }      
desocultar(1, '.nivel2', coin2, 'inline');
desocultar(2, '.nivel3', coin3, 'inline');
desocultar(2, '.barato', coin3, 'none');

function bloqueoscompra() {
  bloqueo('masmadera', madera, obtenerValor('coin'));
  bloqueo('mashachas', hachas, obtenerValor('coin'));
  bloqueo('mashierro', hierro, obtenerValor('coin'));
  bloqueo('masmenaoro', menaoro, obtenerValor('coin'));
  bloqueo('maslingoteoro', lingoteoro, obtenerValor('coin'));
  bloqueo('masanillo', anillo, obtenerValor('coin'));
  bloqueo('mascorona', corona, obtenerValor('coin'));
}
function bloqueosventa() {
  bloqueo('menosmadera', 1, obtenerValor('madera'));
  bloqueo('menoshachas', 1, obtenerValor('hachas')); 
  bloqueo('menoshierro', 1, obtenerValor('hierro')); 
  bloqueo('menosmenaoro', 1, obtenerValor('menaoro')); 
  bloqueo('menoslingoteoro', 1, obtenerValor('lingoteoro')); 
  bloqueo('menosanillo', 1, obtenerValor('anillo')); 
  bloqueo('menoscorona', 1, obtenerValor('corona'));   
}
bloqueoscompra();
bloqueosventa();

//botones pueblos
clickpueblo('pueblomadera', 'pueblomadera.html');
clickpueblo('pueblohierro', 'pueblohierro.html');
clickpueblo('pueblojoyas', 'pueblojoyas.html');
clickpueblo('castillo', 'castillo.html');
//botones compra
clickcompar('masmadera', 'madera', madera);
clickcompar('mashachas', 'hachas', hachas);
clickcompar('mashierro', 'hierro', hierro);
clickcompar('masmenaoro', 'menaoro', menaoro);
clickcompar('maslingoteoro', 'lingoteoro', lingoteoro);
clickcompar('masanillo', 'anillo', anillo);
clickcompar('mascorona', 'corona', corona);
//botones venta
clickvender('menosmadera', 'madera', maderaventa);
clickvender('menoshachas', 'hachas', hachasventa);
clickvender('menoshierro', 'hierro', hierroventa);
clickvender('menosmenaoro', 'menaoro', menaoroventa);
clickvender('menoslingoteoro', 'lingoteoro', lingoteoroventa);
clickvender('menosanillo', 'anillo', anilloventa);
clickvender('menoscorona', 'corona', coronaventa);
//botones menu
clickcargar('continuar', 'mapa.html');
clickreset('reset', 'lore.html');























