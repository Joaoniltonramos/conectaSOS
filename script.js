document.addEventListener("DOMContentLoaded", () => {
    // Lógica do Carrossel (Página Inicial)
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      let index = 0;
      const slides = document.querySelectorAll('.slide');
      if (slides.length > 0) {
        setInterval(() => {
          slides.forEach(s => s.classList.remove('active'));
          slides[index = (index + 1) % slides.length].classList.add('active');
        }, 3000);
      }
    }
  
    // Lógica do Formulário de Cadastro (Página de Cadastro)
    const cepInput = document.getElementById("cep");
    const form = document.getElementById("form");
  
    if (cepInput) {
      cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length === 8) {
          try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            
            const ruaInput = document.getElementById("rua");
            const bairroInput = document.getElementById("bairro");
            const cidadeInput = document.getElementById("cidade");
            const estadoInput = document.getElementById("estado");
  
            if (!data.erro) {
              ruaInput.value = data.logradouro;
              bairroInput.value = data.bairro;
              cidadeInput.value = data.localidade;
              estadoInput.value = data.uf;
  
              // Remove o atributo 'readonly' para permitir a edição
              ruaInput.readOnly = false;
              bairroInput.readOnly = false;
              cidadeInput.readOnly = false;
              estadoInput.readOnly = false;
              
            } else {
              alert("CEP não encontrado. Por favor, digite os dados de endereço manualmente.");
               // Garante que os campos fiquem editáveis se o CEP falhar
              ruaInput.readOnly = false;
              bairroInput.readOnly = false;
              cidadeInput.readOnly = false;
              estadoInput.readOnly = false;
            }
          } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            alert("Ocorreu um erro ao buscar o CEP. Tente novamente ou digite o endereço manualmente.");
          }
        }
      });
    }
  
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        // Objeto 'necessidade' atualizado para incluir o número
        const necessidade = {
          instituicao: form.instituicao.value,
          tipoAjuda: form.tipoAjuda.value,
          titulo: form.titulo.value,
          descricao: form.descricao.value,
          cep: form.cep.value,
          rua: form.rua.value,
          numero: form.numero.value, // CAMPO ADICIONADO AQUI
          bairro: form.bairro.value,
          cidade: form.cidade.value,
          estado: form.estado.value,
          contato: form.contato.value,
        };
  
        const lista = JSON.parse(localStorage.getItem("necessidades") || "[]");
        lista.push(necessidade);
        localStorage.setItem("necessidades", JSON.stringify(lista));
  
        alert("Necessidade cadastrada com sucesso!");
        form.reset();
      });
    }
  
    // Lógica da Listagem de Necessidades (Página de Necessidades)
    const listaDiv = document.getElementById("lista");
    if (listaDiv) {
      const dados = JSON.parse(localStorage.getItem("necessidades") || "[]");
  
      const render = () => {
        const filtro = document.getElementById("filtro").value.toLowerCase();
        const busca = document.getElementById("pesquisa").value.toLowerCase();
        listaDiv.innerHTML = "";
  
        dados
          .filter(item =>
            (!filtro || item.tipoAjuda.toLowerCase() === filtro) &&
            (item.titulo.toLowerCase().includes(busca) || item.descricao.toLowerCase().includes(busca))
          )
          .forEach((item) => {
            const card = document.createElement("div");
            card.className = "card";
            // Renderização do card atualizada para incluir o número
            card.innerHTML = `
              <h3>${item.titulo}</h3>
              <p><strong>Instituição:</strong> ${item.instituicao}</p>
              <p><strong>Tipo:</strong> ${item.tipoAjuda}</p>
              <p><strong>Descrição:</strong> ${item.descricao}</p>
              <p><strong>Contato:</strong> ${item.contato}</p>
              <p><strong>Endereço:</strong> ${item.rua}, nº ${item.numero}, ${item.bairro}, ${item.cidade} - ${item.estado}</p>
            `;
            listaDiv.appendChild(card);
          });
      };
  
      document.getElementById("filtro").addEventListener("change", render);
      document.getElementById("pesquisa").addEventListener("input", render);
      render();
    }
  });