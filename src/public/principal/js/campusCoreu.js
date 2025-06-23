// Arquivo: principal/js/campusCoreu.js
// Versão final e limpa, que cuida APENAS do mapa e dos marcadores.

document.addEventListener("DOMContentLoaded", () => {
    const MAP_CONTAINER_ID = 'mapa'; 
    const campusConfig = {
        center: [-43.9922, -19.9227],
        zoom: 15.5
    };

    const lanchonetesParaMarcar = [
        { nome: 'Lanchonete Central', coords: [-43.992475, -19.923642] },
        { nome: 'Prédio 18', coords: [-43.993469, -19.923959] },
        { nome: 'Prédio 29', coords: [-43.991462, -19.923036] }
    ];

    const mapaContainer = document.getElementById(MAP_CONTAINER_ID);
    if (!mapaContainer) {
        console.error(`Container do mapa com id='${MAP_CONTAINER_ID}' não foi encontrado.`);
        return;
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3Mtc2FubnRvcyIsImEiOiJjbWMyN3ZjZHcwNWxwMmtwdnJqa2d6ZDB2In0.XIwfVgH6cLFQBO8UIaoZxA';
    const map = new mapboxgl.Map({
        container: MAP_CONTAINER_ID,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: campusConfig.center,
        zoom: campusConfig.zoom
    });

    lanchonetesParaMarcar.forEach(lanchonete => {
        const popupHTML = `<div style="color: #333; font-weight: bold; padding: 2px 5px;">${lanchonete.nome}</div>`;
        new mapboxgl.Marker({ color: "#a00000" })
            .setLngLat(lanchonete.coords)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHTML))
            .addTo(map);
    });
});