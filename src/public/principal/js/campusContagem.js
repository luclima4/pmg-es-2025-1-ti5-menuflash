// Arquivo: principal/js/campusContagem.js
// Versão final que cuida APENAS do mapa e dos marcadores.

document.addEventListener("DOMContentLoaded", () => {
    const MAP_CONTAINER_ID = 'mapa';
    const campusConfig = {
        center: [-44.07632, -19.94020],
        zoom: 16
    };

    const lanchonetesParaMarcar = [
      { nome: 'Lanchonete Praçaki', coords: [-44.07620599367716, -19.939352989756927] },
      { nome: 'Lanchonete Praçala', coords: [-44.07643901192358, -19.941048287246733] }
    ];

    const mapaContainer = document.getElementById(MAP_CONTAINER_ID);
    if (!mapaContainer) {
        console.error(`Container do mapa com id='${MAP_CONTAINER_ID}' não foi encontrado.`);
        return;
    }

    // Inicializa o Mapa
    mapboxgl.accessToken = 'pk.eyJ1IjoiY3Jpc3Mtc2FubnRvcyIsImEiOiJjbWMyN3ZjZHcwNWxwMmtwdnJqa2d6ZDB2In0.XIwfVgH6cLFQBO8UIaoZxA';
    const map = new mapboxgl.Map({
        container: MAP_CONTAINER_ID,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: campusConfig.center,
        zoom: campusConfig.zoom
    });

    // Adiciona os marcadores e popups
    lanchonetesParaMarcar.forEach(lanchonete => {
        const popupHTML = `<div style="color: #333; font-weight: bold; padding: 2px 5px;">${lanchonete.nome}</div>`;
        
        new mapboxgl.Marker({ color: "#a00000" })
            .setLngLat(lanchonete.coords)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 })
                    .setHTML(popupHTML)
            )
            .addTo(map);
    });
});