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

//esperar cargar subidad de nivel
let subiendoNivel = false;
//bloque de botones 
function bloqueo (){
    comercio(madera, 'coin', 'masmadera');
    comercio(hachas, 'coin', 'mashachas');
    comercio(hierro, 'coin', 'mashierro');
    comercio(menaoro, 'coin', 'masmenaoro');
    comercio(lingoteoro, 'coin', 'maslingoteoro');
    comercio(anillo, 'coin', 'masanillo');
    comercio(corona, 'coin', 'mascorona');
    comercio(1, 'madera', 'menosmadera');
    comercio(1, 'hachas', 'menoshachas');
    comercio(1, 'hierro', 'menoshierro');
    comercio(1, 'menaoro', 'menosmenaoro');
    comercio(1, 'lingoteoro', 'menoslingoteoro');
    comercio(1, 'anillo', 'menosanillo');
    comercio(1, 'corona', 'menoscorona');
}
//actualiza el valor del recurso en pantalla y bloqueo de botones
function mostrar (datos, tipo){
   var valor = document.getElementById(tipo);
   if (valor) {
    valor.innerText = datos[tipo];
    bloqueo();
   }   
}

//pide el valor de un recurso al servidor y lo actualiza en pantalla
async function cargar (ruta, tipo){
    try {
        response = await fetch (`https://juego-comercio.onrender.com/${ruta}`);
        const data = await response.json();
        await mostrar (data, tipo);
        
    }
    catch (error){
        console.error("Error al obtener:", error)
    }
}

//habilita o desactiva los botones de comprar o vender segun los recursos de jugador
async function comercio (valor, recurso, id){
    try {
        response = await fetch (`https://juego-comercio.onrender.com/recursos`);
        const data = await response.json();
        const boton = document.getElementById(id);
        if (boton){ 
            boton.disabled = data[recurso] < valor;    
        }        
    }
    catch (error){
        console.error("Error al obtener:", error)
    }
}


//aumenta o disminuye el valor de un recurso 
async function modificar(recurso, valor){
  try {
    const r = await fetch(`https://juego-comercio.onrender.com/recursos`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ variable: recurso, valor })
    });
    const dataParcial = await r.json();
    mostrar(dataParcial, recurso);
    const rs = await fetch('https://juego-comercio.onrender.com/recursos');
    const estado = await rs.json();

    const dias  = Number(estado.dias);
    const nivel = Number(estado.nivel);
    if (recurso === 'dias' && dias <= 0) {
      const coinReset = (nivel === 1) ? 2 : (nivel === 2) ? 2 : 2;
      const diasReset = (nivel === 1) ? dias1 : (nivel === 2) ? dias2 : dias3;
      await derrota(coinReset, diasReset);
      return estado;
    }
    if (recurso === 'coin' || recurso === 'dias' || recurso === 'nivel') {
      await niveles();
    }
    return estado;
  } catch (e) {
    console.error("Error en modificar:", e);
  }
}

//establece el valor de un recurso en un recurso en un numero especifico 

async function set(recurso, valor){
  const r = await fetch(`https://juego-comercio.onrender.com/recursos/set`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ variable: recurso, valor })
  });
  const data = await r.json();
  mostrar(data, recurso);
  if (recurso === 'coin' || recurso === 'dias' || recurso === 'nivel') {
  niveles();
}
  return data;
}

//activa un boton de comprar o vender
function click (id, recurso, valor){
    const elemento = document.getElementById(id);
    if (elemento){
        elemento.addEventListener('click',() =>
        {
          modificar (recurso, valor); 
        });
    }    
}

// activa un botón de pueblo en el mapa y descuenta un día
async function clickpueblo(id, htmlpueblo) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.addEventListener('click', async () => {
            await modificar('dias', -1);
            window.location.href = htmlpueblo;
        });
    }
}
//resetear nivel automatico

async function reset (valorcoin, valormadera, valorhachas, valordias){
  await set('coin',   valorcoin);
  await set('madera', valormadera);
  await set('hachas', valorhachas);
  await set('dias',   valordias);
  await set('hierro', 0);
  await set('menaoro', 0);
  await set('lingoteoro', 0);
  await set('anillo', 0);
  await set('corona', 0);
}

//boton de resetear nivel
function btnreset (valor1, valor2, valor3){
    const elemento = document.getElementById('reset');
    if (elemento){
        elemento.addEventListener('click', async () =>
        {
          await set ('coin', valor1);
          await set ('madera', valor2);
          await set ('hachas', valor3);
          await set ('dias', dias1);
          await set ('nivel', 1);  
          await set ('hierro', 0); 
          await set('menaoro', 0);
          await set('lingoteoro', 0);
          await set('anillo', 0);
          await set('corona', 0);
          window.location.href = 'lore.html';
        });
    }    
}

