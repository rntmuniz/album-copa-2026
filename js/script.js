const TOTAL_FIGURINHAS = 980;

let modoEdicao = false;
let figurinhaAtual = null;
let figurinhaDivAtual = null;

const grupos = {
    "A": ["México", "África do Sul", "Coreia do Sul", "República Tcheca"],
    "B": ["Canadá", "Bósnia e Herzegovina", "Catar", "Suíça"],
    "C": ["Brasil", "Marrocos", "Haiti", "Escócia"],
    "D": ["Estados Unidos", "Paraguai", "Austrália", "Turquia"],
    "E": ["Alemanha", "Curaçau", "Costa do Marfim", "Equador"],
    "F": ["Holanda", "Japão", "Suécia", "Tunísia"],
    "G": ["Bélgica", "Egito", "Irã", "Nova Zelândia"],
    "H": ["Espanha", "Cabo Verde", "Arábia Saudita", "Uruguai"],
    "I": ["França", "Senegal", "Iraque", "Noruega"],
    "J": ["Argentina", "Argélia", "Áustria", "Jordânia"],
    "K": ["Portugal", "RD Congo", "Uzbequistão", "Colômbia"],
    "L": ["Inglaterra", "Croácia", "Gana", "Panamá"]
};

function carregarSelecoesCombo() {

    const combo =
        document.getElementById(
            "selectSelecao"
        );

    if (!combo) return;

    combo.innerHTML = "";

    Object.values(grupos)
        .flat()
        .sort()
        .forEach(selecao => {

            combo.innerHTML += `
                <option value="${selecao}">
                    ${selecao}
                </option>
            `;
        });
}

const bandeiras = {
    "México": "mx",
    "África do Sul": "za",
    "Coreia do Sul": "kr",
    "República Tcheca": "cz",

    "Canadá": "ca",
    "Bósnia e Herzegovina": "ba",
    "Catar": "qa",
    "Suíça": "ch",

    "Brasil": "br",
    "Marrocos": "ma",
    "Haiti": "ht",
    "Escócia": "gb-sct",

    "Estados Unidos": "us",
    "Paraguai": "py",
    "Austrália": "au",
    "Turquia": "tr",

    "Alemanha": "de",
    "Curaçau": "cw",
    "Costa do Marfim": "ci",
    "Equador": "ec",

    "Holanda": "nl",
    "Japão": "jp",
    "Suécia": "se",
    "Tunísia": "tn",

    "Bélgica": "be",
    "Egito": "eg",
    "Irã": "ir",
    "Nova Zelândia": "nz",

    "Espanha": "es",
    "Cabo Verde": "cv",
    "Arábia Saudita": "sa",
    "Uruguai": "uy",

    "França": "fr",
    "Senegal": "sn",
    "Iraque": "iq",
    "Noruega": "no",

    "Argentina": "ar",
    "Argélia": "dz",
    "Áustria": "at",
    "Jordânia": "jo",

    "Portugal": "pt",
    "RD Congo": "cd",
    "Uzbequistão": "uz",
    "Colômbia": "co",

    "Inglaterra": "gb-eng",
    "Croácia": "hr",
    "Gana": "gh",
    "Panamá": "pa"
};

function paraExpoente(numero) {

    const mapa = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹'
    };

    return String(numero)
        .split('')
        .map(n => mapa[n])
        .join('');
}

// ----

const container = document.getElementById("container");

