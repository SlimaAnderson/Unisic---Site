document.addEventListener('DOMContentLoaded', (event) => {
    // 1. Define o URL do feed RSS para uma fonte alternativa e estável.
    const RSS_URL = 'https://www.bleepingcomputer.com/feed/'; 
    
    // 2. Sua API Key real.
    const API_KEY = 'qmazrtpdsjr6k1s5n3bvq5qafgexi9p2y8lj32tr';

    // 3. Define a URL da API, agora com sua chave.
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&api_key=${API_KEY}`;

    const newsContainer = document.querySelector('#plans .row.flat'); 

    if (!newsContainer) {
        console.error("Erro: O contêiner de notícias (#plans .row.flat) não foi encontrado no HTML.");
        return; 
    }
    
    // Função para formatar a data
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }

    // Função para remover tags HTML do texto (alguns feeds incluem HTML no resumo)
    function stripHtml(html) {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    }

    // 4. Função principal para buscar e exibir as notícias
    async function fetchNews() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                // Se a API retornar um erro (como 422, 500, etc.), o script vai para o catch.
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Limpa o conteúdo
            newsContainer.innerHTML = '';
            
            // Garantindo que haja itens e que o status seja OK
            if (data.status !== 'ok' || !data.items || data.items.length === 0) {
                 throw new Error("Resposta da API inválida ou feed vazio.");
            }

            const itemsToDisplay = data.items.slice(0, 4); 

            itemsToDisplay.forEach(item => {
                // Puxa o resumo, limpa tags HTML e limita o tamanho
                const description = stripHtml(item.description).substring(0, 150) + '...';
                
                const newsItemHTML = `
                    <div class="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                        <div class="news-item">
                            <h4>${item.title}</h4>
                            <p>${description}</p>
                            <a href="${item.link}" target="_blank" class="btn btn-primary btn-sm">Leia Mais</a>
                            <p class="text-muted"><small>Publicado em: ${formatDate(item.pubDate)}</small></p>
                        </div>
                    </div>
                `;
                newsContainer.innerHTML += newsItemHTML;
            });

        } catch (error) {
            console.error("Erro ao buscar as notícias:", error);
            // Mensagem amigável de erro
            newsContainer.innerHTML = '<p class="text-center col-xs-12">❌ Não foi possível carregar o feed de notícias. Verifique se o feed RSS de origem está correto.</p>';
        }
    }

    // Executa a função
    fetchNews();
});