//comprovar victoria
async function victoria(fullcoin, texto, coinnivel, diasnivel, nivelEsperado, pagina){
  if (subiendoNivel) return;
  try {
    const response = await fetch(`https://juego-comercio.onrender.com/recursos`);
    const data = await response.json();

    if (data.nivel === nivelEsperado && data.coin >= fullcoin){
      subiendoNivel = true;
      await veralerta(texto);
      await modificar('nivel', 1);          
      await set('coin', coinnivel);
      await set('madera', 0);
      await set('hachas', 0);
      await set('hierro', 0);
      await set('dias', diasnivel);
      await set('menaoro', 0);
      await set('lingoteoro', 0);
      await set('anillo', 0);
      await set('corona', 0);
      window.location.href = pagina;
    }
  } catch (e){
    console.error(e);
  }
}

//comprovar derrota
async function derrota (coinReset, diasReset){
  await veralerta('No alcanzaste a juntar lo suficiente. El Rey no perdona las deudas.');
  await reset(coinReset, 0, 0, diasReset);
  console.log('perdiste');
  window.location.href = 'mapa.html';
}

//victoria y derrota de cada nivel
async function niveles(){
  try {
    const r = await fetch('https://juego-comercio.onrender.com/recursos');
    const data = await r.json();

    const dias  = Number(data.dias);
    const nivel = Number(data.nivel);
    const coin  = Number(data.coin);
    if (dias <= 0) {
      const coinReset = (nivel === 1) ? 2 : (nivel === 2) ? 2 : 3;
      const diasReset = (nivel === 1) ? dias1 : (nivel === 2) ? dias2 : dias3;
      await derrota(coinReset, diasReset);
      return;
    }
    if (subiendoNivel) return;
    if (nivel === 1) {
      await victoria(coin1, 'Has cumplido el primer pago. El Rey espera impaciente el siguiente.', 2, dias2, 1, 'mapa.html');
    } else if (nivel === 2) {
      await victoria(coin2, 'Triunfaste de nuevo. Prepara el último pago.', 3, dias3, 2, 'mapa.html');
    } else if (nivel === 3) {
      await victoria(coin3, 'La deuda está saldada. Ahora el Rey exige tu presencia.', 0, 99, 3, 'lore2.html');
    }
  } catch (e) {
    console.error('Error al evaluar niveles:', e);
  }
}
//botones
btnreset (2, 0, 0);

clickpueblo('pueblomadera', 'pueblomadera.html');
clickpueblo('pueblohierro', 'pueblohierro.html');
clickpueblo('pueblojoyas', 'pueblojoyas.html');
clickpueblo('castillo', 'castillo.html',);

//todas las compras
function compras (idboton, recurso, precio){
    click (idboton, 'coin', -precio);
    click (idboton, recurso, 1);
}
compras('masmadera','madera', madera);
compras('mashachas','hachas', hachas);
compras('mashierro','hierro', hierro);
compras('masmenaoro','menaoro', menaoro);
compras('maslingoteoro','lingoteoro', lingoteoro);
compras('masanillo','anillo', anillo);
compras('mascorona','corona', corona);
//todas las ventas
function ventas (idboton, recurso, precioventa){
    click (idboton, 'coin', precioventa);
    click (idboton, recurso, -1);
}
ventas('menosmadera', 'madera', maderaventa);
ventas('menoshachas', 'hachas', hachasventa);
ventas('menoshierro', 'hierro', hierroventa);
ventas('menosmenaoro', 'menaoro', menaoroventa);
ventas('menoslingoteoro', 'lingoteoro', lingoteoroventa);
ventas('menosanillo', 'anillo', anilloventa);
ventas('menoscorona', 'corona', coronaventa);

//carga de los recursos al cambiar de pagina 
cargar('recursos','coin');
cargar('recursos','hachas');
cargar('recursos','madera');
cargar('recursos', 'dias');
cargar('recursos', 'nivel');
cargar('recursos', 'hierro');
cargar('recursos','menaoro');
cargar('recursos', 'lingoteoro');
cargar('recursos', 'anillo');
cargar('recursos', 'corona');

niveles();

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


async function desocultar (nivel, clase, coin, style){
    try {
        response = await fetch (`https://juego-comercio.onrender.com/recursos`);
        const data = await response.json();
        const elementosocultables = document.querySelectorAll(clase);
        if (nivel < data.nivel){
          coinnivel(coin);
          elementosocultables.forEach(elemento => {
          elemento.style.display = style;
      });
     }
        
        
    }
    catch (error){
        console.error("Error al obtener:", error)
    }
}

desocultar(1, '.nivel2', coin2, 'inline');
desocultar(2, '.nivel3', coin3, 'inline');
desocultar(2, '.barato', coin3, 'none');