function criarFigurinha(id, texto) {

    const div = document.createElement("div");

    div.className = "fig";
    div.innerText = texto;

    if (localStorage.getItem(id) === "1") {
        div.classList.add("colada");
    }

    div.addEventListener("contextmenu", (e) => {

        e.preventDefault();

        if (!modoEdicao) {

             mostrarAvisoBloqueado(div);

            return;
        }

        figurinhaAtual = id;
        figurinhaDivAtual = div;

        const qtd =
            Number(
                localStorage.getItem(
                    `${id}-rep`
                )
            ) || 0;

        document.getElementById(
            "tituloRepetida"
        ).innerText = texto;

        document.getElementById(
            "qtdRep"
        ).innerText = qtd;

        const menu =
            document.getElementById(
                "menuRepetidas"
            );

        menu.style.left =
            e.pageX + "px";

        menu.style.top =
            e.pageY + "px";

        menu.style.display =
            "block";
    });

    // Carrega repetidas ao abrir a página
    atualizarVisualRepetida(div, id);

    // Clique normal = colar/descolar
    div.addEventListener("click", () => {

        if (!modoEdicao) {

            mostrarAvisoBloqueado(div);

            return;
        }

        const repetidas =
            Number(
                localStorage.getItem(
                    `${id}-rep`
                )
            ) || 0;

        if (repetidas > 0) {

            div.classList.add("shake");

            setTimeout(() => {

                div.classList.remove("shake");

            }, 300);

            return;
        }

        if (div.classList.contains("colada")) {

            div.classList.remove("colada");

            localStorage.removeItem(id);

        } else {

            div.classList.add("colada");

            localStorage.setItem(id, "1");
        }

        atualizarTotal();
    });

    return div;
}

// =====================================
// ADICIONAR REPETIDA
// =====================================

document
    .getElementById("addRep")
    .addEventListener("click", () => {

        let qtd =
            Number(
                localStorage.getItem(
                    `${figurinhaAtual}-rep`
                )
            ) || 0;

        qtd++;

        localStorage.setItem(
            `${figurinhaAtual}-rep`,
            qtd
        );

        // Se existe repetida, necessariamente
        // a figurinha está colada
        localStorage.setItem(
            figurinhaAtual,
            "1"
        );

        figurinhaDivAtual.classList.add(
            "colada"
        );

        document.getElementById(
            "qtdRep"
        ).innerText = qtd;

        atualizarVisualRepetida(
            figurinhaDivAtual,
            figurinhaAtual
        );

        atualizarListaRepetidas();

        atualizarTotal();

        document.getElementById(
            "menuRepetidas"
        ).style.display = "none";

    });


// =====================================
// REMOVER REPETIDA
// =====================================

document
    .getElementById("removeRep")
    .addEventListener("click", () => {

        let qtd =
            Number(
                localStorage.getItem(
                    `${figurinhaAtual}-rep`
                )
            ) || 0;

        if (qtd > 0) {

            qtd--;

            if (qtd === 0) {

                localStorage.removeItem(
                    `${figurinhaAtual}-rep`
                );

            } else {

                localStorage.setItem(
                    `${figurinhaAtual}-rep`,
                    qtd
                );
            }
        }

        document.getElementById(
            "qtdRep"
        ).innerText = qtd;

        atualizarVisualRepetida(
            figurinhaDivAtual,
            figurinhaAtual
        );

        atualizarListaRepetidas();

        atualizarTotal();

        document.getElementById(
            "menuRepetidas"
        ).style.display = "none";
    });

// =====================================
// FECHAR MENU DE REPETIDAS
// =====================================

document.addEventListener("click", (e) => {

    const menu =
        document.getElementById(
            "menuRepetidas"
        );

    if (
        menu.style.display === "block" &&
        !menu.contains(e.target)
    ) {

        menu.style.display = "none";
    }
});


// =====================================
// ATUALIZA VISUAL DAS REPETIDAS
// =====================================


function atualizarVisualRepetida(div, id) {

    const qtd =
        Number(
            localStorage.getItem(
                `${id}-rep`
            )
        ) || 0;

    div.classList.remove("repetida");

    div.querySelectorAll(".expoente")
        .forEach(el => el.remove());

    if (qtd > 0) {

        // repetida sempre deve estar colada
        div.classList.add("colada");
        div.classList.add("repetida");

        const expoente =
            document.createElement("span");

        expoente.className =
            "expoente";

        expoente.textContent =
            paraExpoente(qtd);

        div.appendChild(expoente);

    } else {

        div.classList.remove("repetida");
    }
}

