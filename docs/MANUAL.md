# Manual · Solarviews & Galaxy Graphics Engine

Criado por [Marcius Monteiro](https://marciusm.com) · [← voltar à apresentação](../README.md)

Este é o manual completo: cada aba, camada, atalho e detalhe de funcionamento. Para uma visão geral, com imagens e vídeos, veja o [README](../README.md).

Motor de gráficos generativos em camadas cujo tema é o sistema solar: Sol, planetas, luas, céu e galáxia, cada um em sua camada, movidos pelos dados ao vivo do servidor local (posições dos planetas do JPL Horizons, clima espacial do NOAA SWPC) e pelo relógio real (céu, fases e luas calculados para o instante de agora). O tempo das animações é musical (BPM e compassos, loop que fecha sem corte) e tudo é reproduzível pela semente.

Um arquivo só, sem dependências: abra `index.html` no Firefox, no Chrome ou no Edge. Com o servidor rodando (`node server.js`, dentro desta pasta), a ferramenta também abre em `http://localhost:3000/`; é por esse endereço que o Firefox libera controladores MIDI. Dados ao vivo: com o servidor, planetas do JPL Horizons e clima do NOAA; sem ele, o motor lê o NOAA direto pela internet e calcula os planetas por elementos orbitais; sem internet, usa valores típicos. Há também um modo de demonstração com valores simulados.

O projeto, a música e as mídias ficam guardados no navegador, separados por endereço: o que está salvo abrindo o arquivo direto não aparece em `http://localhost:3000/`, e o contrário também vale. Para levar de um para o outro, use SALVAR JSON e ABRIR JSON (aba PROJETO) e escolha a música de novo.

## Camadas

| Família | Camada | O que mostra | O que a move |
|---|---|---|---|
| Sol | Coroa | disco com granulação e grão de filme, manchas com penumbra, e em volta um analisador de espectro circular: barras segmentadas com pico retido, anéis de marcação tracejados girando, faíscas | nível das barras = ruído lento + rápido (andando em círculos para o loop fechar) + beat + áudio por setor; vento solar sobe a base, raios-X sobem o alcance e o clarão |
| Sol | Esfera de pontos | cúpula de pontos em filotaxia, respiração, varredura | raios-X, densidade do vento |
| Sol | Vento solar | partículas em espirais de Parker | velocidade, densidade, temperatura, Bz |
| Planetas | Órbitas | os 8 planetas em escala logarítmica, rastros | posições reais do Horizons; "dias por segundo" acelera a partir delas |
| Planetas | Cometa | cometa em órbita excêntrica em volta do Sol (lei de Kepler: lento longe, rápido no periélio), cauda de íons reta para longe do Sol, cauda de poeira curva para trás da órbita, coma e jatos no beat | vento solar no comprimento e na ondulação da cauda de íons; Bz bem para o sul solta um pedaço dela (desconexão); grave na coma |
| Planetas | Magnetosfera e aurora | linhas de campo comprimidas no lado do Sol, onda de choque, oval auroral | pressão do vento, Bz (cor), Kp (tamanho) |
| Luas | Luas | Terra, Marte, Júpiter, Saturno, Urano ou Netuno com suas luas: lado noturno, fase da Lua, anéis de Saturno girando, anéis finos de Urano com o eixo deitado, Tritão em órbita retrógrada, rastros, varredura de radar e pulso no beat | efemérides da Lua e das galileanas; período real das outras |
| Céu | Estrelas, Via Láctea e astros | céu do observador: 80 estrelas com nome, fundo com Via Láctea, horizonte, eclíptica, Sol, Lua com fase e planetas | hora sideral real, latitude e longitude, posições do Horizons, cintilação pelo Kp |
| Céu | Galáxia espiral | braços, núcleo, poeira, inclinação | rotação em ciclos do loop; núcleo pulsa com os raios-X |
| Heliosfera | Campo magnético | linhas de corrente do campo interplanetário | Bt na torção |
| Heliosfera | Ondas de plasma | interferência de ondas com fontes nos planetas | posições reais, Bt |
| Mídia | Imagem ou vídeo | um arquivo seu (PNG, JPG, MP4, WebM…), com encaixe, máscara de círculo ou esfera, cor da paleta, brilho, contraste | reação opcional a beat, grave, raios-X, vento, Kp ou Bz sul; vídeo segue o relógio do motor |
| Instrumentos | Fundo, HUD, log e telemetria, clima espacial, alvos, grade e réguas, evento, texto, pós | a camada de leitura | tokens de dados, gatilhos por Kp, raios-X, Bz sul e vento |

Cada camada tem opacidade, modo de mistura, cor por chave da paleta ou hex, e um ganho "Dados ao vivo" (0 desliga, 1 padrão, até 3 exagera).

## Composições de exemplo

| Composição | O que mostra |
|---|---|
| SISTEMA SOLAR | planetas orbitando (25 dias por segundo, loop fechado), rastros longos, ondas do Sol no beat, câmera inclinada girando, magnetosfera, alvos, log e clima |
| SOL | coroa em espectro circular com esfera de pontos, vento solar e evento por raios-X |
| LUAS | Terra e Júpiter lado a lado com suas luas, tempo acelerado, rastros e varredura |
| CÉU AGORA | o céu sobre São Paulo em perspectiva (cúpula inclinada, borda de baixo perto), girando devagar, com meteoros e varredura de radar |
| GALÁXIA | espiral com núcleo pulsando com os raios-X |
| HELIOSFERA | campo magnético e ondas de plasma entre os planetas, em movimento calmo |
| AURORA | magnetosfera da Terra em close, paleta elétrica, evento por Bz sul |
| TERRA E LUA | a Lua com a fase de agora, em mono, câmera inclinada girando |
| JÚPITER | as galileanas em escala, aceleradas, câmera inclinada girando, paleta solar |
| SATURNO | anéis girando e luas aceleradas, câmera inclinada girando, paleta industrial |
| TEMPESTADE SOLAR | Sol na borda, vento denso, paleta alarme, evento por vento |
| ÓRBITAS INCLINADAS | o sistema visto de fora da eclíptica com a câmera girando uma volta por loop |
| PLANETÁRIO | o céu em perspectiva girando a 30 minutos por segundo, com grade de altitude |
| NASCER DO SOL | coroa em escala subindo pela borda inferior, tipografia grande |
| MARTE | Marte em linhas (calotas, regiões escuras, Valles Marineris, Olympus Mons e os vulcões de Tharsis, Hellas e Argyre) com Fobos e Deimos |
| NETUNO | Netuno com faixas e a Grande Mancha Escura, Proteu, Tritão em órbita retrógrada e Nereida |
| COMETA | um cometa passando pelo periélio, com as duas caudas, sobre o vento solar ao vivo |

Cada composição pode ter paleta própria (campo `palette`) e câmera própria (`cam`). Duplique uma e troque camadas. Composições novas de exemplo entram sozinhas em projetos já salvos, uma vez; as que você apagar não voltam.

## Fonte

A interface e os textos desenhados (HUD, log, telemetria, clima, rótulos) usam a IBM Plex Mono, carregada da pasta `font/` ao lado do `index.html` (Light, Regular e Bold; licença SIL Open Font License, em `font/OFL.txt`). Se ela não estiver lá, o motor tenta `../font/` (a pasta de fontes do Solarviews) e, por fim, volta para a fonte mono do sistema. Pesos intermediários pedidos pelas camadas (500, 600, 800) usam o Regular ou o Bold mais próximo.

## Uso

- Esquerda: composições e camadas. Clique numa camada para editar à direita: o painel abre sozinho na aba CAMADA, mesmo se outra aba estiver na frente.
- Câmera: arraste na vista para girar (horizontal) e inclinar (vertical); a roda do mouse dá zoom; o botão RECENTRALIZAR, na aba Projeto, zera a câmera (nem duplo clique nem tecla mexem nela, para não zerar sem querer). Shift + arrastar move a camada selecionada (Shift + duplo clique devolve a camada ao centro). Os valores, e um giro automático em voltas por 16 s (8 compassos a 120 BPM; arredondado a voltas inteiras por loop, então o vídeo fecha), ficam na aba Projeto, por composição.
- Modo MOVER (botão MOVER no cabeçalho ou tecla V; V ou Esc sai): mexe nas camadas direto na prancheta. Passar o mouse mostra uma caixa tracejada com o nome do que está embaixo; clicar seleciona a camada (abre a aba CAMADA) e a contorna em verde; arrastar move. O centro do elemento gruda no meio e nos terços da prancheta (aparece uma guia magenta; Alt solta das guias) e Shift trava o movimento na horizontal ou na vertical. A roda do mouse ou arrastar um dos cantos verdes muda o tamanho; as setas movem 1 px (Shift: 10 px); Shift + duplo clique volta à posição original. Onde há elementos sobrepostos ganha a caixa menor; um clique parado no mesmo ponto pega a camada de baixo (de novo, a próxima). Movem: Sol (coroa e esfera de pontos), órbitas, luas, cometa, céu, galáxia, mídia, texto, clima espacial, a telemetria e o log (cada um com posição própria: "Telemetria X/Y" e "Log X/Y", deslocamentos a partir do lugar de sempre) e o bloco do título do HUD ("Título X/Y"). A magnetosfera move quando não há camada de órbitas ("Centro X/Y (sem órbitas)"); com órbitas ela fica no planeta. Fundo, grade, alvos, campo, ondas, vento, evento e pós ocupam a tela inteira ou seguem outras camadas e não têm caixa. Nas camadas que seguem a câmera como um plano (céu, mídia com "Seguir a câmera"), o arraste desfaz a rotação e a inclinação, então o elemento acompanha o mouse. O contorno e as guias são desenhados só na vista: nunca na janela de saída, no PNG ou nos vídeos. No vertical, como sempre, o que muda vale só para o vertical. Cada arraste é um passo do ⌘Z.
- Mídia: escolha "Imagem ou vídeo" em ADICIONAR e clique em ESCOLHER…, ou solte o arquivo direto na vista.
- Abas à direita, em duas linhas: CAMADA, PROJETO (tela, câmera, tempo, dados ao vivo, semente, arquivo), CORES (paleta e paleta reativa), MÚSICA (faixa e corte), CENAS (cenas na música e diretor automático), AO VIVO, MIDI e EXPORTAR.
- Ajuda nas abas: o (?) ao lado do nome de cada seção abre um balão com a explicação de como ela funciona; clicar fora ou Esc fecha. Os painéis mostram só os controles e os textos de estado.
- Exportar: **MP4** (H.264 + AAC, pronto para Instagram), PNG, sequência PNG em ZIP (`ffmpeg -framerate 30 -i %05d.png -c:v libx264 -pix_fmt yuv420p loop.mp4`) ou WebM de rascunho. JSON para levar o projeto.
- MP4: aba EXPORTAR, seção VÍDEO MP4. O motor renderiza quadro a quadro (sem perder quadros, mais rápido que o tempo real) e codifica no próprio navegador com WebCodecs; o contêiner MP4 é montado no próprio index.html, sem bibliotecas. Formatos: projeto atual, Instagram Reels/Stories 9:16 (1080×1920), feed 4:5 (1080×1350), quadrado 1:1 (1080×1080), Full HD 16:9 e 4K. Formatos diferentes do projeto usam o layout correspondente (o vertical aplica os ajustes de vertical); VER ESTE FORMATO NA VISTA troca a tela do projeto para conferir. Duração em loops (fecham sem emenda), em segundos ou a música inteira. Qualidade Alta/Média/Leve (≈0,2/0,1/0,05 bit por pixel; 1080×1920 em Alta ≈ 12 Mbps). A música entra em AAC 48 kHz estéreo, a partir do início configurado na aba Música. Precisa de Chrome, Edge ou Safari recentes. No Chrome o áudio sai em AAC. O Firefox não codifica AAC: com música, o painel mostra a escolha "Sem AAC, salvar": **MP4 com áudio Opus** (padrão; toca no Mac, no iPhone, no Chrome e no Firefox) ou **.MOV** com áudio PCM 16 bits sem compressão (o formato do iPhone, aceito em qualquer rede). Testado: MP4 e MOV abrem no Chrome e são decodificados inteiros pelo AVFoundation da Apple.
- ÁUDIO liga o microfone (graves, médios, agudos e ataques nos parâmetros "Reação a...").
- Música: na aba MÚSICA, escolha um arquivo (MP3, WAV, OGG, M4A…) ou solte um áudio na vista. A faixa é analisada de uma vez (30 leituras por segundo: graves, médios, agudos, energia e ataques), então a reação vale ao vivo, no scrub e na exportação quadro a quadro. A música tem play e pause próprios, independentes da animação (botão na aba Música, botão ao lado do gráfico no rodapé do visor, ou tecla M); a animação continua rodando e, com a música pausada, ela deixa de reagir. Espaço pausa só a animação. A exportação em sequência usa o tempo da animação mais o início configurado; o WebM sai com a faixa tocando do início. Há ganho, corte (início e fim), BPM estimado por autocorrelação dos ataques (botão USAR) e som ligado ou desligado. O arquivo fica no navegador, como a mídia; o JSON leva só a referência. Com uma música carregada, o rodapé do visor mostra um gráfico só de leitura (forma de onda, ataques, marcas do loop e cursor); clique ou arraste nele para ir a um ponto da faixa. Ele é desenhado no visor da janela e nunca entra no PNG, na sequência ou no WebM; some no modo "só a vista" e pode ser desligado na aba Música.
- Corte da música: no gráfico do visor, as duas alças (amarelas quando há corte) marcam onde o áudio começa e onde termina; arraste-as, ou use Shift+arrastar para desenhar um trecho novo. As teclas [ e ] marcam início e fim na posição do cursor, e a seção CORTE da aba MÚSICA tem os campos em segundos, os botões AQUI, SEM CORTE e OUVIR O TRECHO. Para tirar o corte e voltar à faixa inteira: o ✕ SEM CORTE no rodapé do gráfico, a tecla X, Alt+clique numa alça ou o botão SEM CORTE. Fora do trecho o gráfico escurece. A música toca em loop só dentro do trecho: o play parte do início do corte quando o cursor está fora dele (dentro, continua de onde parou), e uma busca para fora do trecho durante a reprodução volta ao início do corte; a reação e a paleta reativa seguem o mesmo tempo, e as exportações começam no início do corte. No MP4, a duração "Trecho da música" usa exatamente o corte; com loops mais longos que o corte, o áudio repete o trecho (sem passar do fim). Escolher outra música zera o corte. Com "Loop segue a música" (Projeto → TEMPO, ligado por padrão), o loop da animação tem o tamanho do trecho cortado, ou da faixa inteira sem corte, e anda junto com a música: o quadro 0 é o início do trecho, a barra de quadros embaixo move a música e a animação só repete quando a música volta ao início do trecho. Sem música carregada, valem BPM e compassos. Com a exportação MP4 em "Duração: Segundos", o trecho fica travado nesse tamanho (por exemplo 60 s): as alças passam a mover a janela inteira, para escolher qual parte da música entra no vídeo; mudar os segundos redimensiona o trecho na hora. Se a música for mais curta que a duração pedida, o trecho é a faixa inteira.
- Data do projeto: a linha de data (aba Projeto, usada pelo HUD) é automática e mostra a data de hoje da máquina em DD.MM.AA, virando o dia sozinha. Digitar no campo troca por um texto livre (fica salvo); o botão USAR A DATA DE HOJE volta ao automático. A camada HUD ainda pode ter a própria linha de data, que tem prioridade.
- Cenas na música: na aba CENAS, ou na faixa no topo do gráfico do visor. Cada cena marca em que ponto da música entra qual composição: escolha a composição na lista e aperte N (ou dê duplo clique na faixa). Cada cena tem transição (fusão, corte seco, pelo preto, flash, glitch, varredura, íris, zoom ou deslize) e duração; a primeira não tem. Cada cena também pode ter um movimento de câmera (aproximar, afastar, girar para um lado ou para o outro, subir, descer ou deriva) que anda ao longo dela, suave no começo e no fim, somado à câmera da composição. Clique no nome de uma cena na faixa para selecioná-la e aperte Delete para tirá-la. Na faixa, arraste a marca para mover a cena (gruda nos ataques da música; Shift solta) e Alt+clique remove. Tocando a música e nas exportações, a vista segue as cenas (a composição selecionada acompanha); com a música pausada, a vista mostra a composição selecionada para editar. O botão "Cenas na música" desliga tudo sem apagar.
- Desfazer e refazer: ⌘Z e ⇧⌘Z (ou os botões ↶ ↷ no cabeçalho), até 150 passos, para qualquer edição do projeto (camadas, parâmetros, composições, música, cenas, corte). Trocar a composição selecionada não conta como edição.
- Diretor automático (aba CENAS): acha as seções da música e monta um rascunho de cenas. O rascunho aparece num quadro verde na aba CENAS e na faixa do gráfico, e vale na vista enquanto existir: toque a música para ver o plano. Ajuste qualquer cena, tire as que não quiser (×, e + para pôr de volta) e aperte APLICAR, ou DESCARTAR para voltar às suas cenas de antes, que ficam guardadas até você aplicar. A análise guarda o espectro em 24 bandas; o diretor compara trechos de 0,5 s entre si (matriz de semelhança por cosseno) e acha as viradas pela curva de novidade (núcleo xadrez de Foote), ajustadas à grade de compassos (BPM afinado em passos de 0,05 e fase achada nos ataques; se o tempo forte não ficar claro, o ajuste é por tempo). Cada seção vira uma cena: a composição é escolhida pela intensidade do trecho (tabela por composição, barra visível no painel; composições novas são avaliadas pelas camadas), a transição pelo que o som faz na virada (subida forte com ataque = flash, subida forte sem ataque = glitch, subida moderada = zoom, queda forte = pelo preto, queda moderada = varredura, resto = fusão de 2 tempos), o movimento de câmera pela energia do trecho (calmo = deriva ou aproximar, médio = girar, subir ou descer, intenso = afastar ou girar; opção Câmera por cena) e a reação por cena multiplica grave, médio e agudo conforme a banda que domina o trecho (0,5× a 1,6×). Opções: Cortes (menos/normal/mais: seções de no mínimo 12/8/5 s), Transições (pelo som, só fusão, só corte), Reação por cena e as composições que entram. Determinístico: a mesma faixa dá o mesmo plano. Aplicar substitui as cenas atuais (⌘Z desfaz); o texto de status mostra o plano com horário, composição e transição de cada cena, e as fichas das composições mostram quantas cenas cada uma ganhou. Se a análise não tiver o espectro (música analisada por uma versão antiga), o diretor reanalisa a faixa sozinho.
- Globos (camada Luas e magnetosfera): Terra, Júpiter, Saturno e Lua são esferas em projeção ortográfica, com a latitude do observador vinda da câmera (vista de cima = polo; inclinada = bandas e anéis abrem), sombreado de limbo e lado noturno com terminador curvo pela posição real do Sol. Terra: continentes em pontos (mapa de 1° gerado de polígonos grosseiros, embutido), grade de 30°, atmosfera e, à noite, luzes das cidades; gira com o tempo sideral, então o lado do dia é o de agora. Júpiter: zonas e cintas com bordas onduladas e a Grande Mancha, girando em 9,9 h. Saturno: cintas suaves e anéis C, B, divisão de Cassini, A, Encke e F, com sulcos, a sombra do planeta sobre os anéis e a metade da frente passando sobre o disco. Lua: fase vista da Terra, mares e crateras (Tycho com raios) no lado voltado para a Terra. Parâmetros novos da camada Luas: Tamanho do planeta, Tamanho das luas e Relevo do globo.
- Traço dos globos: por padrão em linhas (contorno do disco, terminador com hachura no lado da noite, costas dos continentes, grade, bordas das faixas, Grande Mancha, elipses dos anéis com a sombra do planeta como falha nas linhas, mares e crateras em contorno); o parâmetro Traço = preenchido dá a versão sombreada.
- Animações: Luas ganhou ondas que saem do planeta no beat e crescem com o grave (Ondas no grave) e raios pontilhados até cada lua; Galáxia ganhou cintilação por estrela, onda de densidade que corre pelos braços e reação (grave abre o núcleo, agudo acende as estrelas); Heliosfera (campo) ganhou turbulência periódica (o campo deriva num círculo e fecha o loop) e espessura pelo grave; Aurora ganhou cortina de raios em volta do polo (tremula por estrela de raio, cresce com o Kp e com o ataque da música; aparece fraca mesmo com Kp zero) e ondulação das linhas de campo com o vento. Tudo com ciclos inteiros por loop, então o vídeo continua fechando sem corte.
- Velocidade das animações: como o loop pode durar a música inteira, nada mais é "por loop". Giro da câmera, varreduras e giro de mídia são em voltas por 16 s; cintilação, ondas, turbulência e cortina têm períodos fixos em segundos (4 a 18 s), sempre arredondados a ciclos inteiros por loop.
- Título e telemetria (aba PROJETO): por padrão, "Telemetria no topo": a telemetria fica no canto de cima à esquerda, com o log logo abaixo, e o título do HUD (nome, subtítulo e estado dos dados) vai para onde a telemetria ficava, embaixo à direita (no vertical, em cima à direita, abaixo do relógio). "Título no topo" volta ao arranjo antigo. Vale para todas as composições.
- Glitch (camada Pós): o glitch é de transmissão corrompida, como o sinal de uma sonda chegando com falhas. No começo dos beats (sempre no tempo forte; nos outros, pela probabilidade), blocos quadrados da grade pulam de lugar ou viram pixels grandes, e alguns ganham uma marca de erro com código (ERR, CRC, PKT 23% PERDIDO…). Estilos: sinal (blocos + separação de cor no tempo forte, o padrão), blocos, anéis (faixas circulares em volta do centro da composição giram, sem mexer nos textos dos cantos), cor (o vermelho anda para um lado, verde e azul para o outro, com a imagem rolando) ou desligado. Também há força, quantidade de blocos, marcas de erro e salto de quadro. A transição de cena Glitch usa os mesmos blocos: a composição que sai se desfaz na grade.
- Faixa do áudio por camada: nas camadas que reagem ao som (fundo, pós, Sol, esfera de pontos, órbitas, magnetosfera, luas, galáxia, campo, ondas, mídia e cometa), o painel CAMADA tem "Faixa do áudio" e "Ganho do áudio". "Padrão da camada" mantém as faixas que ela já usa nos parâmetros de reação; graves, médios, agudos, ataques ou energia trocam todas elas pela faixa escolhida (por exemplo, a aurora nos agudos e o Sol nos graves), e "Não reage" desliga o som naquela camada. O medidor logo abaixo mostra grave, médio, agudo, ataque e energia de agora, com a faixa escolhida acesa.
- Aba AO VIVO: tudo para tocar ao vivo.
  - Janela de saída: abre uma janela só com a prancheta, sem a interface, para arrastar ao projetor ou à segunda tela; duplo clique (ou F) nela põe em tela cheia, o cursor some sozinho e as teclas da ferramenta funcionam nela. O laço de desenho roda pela janela que estiver visível, então a saída não congela se a janela principal ficar escondida.
  - Troca de composição: as teclas 1 a 9 e os pads MIDI trocam com a transição escolhida (qualquer uma das de cena), com duração em tempos, na hora, no próximo tempo ou no próximo compasso (a composição na fila pisca na lista). Clicar na lista troca na hora, para editar. Com as cenas da música tocando, são elas que mandam.
  - Mestre e blackout (tecla B): escurecem só a vista e a janela de saída, com meio segundo de fade; o vídeo exportado não muda.
  - Alertas de clima espacial: quando um dado real passa do limite (Kp, classe de raios-X, Bz sul, velocidade do vento, cada um com seu limite ou desligado), a prancheta treme, dá um clarão, pisca uma moldura e mostra uma faixa com o aviso e os valores por alguns segundos (duração, tremor e cor ajustáveis). Enquanto o dado continuar acima do limite, o aviso volta no intervalo escolhido; vários ao mesmo tempo entram em fila. TESTAR ALERTA mostra um na hora. Só aparece na vista e na janela de saída (e no PNG), nunca nas exportações de vídeo quadro a quadro. Disparam com dados ao vivo ou na demonstração, que tem uma tempestade a cada 5 minutos.
  - Desempenho: qualidade da prévia automática, 100%, 75% ou 50%. Na automática, a vista e a janela de saída desenham em resolução menor quando um quadro passa do tempo dele e voltam quando sobra folga; exportações e PNG saem sempre em 100%. O painel mostra o tempo do quadro, quantos quadros por segundo estão sendo desenhados e as camadas mais pesadas; a lista de camadas à esquerda mostra o tempo de cada uma (em laranja as que passam de 40% do tempo do quadro). Uma camada que dá erro ganha um ⚠ na lista, com a mensagem ao passar o mouse.
- Aba MIDI: LIGAR MIDI e depois APRENDER: clique no que quer comandar (um parâmetro numérico, liga/desliga ou de lista na aba CAMADA, a opacidade de uma camada, uma composição na lista à esquerda ou uma ação: TAP, PLAY/PAUSA, MÚSICA, BLACKOUT, ANTERIOR, PRÓXIMA, MESTRE, ALERTA) e mova o knob ou aperte o pad. PADS → COMPOSIÇÕES liga o primeiro pad apertado e os seguintes às composições 1, 2, 3… Knob em parâmetro vai do mínimo ao máximo; pad em liga/desliga alterna; pad em parâmetro numérico leva ao máximo enquanto estiver apertado. A lista mostra cada ligação (com ×) e a última mensagem recebida; Esc sai do modo aprender. No Firefox, o MIDI só existe com a ferramenta aberta por `http://localhost:3000/` (com o servidor rodando) e pede permissão do site na primeira vez; aberta como arquivo, use o Chrome.
- Fonte dos dados (aba PROJETO, DADOS AO VIVO): automática (o servidor local; se ele não responder, o NOAA direto), só o servidor, NOAA direto ou demonstração. O código `{SRC}` e os rótulos das camadas dizem de onde vem cada coisa (AO VIVO, DEMO ou TÍPICO; JPL HORIZONS ou ELEMENTOS ORBITAIS).
- Zoom da prancheta: botões − e + no cabeçalho (ao lado de FIT e 100%), ⌘− e ⌘+ (⌘0 volta a FIT); a porcentagem aparece no rodapé da vista. É só a vista: não muda o vídeo exportado.
- Paleta reativa: na aba CORES, seção PALETA REATIVA. **Troca nos ataques** muda para outra paleta da seleção a cada batida forte (sensibilidade e intervalo mínimo controlam a frequência); **Segue a energia** coloca os trechos calmos nas paletas do começo da lista (MONO, PADRÃO, ORGÂNICO…) e os intensos nas do fim (SOLAR, INDUSTRIAL, ALARME). Escolha quais paletas entram clicando nelas (PAPEL, de fundo claro, vem desligada), a duração da transição e se o fundo também troca. As trocas são calculadas uma vez a partir da análise da faixa, então a mesma cor cai no mesmo instante ao vivo, no scrub e na exportação; com a música pausada a paleta fica parada. A faixa colorida no topo do gráfico do visor mostra a cor de cada trecho. Sem música, com o microfone ligado, as trocas seguem o som ao vivo.

| Tecla | Ação |
|---|---|
| Espaço | toca e pausa a animação |
| M | toca e pausa só a música |
| ← → | um quadro (Shift: dez) |
| 0 | volta ao início |
| 1 a 9 | troca a composição, com a transição da aba AO VIVO |
| B | blackout da vista e da janela de saída |
| Delete | apaga a cena selecionada na faixa do gráfico |
| Esc | sai do modo aprender do MIDI e tira a seleção da cena |
| T | tap tempo (marca o BPM batendo; o botão TAP saiu do rodapé) |
| G | grade e área segura |
| Arrastar | gira e inclina a câmera |
| Roda | zoom da câmera |
| Shift + arrastar | move a camada selecionada |
| V | modo MOVER: clicar e arrastar as camadas na prancheta |
| MOVER: arrastar | move (gruda no centro e nos terços; Alt solta, Shift trava o eixo) |
| MOVER: roda ou cantos | mudam o tamanho |
| MOVER: ← → ↑ ↓ | movem 1 px (Shift: 10) |
| MOVER: clique parado de novo | pega a camada de baixo |
| MOVER: Shift + duplo clique | volta à posição original |
| H | só a vista |
| F | tela cheia |
| S | salva PNG |
| ? | ajuda |

URL: `?comp=4` abre a composição 4; `?clean` abre só a vista; `?cam=30,55,1.2` abre com a câmera girada 30°, inclinada 55° e zoom 1,2; `?lang=en` ou `?lang=pt` escolhe o idioma.

### Idioma

Os botões PT e EN, no topo e na tela de abertura, trocam o idioma da interface e dos textos desenhados na prancheta (HUD, telemetria, log, alertas, rótulos). Por isso a exportação de vídeo e de PNG sai no idioma escolhido. A escolha fica salva no navegador; na primeira abertura, vale o idioma do navegador.

O projeto não muda de idioma. As composições de exemplo continuam guardadas em português e são mostradas traduzidas. Nos campos de texto das camadas (telemetria, palavras, nomes), o texto padrão aparece traduzido; se você editar o campo, é o texto que você vê que fica salvo.

## Códigos de texto

A telemetria (camada Log e telemetria) e a camada Texto trocam `{CÓDIGO}` pelo valor do momento. O ícone `{ }` ao lado do nome do campo abre a lista completa num pop-up ao lado do painel, com o valor de agora de cada código (atualizado a cada meio segundo). Clicar num código o insere onde está o cursor; sem o cursor no campo, no fim do texto. O pop-up fica aberto para inserir vários, e dá para continuar digitando no campo enquanto isso; Esc, o ×, o próprio ícone ou um clique fora fecham. Linha começando com `*` sai na cor de destaque; na telemetria, o texto antes do primeiro espaço é o rótulo e o resto é o valor.

| Grupo | Códigos |
|---|---|
| Tempo | `{BPM}` `{BAR}` `{TIME}` `{LOOP}` `{FPS}` `{FRAME}` `{CLOCK}` `{DATE}` |
| Clima espacial (NOAA) | `{WIND}` `{DENS}` `{TEMP}` `{BT}` `{BZ}` `{BY}` `{KP}` `{KPTXT}` `{XRAY}` `{FLUX}` `{SAT}` `{UTC}` `{SRC}` |
| Projeto | `{NAME}` `{COMP}` `{SIZE}` `{SONG}` |
| Gerados | `{N}` `{CONF}` `{HASH}` |

Para criar um código novo, acrescente uma linha na tabela `TOKS` do index.html: ela alimenta a substituição e a lista do painel.

## Formato vertical

Ao escolher 1080×1920 (ou qualquer tela mais alta que larga), os textos e traços passam a ser medidos pela largura, com ganho de 25% para leitura em celular. Cada composição de exemplo tem um layout próprio para o vertical: a cena centrada no meio e maior, as duas luas de LUAS empilhadas, e o clima espacial em faixa de margem a margem na parte de baixo (quatro colunas: vento, campo, Kp e raios-X). A telemetria e o log partem do topo à esquerda e o título da direita, abaixo do relógio (com "Título no topo", o título fica à esquerda e a telemetria à direita); em cada composição eles foram arrumados em volta da cena com "Telemetria X/Y", "Log X/Y" e "Título X/Y", então em algumas descem para perto da faixa ou passam para o outro lado. A telemetria em cima e o clima em faixa também estão disponíveis em qualquer formato também estão disponíveis em qualquer formato: "Posição da telemetria" (embaixo ou em cima) na camada Log e telemetria, e "Disposição" (lista ou faixa) na camada Clima espacial.

Os ajustes do vertical ficam guardados à parte em cada camada. Enquanto a tela é vertical, tudo o que você muda no painel (ou arrastando) vale só para o vertical; ao voltar para 1920×1080 o horizontal está como era. "Restaurar vertical" apaga só os ajustes do vertical da camada. A URL aceita `?size=1080x1920` para abrir direto nesse formato.

## Câmera

A câmera vê o plano da eclíptica de fora, em projeção ortográfica. Cada tipo de camada reage de um jeito:

- Plano inteiro (vento solar, campo magnético, ondas, céu): a camada gira e deita como uma folha. No céu, os textos ficam sempre em pé: os nomes de estrelas, planetas e pontos cardeais acompanham os astros sem girar a letra, e a legenda de baixo (latitude, data, hora sideral) fica parada no canto, fora da câmera. O parâmetro "Legenda embaixo" da camada a desliga.
- Corpos (órbitas, coroa, esfera de pontos, luas, galáxia, magnetosfera): os pontos são projetados e os corpos continuam redondos. Nas órbitas, cada planeta sobe ou desce conforme a latitude eclíptica real, com um traço até o plano. Luas, galáxia, coroa e esfera giram em torno do próprio centro; o resto gira em torno do Sol.
- Instrumentos (HUD, log, clima, alvos, grade, texto, pós) ficam parados; os alvos acompanham os planetas na tela.
- Mídia: parada por padrão; ligue "Seguir a câmera" para que ela deite com o plano.

## Mídia

O arquivo fica guardado no próprio navegador (IndexedDB), não no projeto. O JSON exportado leva só a referência; em outro navegador ou computador a camada pede o arquivo de novo. Vídeos tocam e pausam com o motor, e na sequência PNG cada quadro é posicionado no tempo exato. "Ajustar ao loop" estica o vídeo para caber exatamente num loop. Vídeos HEVC (H.265, comuns no iPhone) podem não abrir no Chrome; use MP4 H.264 ou WebM. GIFs animados mostram só o primeiro quadro.

## Precisão

- Planetas: vetores do JPL Horizons via servidor local (exatos). Sem servidor, elementos keplerianos médios do JPL (E. M. Standish, os mesmos usados pelo servidor): conferidos contra o Horizons em 17/11/2026, a diferença ficou abaixo de meio grau, que é o movimento das horas entre as duas leituras. Com os dados desligados, órbitas procedurais marcadas com `*`.
- Céu: hora sideral e projeção estereográfica; catálogo de 80 estrelas brilhantes com coordenadas aproximadas (décimos de grau).
- Lua: longitude com os termos principais (erro de cerca de 1°). Luas galileanas: longitudes médias (configuração aproximada). Luas de Marte, Saturno, Urano e Netuno: período real (Tritão retrógrado), fase inicial sorteada pela semente (marcadas com `~`). Relevo de Marte e manchas de Netuno: desenho aproximado, não cartografia.
- Clima espacial: valores do NOAA normalizados (vento 250 a 900 km/s, densidade 0,5 a 30, Bt 0 a 25 nT, Bz −20 a +20, Kp 0 a 9, raios-X A a X).

## Estrutura do código

0. Idioma: um script à parte, antes do motor (entre os marcadores `i18n:início` e `i18n:fim`). O motor continua escrito em português; em inglês, essa camada traduz na exibição. Um `MutationObserver` traduz textos, dicas e campos da página e guarda o original para voltar ao português. `fillText`, `strokeText` e `measureText` traduzem o que vai para o canvas, e `scr` (o embaralhamento de letras) recebe o texto já traduzido. O dicionário fica em `UI_TXT` (frases da interface) e `PH_TXT` (vocabulário da prancheta, trocado palavra por palavra mantendo as colunas do log), uma entrada por linha no formato `português ⇒ inglês`; as frases com valores no meio ficam em `PAT`. Para traduzir um texto novo, acrescente uma linha. `I18N.set('en')` troca pelo console.
1. Utilidades, tempo musical, paletas.
2. Câmera (`camMake`, `CAM`, `camP`) e dados ao vivo: `dataFetch`, `dataValues` (entra no quadro como `F.d`), `solarBodies`, `solarScreen` (`pos` no plano, `scr` na tela).
3. Camadas: `reg(tipo, rótulo, parâmetros, desenho, {cam})`; cada desenho recebe o contexto 2D e `R = {p, F, W, H, u, comp, pal}`. `cam:'plane'` recebe a transformação da câmera no canvas, `cam:'own'` projeta por conta própria com `CAM.at(x, y).P(...)`, sem `cam` a camada fica parada.
4. Astronomia: `jdFrame`, `gmst`, `eclToEq`, `moonNow`, `helio`, `skyBodies`, `skyProj`, `STARS`, `drawMoon`.
5. Mídia: `MEDIA`, IndexedDB (`mdbReq`), `mediaPick`, `mediaKeep` (sincroniza o vídeo), `mediaSeek` (exportação).
5b. Música: `SONG`, `songAnalyse` (FFT própria, 2048 pontos), `songValues` (bandas por tempo), `songApply` (entra em `F.a`, somada ao microfone pelo máximo), `songKeep` (o áudio é o relógio mestre quando toca), `songPanel`. MP4: `exportMp4` (VideoEncoder H.264 + `mp4Audio` com AudioEncoder AAC), `mp4Build` (caixas ftyp/moov/mdat, blocos de ~1 s intercalados, moov antes do mdat), `mp4Panel`. Paleta reativa: `palPlan` (lista de trocas por tempo, a partir dos ataques ou da energia suavizada), `palAuto` (aplicada em `render` sobre `palOf`, com transição por `palMix`), `palPanel`.
6. Projeto, motor de render, interface, áudio, exportação. O render (`render`) despacha para `renderComp` ou para `trDraw` (transições entre duas composições), com `rSize` (qualidade da prévia) e `bandF` (faixa do áudio por camada); o laço `rafLoop` chama `tick`, que só desenha quando o quadro muda, quando algo é editado ou uma vez por segundo.
7. Ao vivo: `liveGo`/`liveSwitch` (troca com transição e fila no tempo), `alertCheck`/`alertFire`/`alertDraw`, janela de saída (`outOpen`, `outDraw`), MIDI (`midiOn`, `midiMsg`, `midiBind`, `midiDo`, mapa em `P.midi.map`), `renderLive` (aba AO VIVO), `perfUpdate` (medidor).
8. Fontes de dados: `dataFetch` (automática, servidor, NOAA direto ou demonstração), `noaaState`, `demoState`, `keplerBodies`. Cenas: `sceneArr` (cenas do projeto ou rascunho do diretor em `ST.draft`), `draftApply`, `draftDrop`, `mvAt` (movimento de câmera por cena).
9. Modo MOVER: com `MV.on`, o `renderComp` da composição atual abre um registro por camada (`HCUR`) e cada desenho anota a caixa do que desenhou: `hbR` (retângulo no espaço local, pela transformação atual do canvas), `hbE` (elipse na tela) ou a função `hb` da camada (camadas espaciais, calculada do centro e do raio já com a câmera). As caixas ficam em `HIT` (por camada, em frações da tela) com as chaves de posição e tamanho de `MVK` e, nas camadas que seguem a câmera como plano, a matriz `J` (`camJ`), invertida no arraste (`jinv`, `mvApply`). `mvHits` acha o que está sob o ponto (a menor caixa primeiro), `mvSnap` as guias, `mvDraw` desenha o contorno no `blit`, depois da prancheta.

Por que um arquivo só: assim a ferramenta abre com duplo clique e vai para outra máquina copiando a pasta. Separar em vários arquivos ajudaria a manutenção, mas não muda nada para quem usa.

Para criar uma camada: um `reg(...)` novo e uma entrada em `FAMILIES`. Para ela entrar no modo MOVER: uma entrada em `MVK` com as chaves de posição e tamanho e uma chamada a `hbR` no desenho (ou uma função `hb`).
