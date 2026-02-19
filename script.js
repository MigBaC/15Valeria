const URL_WEB_APP = "https://script.google.com/macros/s/AKfycbygXY35hggaho9NkonxGpCBkIaapk0Lg3Uw9bh_hCePTA9Mt-n8XOAwj1G9ttlrrk3Cew/exec"; 
let datosInvitado = null;

function iniciarReloj() {
    const evento = new Date('April 2, 2026 19:00:00').getTime();
    const update = () => {
        const ahora = new Date().getTime();
        const diff = evento - ahora;
        if (diff <= 0) {
            document.getElementById("countdown").innerHTML = "¡ES HOY! ✨";
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        if(document.getElementById("days")) document.getElementById("days").innerText = d.toString().padStart(2, '0');
        if(document.getElementById("hours")) document.getElementById("hours").innerText = h.toString().padStart(2, '0');
        if(document.getElementById("minutes")) document.getElementById("minutes").innerText = m.toString().padStart(2, '0');
    };
    setInterval(update, 1000);
    update();
}

async function buscarInvitado() {
    let nombreIn = document.getElementById('nIn').value.trim();
    const mensaje = document.getElementById('msg');
    const btnBusqueda = document.querySelector('#step1 .btn');

    if (nombreIn.length < 3) {
        mensaje.innerText = "Escribe tu nombre completo.";
        return;
    }

    mensaje.innerText = "Buscando en la lista de honor...";
    mensaje.style.color = "#f4d03f";
    btnBusqueda.disabled = true;

    try {
        const res = await fetch(`${URL_WEB_APP}?action=buscar&nombre=${encodeURIComponent(nombreIn)}`);
        const data = await res.json();

        if (data.status === "ya_confirmado") {
            document.getElementById('confirm-area').innerHTML = `
                <div style="animation: fadeIn 0.5s;">
                    <h3 class="cursive">¡Hola, ${data.nombre}!</h3>
                    <p>Ya recibimos tu confirmación.</p>
                    <div style="background: rgba(212,175,55,0.2); padding: 15px; border-radius: 10px; margin: 10px 0;">
                        Lugares reservados: <strong>${data.pases}</strong>
                    </div>
                    <p class="cursive" style="font-size:22px;">¡Te esperamos!</p>
                </div>`;
        } else if (data.status === "ok") {
            datosInvitado = data;
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('welcome-txt').innerText = `¡Hola ${data.nombre}!`;
            
            const sel = document.getElementById('cSel');
            sel.innerHTML = "";
            for (let i = 1; i <= data.cupos; i++) {
                let opt = document.createElement('option');
                opt.value = i;
                opt.text = i === 1 ? "1 Persona" : `${i} Personas`;
                sel.add(opt);
            }
            mensaje.innerText = "";
        } else {
            mensaje.innerText = data.msg;
            mensaje.style.color = "#ff4d4d";
        }
    } catch (e) {
        mensaje.innerText = "Error de conexión. Intenta de nuevo.";
    } finally {
        btnBusqueda.disabled = false;
    }
}

async function confirmarFinal() {
    const cant = document.getElementById('cSel').value;
    const btn = document.querySelector('#step2 .btn');
    btn.disabled = true;
    btn.innerText = "Guardando...";

    try {
        await fetch(`${URL_WEB_APP}?action=confirmar&fila=${datosInvitado.fila}&confirmados=${cant}`, { mode: 'no-cors' });
        
        confetti({ 
            particleCount: 150, spread: 70, origin: { y: 0.6 },
            colors: ['#d4af37', '#a569bd', '#ffffff']
        });

        document.getElementById('confirm-area').innerHTML = `
            <div style="animation: fadeInUp 0.5s;">
                <h3 class="cursive" style="font-size:38px;">¡Confirmado!</h3>
                <p>Tu lugar ha sido reservado con éxito.</p>
                <p>¡Gracias por acompañarme!</p>
            </div>`;
    } catch (e) {
        alert("Hubo un problema. Intenta de nuevo.");
        btn.disabled = false;
    }
}

function agregarACalendario() {
    const titulo = "Mis XV - Valeria Unda";
    const detalles = "Lluvia de sobres. Favor de confirmar asistencia.";
    const lugar = "Salón La Aurora";
    const inicio = "20260402T190000";
    const fin = "20260403T020000";
    window.open(`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${inicio}/${fin}&details=${encodeURIComponent(detalles)}&location=${encodeURIComponent(lugar)}`);
}

window.onload = iniciarReloj;