for (const grupo in grupos) {

    const bloco = document.createElement("div");

    bloco.className = "grupo";

    bloco.innerHTML = `<h2>Grupo ${grupo}</h2>`;

    grupos[grupo].forEach(selecao => {

        const selecaoDiv = document.createElement("div");

        selecaoDiv.className = "selecao";

        const titulo = document.createElement("h3");

        titulo.innerHTML = `
            <img
                class="bandeira"
                src="https://flagcdn.com/${bandeiras[selecao]}.svg"
                alt="${selecao}"
                loading="lazy"
            >
            ${selecao}
        `;

        const progresso =
            document.createElement("div");

        progresso.className =
            "progressoSelecao";

        progresso.id =
            `progresso-${selecao}`;


        const figs = document.createElement("div");

        figs.className = "figurinhas";

        for (let i = 1; i <= 20; i++) {

            figs.appendChild(
                criarFigurinha(
                    `${selecao}-${i}`,
                    String(i).padStart(2, "0")
                )
            );
        }

        selecaoDiv.appendChild(titulo);

        selecaoDiv.appendChild(figs);

        selecaoDiv.appendChild(
            progresso
        );

        bloco.appendChild(selecaoDiv);
    });

    container.appendChild(bloco);
}

const especiais = document.getElementById("especiais");

const gradeEspeciais = document.createElement("div");

gradeEspeciais.className = "figurinhas";

for (let i = 0; i <= 19; i++) {

    const codigo = "FWC" + String(i).padStart(2, "0");

    gradeEspeciais.appendChild(
        criarFigurinha(
            codigo,
            codigo
        )
    );
}

especiais.appendChild(gradeEspeciais);

function atualizarTotal() {

    const total =
        document.querySelectorAll(".fig.colada")
            .length;

    document.getElementById("total")
        .innerText = total;

    document.getElementById("faltantes")
        .innerText =
        TOTAL_FIGURINHAS - total;

    atualizarRanking();
}

const busca = document.getElementById("busca");

if (busca) {

    busca.addEventListener("input", function () {

        const texto =
            this.value.trim().toLowerCase();

        document
            .querySelectorAll(".selecao")
            .forEach(selecao => {

                const nome =
                    selecao.querySelector("h3")
                        .innerText
                        .toLowerCase();

                selecao.style.display =
                    nome.includes(texto)
                        ? ""
                        : "none";
            });
    });
}

if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark");
}

const btnTema = document.getElementById("tema");

if (btnTema) {

    btnTema.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(
            "tema",
            document.body.classList.contains("dark")
                ? "dark"
                : "light"
        );
    });
}

function atualizarRanking() {

    const ranking =
        document.getElementById("rankingSelecoes");

    if (!ranking) return;

    ranking.innerHTML = "";

    let dados = [];

    Object.values(grupos)
        .flat()
        .forEach(selecao => {

            let total = 0;

            for (let i = 1; i <= 20; i++) {

                if (
                    localStorage.getItem(
                        `${selecao}-${i}`
                    ) === "1"
                ) {
                    total++;
                }
            }

            dados.push({
                selecao,
                total,
                percentual:
                    Math.round(
                        total * 100 / 20
                    )
            });
        });

    dados.sort(
        (a, b) =>
            b.percentual - a.percentual
    );

    ranking.innerHTML = "";

    dados.forEach(item => {

        ranking.innerHTML += `

        <div class="linhaRanking">

            <div class="cabecalho">

                <span>
                    ${item.selecao}
                </span>

                <span>
                    ${item.total}/20
                    (${item.percentual}%)
                </span>

            </div>

            <div class="barra">

                <div
                    class="barraInterna"
                    style="
                        width:
                        ${item.percentual}%;
                    ">
                </div>

            </div>

        </div>
        `;
    });

    atualizarEstatisticas(dados);
    atualizarContadoresSelecoes();
}

function atualizarEstatisticas(dados) {

    const div =
        document.getElementById(
            "estatisticasGerais"
        );

    if (!div) return;

    const melhor = dados[0];

    const pior =
        dados[dados.length - 1];

    const concluidas =
        dados.filter(
            d => d.percentual === 100
        ).length;

    const total =
        document
            .querySelectorAll(
                ".fig.colada"
            )
            .length;

    const percentualAlbum =
        Math.round(
            total * 100 /
            TOTAL_FIGURINHAS
        );

    div.innerHTML = `

        <div class="cardEstatistica">
            📕 Álbum:
            ${percentualAlbum}%
        </div>

        <div class="cardEstatistica">
            🥇 Melhor:
            ${melhor.selecao}
            (${melhor.percentual}%)
        </div>

        <div class="cardEstatistica">
            📉 Menor:
            ${pior.selecao}
            (${pior.percentual}%)
        </div>

        <div class="cardEstatistica">
            ✅ Seleções completas:
            ${concluidas}
        </div>

    `;
}

