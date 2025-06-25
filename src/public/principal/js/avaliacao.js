function inicializarEstrelasGenerico(container, chaveLocal) {
    const estrelas = container.querySelectorAll(".estrela");
    const notaSalva = localStorage.getItem(chaveLocal);

    if (notaSalva) {
        destacarEstrelas(estrelas, parseInt(notaSalva));
    }

    estrelas.forEach((estrela, index) => {
        estrela.addEventListener("mouseenter", () => {
            destacarEstrelas(estrelas, index + 1);
        });

        estrela.addEventListener("mouseleave", () => {
            const notaFinal = localStorage.getItem(chaveLocal);
            destacarEstrelas(estrelas, parseInt(notaFinal) || 0);
        });

        estrela.addEventListener("click", () => {
            localStorage.setItem(chaveLocal, index + 1);
            destacarEstrelas(estrelas, index + 1);
        });
    });
}

function destacarEstrelas(estrelas, nota) {
    estrelas.forEach((estrela, i) => {
        if (i < nota) {
            estrela.classList.add("fa-solid");
            estrela.classList.remove("fa-regular");
        } else {
            estrela.classList.add("fa-regular");
            estrela.classList.remove("fa-solid");
        }
    });
}