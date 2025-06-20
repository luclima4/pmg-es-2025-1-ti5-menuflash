const paymentData = {
    metodosDisponiveis: [
        { tipo: "Pix", value: "pix" },
        { tipo: "Cartão de Débito", value: "debito" },
        { tipo: "Cartão de Crédito", value: "credito" }
    ],
    
    cartoesAdicionados: []
};

const jsonServerUrl = 'http://localhost:3000';

const paymentMethodsSection = document.querySelector('.pagamento-metodo-section');
const addCardFormSection = document.querySelector('.add-cartão-form-section');
const addCardButton = document.getElementById('add-cartão-button');
const saveCardButton = document.getElementById('save-cartão-button');
const cardNumberInput = document.getElementById('cartão-number');
const cardExpiryInput = document.getElementById('cartão-validade');
const cardCvcInput = document.getElementById('cartão-cvc');
const cardHolderNameInput = document.getElementById('cartão-name');
const cartoesListContainer = document.getElementById('cartoes-list-container');
const pixInfoSection = document.querySelector('.pix-info-section');
const copyPixCodeButton = document.getElementById('copy-pix-code-button');
const pixCopyCodeInput = document.getElementById('pix-copy-code');


async function displayAddedCards() {
    
    cartoesListContainer.innerHTML = '';

    try {
       
        const response = await fetch(`${jsonServerUrl}/cartoesAdicionados`);
        const cartoes = await response.json();

        if (cartoes.length === 0) {
            cartoesListContainer.innerHTML = '<p>Nenhum cartão adicionado.</p>';
            return;
        }

        cartoes.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('added-card-item');
            
            const lastFourDigits = card.numero ? card.numero.slice(-4) : 'N/A';
            cardElement.innerHTML = `
                <span>**** **** **** ${lastFourDigits}</span>
                <span>${card.validade || 'N/A'}</span>
            `;
            cartoesListContainer.appendChild(cardElement);
        });

        console.log("Cartões carregados do JSON Server:", cartoes);

    } catch (error) {
        console.error('Erro ao carregar cartões do JSON Server:', error);
        cartoesListContainer.innerHTML = '<p>Erro ao carregar cartões.</p>';
    }
}


document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', (event) => {
        const selectedMethod = event.target.value;

        
        addCardFormSection.style.display = 'none';
        pixInfoSection.style.display = 'none';

        const cartoesListSection = document.querySelector('.cartoes-adicionados-list');

        if (selectedMethod === 'credito' || selectedMethod === 'debito') {
             cartoesListSection.style.display = 'block';
             addCardButton.style.display = 'block';
             displayAddedCards(); 
        } else {
             cartoesListSection.style.display = 'none';
             addCardButton.style.display = 'none';
        }

        if (selectedMethod === 'pix') {
            pixInfoSection.style.display = 'block'; 
        }
    });
});

addCardButton.addEventListener('click', () => {
    paymentMethodsSection.style.display = 'none'; 
    addCardFormSection.style.display = 'block'; 
    pixInfoSection.style.display = 'none'; 
});

saveCardButton.addEventListener('click', async () => {
    
    const newCard = {
        numero: cardNumberInput.value,
        validade: cardExpiryInput.value,
        cvc: cardCvcInput.value,
        nome: cardHolderNameInput.value
    };

    try {
        // Envia os dados do novo cartão para o JSON Server
        const response = await fetch(`${jsonServerUrl}/cartoesAdicionados`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCard),
        });

        const addedCard = await response.json();
        console.log('Novo cartão adicionado ao JSON Server:', addedCard);
        alert('Cartão adicionado com sucesso!');

        cardNumberInput.value = '';
        cardExpiryInput.value = '';
        cardCvcInput.value = '';
        cardHolderNameInput.value = '';

        
        addCardFormSection.style.display = 'none';
        paymentMethodsSection.style.display = 'block';
        displayAddedCards(); 

    } catch (error) {
        console.error('Erro ao salvar cartão no JSON Server:', error);
        alert('Erro ao salvar cartão. Verifique se o JSON Server está rodando.');
    }
});


copyPixCodeButton.addEventListener('click', () => {
    pixCopyCodeInput.select();
    document.execCommand('copy');
    alert('Código Pix copiado!');
});


displayAddedCards(); 

const cartoesListSection = document.querySelector('.cartoes-adicionados-list');
cartoesListSection.style.display = 'none';
addCardButton.style.display = 'none'; 