const btnEstatisticas =
    document.getElementById(
        "btnEstatisticas"
    );

if (btnEstatisticas) {

    btnEstatisticas
        .addEventListener("click", () => {

            atualizarRanking();

            const modal =
                new bootstrap.Modal(
                    document.getElementById(
                        "modalEstatisticas"
                    )
                );

            modal.show();
        });
}

function atualizarListaRepetidas() {

    const lista =
        document.getElementById(
            "listaRepetidas"
        );

    if (!lista) return;

    let html = "";

    Object.values(grupos)
        .flat()
        .forEach(selecao => {

            let itens = [];

            for (let i = 1; i <= 20; i++) {

                const qtd =
                    Number(
                        localStorage.getItem(
                            `${selecao}-${i}-rep`
                        )
                    ) || 0;

                if (qtd > 0) {

                    itens.push(
                        `${String(i).padStart(2, '0')}${paraExpoente(qtd)}`
                    );
                }
            }

            if (itens.length) {

                html += `
                    <div class="mb-3">

                        <h5>${selecao}</h5>

                        <div>
                            ${itens.join(" • ")}
                        </div>

                    </div>
                `;
            }
        });

    if (html === "") {

        html = `
            <div class="text-center p-4">

                <h5>
                    Nenhuma figurinha repetida
                </h5>

            </div>
        `;
    }

    lista.innerHTML = html;
}

const btnRepetidas =
    document.getElementById(
        "btnRepetidas"
    );

if (btnRepetidas) {

    btnRepetidas.addEventListener(
        "click",
        () => {

            atualizarListaRepetidas();

            const modal =
                new bootstrap.Modal(
                    document.getElementById(
                        "modalRepetidas"
                    )
                );

            modal.show();
        }
    );
}

function gerarListaTrocas() {

    let texto = "🤝 TENHO PARA TROCAR\n\n";

    Object.values(grupos)
        .flat()
        .forEach(selecao => {

            let itens = [];

            for (let i = 1; i <= 20; i++) {

                const qtd =
                    Number(
                        localStorage.getItem(
                            `${selecao}-${i}-rep`
                        )
                    ) || 0;

                if (qtd > 0) {

                    itens.push(
                        `${String(i).padStart(2, '0')} (+${qtd})`
                    );
                }
            }

            if (itens.length) {

                texto +=
                    `${selecao}\n`;

                texto +=
                    itens.join("\n");

                texto += "\n\n";
            }
        });

    texto +=
        "\n🔍 PROCURO\n\n";

    Object.values(grupos)
        .flat()
        .forEach(selecao => {

            let faltantes = [];

            for (let i = 1; i <= 20; i++) {

                if (
                    localStorage.getItem(
                        `${selecao}-${i}`
                    ) !== "1"
                ) {

                    faltantes.push(
                        String(i)
                            .padStart(2, '0')
                    );
                }
            }

            if (faltantes.length) {

                texto +=
                    `${selecao}\n`;

                texto +=
                    faltantes.join(" ");

                texto += "\n\n";
            }
        });

    return texto;
}

const btnTrocas =
    document.getElementById(
        "btnTrocas"
    );

if (btnTrocas) {

    btnTrocas.addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "listaTrocas"
                )
                .textContent =
                gerarListaTrocas();

            new bootstrap.Modal(
                document.getElementById(
                    "modalTrocas"
                )
            ).show();
        }
    );
}

const copiar =
    document.getElementById(
        "copiarTrocas"
    );

if (copiar) {

    copiar.addEventListener(
        "click",
        async () => {

            await navigator
                .clipboard
                .writeText(
                    gerarListaTrocas()
                );

            copiar.innerText =
                "Copiado!";

            setTimeout(() => {

                copiar.innerText =
                    "Copiar Lista";

            }, 2000);
        }
    );
}

