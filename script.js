function getStepLogger(manager) {
    try {
        if (manager && typeof manager.getLogger === "function") {
            return manager.getLogger();
        }
    }
    catch (_error) {
        // Ignore and fall back to console logger.
    }
    return {
        info: function (message) { if (typeof console !== "undefined" && console.log) { console.log(message); } },
        warn: function (message) { if (typeof console !== "undefined" && console.warn) { console.warn(message); } },
        error: function (message) { if (typeof console !== "undefined" && console.error) { console.error(message); } },
        severe: function (message) { if (typeof console !== "undefined" && console.error) { console.error(message); } }
    };
}

/**
 * STEP Business Rule
 * Trademark: AI Labz Ltd (TM)
 * Purpose: Describe the rule intent and expected side effects.
 * Notes: Keep transactions short and avoid repeated writes in loops.
 */

// --- 1. LocalStorage & Custom Inputs ---
let startDate = new Date("2024-02-14T00:00:00");

/**
 * STEP business rule function: loadSavedData.
 * TODO: Describe purpose, side effects, and expected node/context state.
 */
function loadSavedData() {
    const savedName1 = localStorage.getItem("couple_name1") || "Билиг";
    const savedName2 = localStorage.getItem("couple_name2") || "Ану";
    const savedDate = localStorage.getItem("couple_date") || "2024-02-14";

    document.getElementById("input-name1").value = savedName1;
    document.getElementById("input-name2").value = savedName2;
    document.getElementById("input-date").value = savedDate;

    updateHeaderNames(savedName1, savedName2);
    startDate = new Date(savedDate + "T00:00:00");
}

/**
 * STEP business rule function: updateHeaderNames.
 * TODO: Describe purpose, side effects, and expected node/context state.
 * @param {*} name1
 * @param {*} name2
 */
function updateHeaderNames(name1, name2) {
    document.getElementById("couple-names").innerText = `${name1} & ${name2}`;
}

document.getElementById("btn-save").addEventListener("click", () => {
    const name1 = document.getElementById("input-name1").value.trim() || "Эрэгтэй";
    const name2 = document.getElementById("input-name2").value.trim() || "Эмэгтэй";
    const dateVal = document.getElementById("input-date").value;

    localStorage.setItem("couple_name1", name1);
    localStorage.setItem("couple_name2", name2);
    if (dateVal) {
        localStorage.setItem("couple_date", dateVal);
        startDate = new Date(dateVal + "T00:00:00");
    }

    updateHeaderNames(name1, name2);
    alert("Мэдээлэл амжилттай хадгалагдлаа!");
});

// --- 2. Realtime Precision Timer ---
/**
 * STEP business rule function: updateCounter.
 * TODO: Describe purpose, side effects, and expected node/context state.
 */
function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    if (diff < 0) {
        document.getElementById("days").innerText = "000";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        document.getElementById("ms").innerText = "000";
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    const ms = Math.floor(diff % 1000);

    document.getElementById("days").innerText = String(days).padStart(3, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    document.getElementById("ms").innerText = String(ms).padStart(3, '0');
}

setInterval(updateCounter, 30);

// --- 3. Three.js 3D Particles ---
let scene, camera, renderer, particleSystem;
const particleCount = 2000;
let particlesGeometry, particlesMaterial;

/**
 * STEP business rule function: init3D.
 * TODO: Describe purpose, side effects, and expected node/context state.
 */
function init3D() {
    const canvas = document.getElementById('bg-canvas');
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const t = Math.PI * (Math.random() * 2 - 1);
        const x = 16 * Math.pow(Math.sin(t), 3) * 2;
        const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * 2;
        const z = (Math.random() - 0.5) * 50;

        positions[i * 3] = x + (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = z;

        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = Math.random() * 0.4 + 0.2;
        colors[i * 3 + 2] = Math.random() * 0.6 + 0.4;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particlesMaterial = new THREE.PointsMaterial({
        size: 1.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleSystem);

    /**
 * STEP business rule function: animate.
 * TODO: Describe purpose, side effects, and expected node/context state.
 */
    function animate() {
        requestAnimationFrame(animate);
        particleSystem.rotation.y += 0.003;
        particleSystem.rotation.x += 0.001;
        renderer.render(scene, camera);
    }
    animate();
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 4. Interactive Buttons ---
document.getElementById('btn-burst').addEventListener('click', () => {
    const positions = particlesGeometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] += (Math.random() - 0.5) * 40;
    }
    particlesGeometry.attributes.position.needsUpdate = true;
});

let audioCtx;
document.getElementById('btn-audio').addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1);
});

let isAlternateColor = false;
document.getElementById('btn-color').addEventListener('click', () => {
    const colors = particlesGeometry.attributes.color.array;
    for (let i = 0; i < particleCount; i++) {
        if (isAlternateColor) {
            colors[i * 3] = 1.0;
            colors[i * 3 + 1] = Math.random() * 0.4 + 0.2;
            colors[i * 3 + 2] = Math.random() * 0.6 + 0.4;
        } else {
            colors[i * 3] = Math.random() * 0.3;
            colors[i * 3 + 1] = Math.random() * 0.8 + 0.2;
            colors[i * 3 + 2] = 1.0;
        }
    }
    particlesGeometry.attributes.color.needsUpdate = true;
    isAlternateColor = !isAlternateColor;
});

// Init on load
window.onload = () => {
    loadSavedData();
    init3D();
};