const btnFerramentas =
    document.getElementById(
        "btnFerramentas"
    );

if (btnFerramentas) {

    btnFerramentas.addEventListener(
        "click",
        () => {

            new bootstrap.Modal(
                document.getElementById(
                    "modalFerramentas"
                )
            ).show();
        }
    );
}


const btnLimparRepetidas =
    document.getElementById(
        "btnLimparRepetidas"
    );

if (btnLimparRepetidas) {

    btnLimparRepetidas.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "Remover todas as repetidas?"
                )
            ) {
                return;
            }

            Object.keys(localStorage)
                .forEach(chave => {

                    if (
                        chave.endsWith(
                            "-rep"
                        )
                    ) {

                        localStorage.removeItem(
                            chave
                        );
                    }
                });

            location.reload();
        }
    );
}

// ----------------------------

const btnLimparSelecao =
    document.getElementById(
        "btnLimparSelecao"
    );

if (btnLimparSelecao) {

    btnLimparSelecao.addEventListener(
        "click",
        () => {

            const selecao =
                document.getElementById(
                    "selectSelecao"
                ).value;

            if (
                !confirm(
                    `Limpar todas as figurinhas da seleção ${selecao}?`
                )
            ) {
                return;
            }

            for (
                let i = 1;
                i <= 20;
                i++
            ) {

                localStorage.removeItem(
                    `${selecao}-${i}`
                );

                localStorage.removeItem(
                    `${selecao}-${i}-rep`
                );
            }

            location.reload();
        }
    );
}

// --------------------------------

const btnResetAlbum =
    document.getElementById(
        "btnResetAlbum"
    );

if (btnResetAlbum) {

    btnResetAlbum.addEventListener(
        "click",
        () => {

            if (
                !confirm(
                    "ATENÇÃO!\n\nApagar todo o álbum?"
                )
            ) {
                return;
            }

            localStorage.clear();

            location.reload();
        }
    );
}

// ---

const btnModoEdicao =
    document.getElementById(
        "btnModoEdicao"
    );

if (btnModoEdicao) {

    btnModoEdicao.addEventListener(
        "click",
        () => {

            modoEdicao = !modoEdicao;

            btnModoEdicao.innerHTML =
                modoEdicao
                    ? '<i class="fa-solid fa-lock-open"></i>'
                    : '<i class="fa-solid fa-lock"></i>';

            btnModoEdicao.style.background =
                modoEdicao
                    ? "#198754"
                    : "#ffc107";

            btnModoEdicao.title =
                modoEdicao
                    ? "Modo edição ativo"
                    : "Modo navegação";
        }
    );
}

// ---


// ----

function atualizarContadoresSelecoes() {

    Object.values(grupos)
        .flat()
        .forEach(selecao => {

            let coladas = 0;

            for (let i = 1; i <= 20; i++) {

                if (
                    localStorage.getItem(
                        `${selecao}-${i}`
                    ) === "1"
                ) {
                    coladas++;
                }
            }

            const faltantes =
                20 - coladas;

            const percentual =
                Math.round(
                    coladas * 100 / 20
                );

            const div =
                document.getElementById(
                    `progresso-${selecao}`
                );

            if (div) {

                div.innerHTML = `

                <div class="progress mb-1">

                    <div
                        class="progress-bar"
                        style="
                            width:${percentual}%;
                        ">

                        ${percentual}%

                    </div>

                </div>

                <small>

                    ${coladas}/20 coladas
                    •
                    ${faltantes} faltantes

                </small>
                `;
            }
        });
}

// ----

function mostrarAvisoBloqueado(div){

    const toast =
        new bootstrap.Toast(
            document.getElementById(
                "toastBloqueado"
            )
        );

    toast.show();

    div.classList.add("shake");

    setTimeout(() => {

        div.classList.remove("shake");

    }, 300);

    const btn =
        document.getElementById(
            "btnModoEdicao"
        );

    btn.classList.add("pulse");

    setTimeout(() => {

        btn.classList.remove("pulse");

    }, 2000);
}

// ---

carregarSelecoesCombo();

atualizarTotal();
