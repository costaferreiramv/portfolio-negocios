---
titulo: "Context rot: por que o Claude fica lento e confuso depois de meia hora"
autor: "@ericluciano"
url: https://www.instagram.com/reel/DYxZ4sAxuTL/
tipo: reel
temas: [ia-automacao, gestao]
tags: [claude, contexto, compactacao, token, sessao-longa, custo]
duracao: "1min18"
data_post: 2026-05-30
processado_em: 2026-07-30
status: completo
---

## Resumo

Reel que explica por que sessão longa fica cara e ruim: a cada nova mensagem o modelo relê
a conversa inteira desde o início, então o custo não é linear, é composto. O autor cita a
medição de um desenvolvedor: numa conversa de 100 mensagens, **98,5% dos tokens** foram
gastos apenas relendo histórico.

Junto com o custo, cai a qualidade — a precisão de recuperação de informação cairia de 92%
para 78% com a janela cheia. O fenômeno é chamado de **context rot**.

Três correções: compactar manualmente antes que o modelo compacte sozinho, descartar
tentativa errada em vez de mandar "tenta de novo", e mandar pergunta rápida por um canal
que não fica no histórico principal.

## Pontos-chave

- A cada mensagem, o modelo relê a conversa desde o começo — custo composto, não linear.
- Medição citada: em 100 mensagens, 98,5% dos tokens foram só releitura de histórico.
- Queda de qualidade junto: precisão de recuperação de 92% → 78% com a janela cheia.
- Nome do fenômeno: **context rot** — "como se o cérebro do modelo fosse cansando".
- **Hack 1 — compactação manual a ~60% da janela.** Antes que ele compacte sozinho, pedir:
  "me dá um resumo completo de tudo que fizemos e o status atual". Copiar o resumo, limpar
  a sessão, colar e continuar. Reseta sem perder contexto.
- **Hack 2 — descartar a tentativa errada** em vez de mandar "tenta de novo", para o erro
  não contaminar o resto da conversa.
- **Hack 3 — canal separado para pergunta rápida** que não precisa ficar no histórico
  principal.

## Conteúdo integral

### Transcrição do vídeo

Você já notou que o Claude começa inteligente e depois de meia hora de conversa vai ficando
lento, confuso e estourando o limite? Tem um motivo e quase ninguém te conta. Cada vez que
você manda uma mensagem nova, o Claude relê toda a conversa desde o início. Mensagem 1,
resposta. Mensagem 2, resposta. Até a sua pergunta atual. O custo não é linear, é composto.
Um desenvolvedor mediu numa conversa de 100 mensagens que 98,5% dos tokens foram gastos só
relendo o histórico. Você tá pagando o Claude pra reler ele mesmo. Pior: a performance cai
junto. A precisão de recuperação de informação cai de 92% para 78% quando você enche a
janela. Isso chama context rot. É como se o cérebro do modelo fosse se cansando. A solução
que mudou o jogo aqui pra mim: quando a conversa fica longa, antes de o Claude compactar
sozinho, peça pra ele: "me dá um resumo completo de tudo que fizemos e o status atual".
Copia o resumo, [limpa a sessão], cola e continua. Você reseta a sessão sem perder o
contexto. E outras duas dicas que valem ouro. [Descarte a tentativa errada]: quando ele
erra, em vez de mandar "tenta de novo", você descarta a tentativa errada antes que ela
contamine o resto. E [um canal à parte] pra perguntas rápidas que não precisam ficar no
histórico principal. Salva esse vídeo pra usar amanhã e me segue pra mais hacks assim de IA
que ninguém te conta.

### Legenda

Você já notou que o Claude começa inteligente e depois de meia hora fica lento, confuso e estourando o limite?

Tem um motivo, e quase ninguém te conta.

Cada mensagem nova, ele relê toda a conversa desde o início.

Mensagem 1, resposta, mensagem 2, resposta… até a sua pergunta atual. O custo não é linear — é composto.

Um dev mediu: em conversa de 100 mensagens, 98,5% dos tokens foram gastos só relendo histórico.

Pior: a performance cai junto. A precisão de recuperação cai de 92% pra 78% quando você enche a janela. Chama "context rot" — é como se o cérebro do modelo fosse cansando.

3 hacks que mudam o jogo:

1️⃣ Compactação manual a 60% da janela. Antes que ele compacte sozinho, peça: "me […]

## Aplicação

**Descreve exatamente o que acontece nas sessões longas desta operação** — publicação de
imóvel, quinzena de conteúdo, e esta própria extração da biblioteca.

**O que já é feito e o que falta:**
- O log de sessão em `logs/` do vault (comando `/salvar`) já cumpre parte do hack 1: registra
  o que foi feito, as decisões e as pendências. Usar isso deliberadamente para reiniciar
  sessão longa, em vez de só arquivar.
- O `CLAUDE.md` e as memórias do projeto reduzem o custo de recomeçar — o contexto estável
  não precisa ser reexplicado.
- **O que falta é o hábito**: pedir o resumo e reiniciar *antes* de a janela encher, em vez
  de arrastar a sessão até ficar lenta.

**Combina com o post do @99hud:** lá, cache barateia o contexto estável; aqui, compactação
evita que o contexto instável cresça sem limite. As duas coisas atacam o mesmo problema por
lados diferentes.

**Ressalva sobre os números:** "98,5% dos tokens" e "92% → 78%" vêm de medição de terceiro
citada sem fonte no vídeo. A direção do efeito é conhecida e real; os números específicos
não estão verificados aqui.

**Detalhe de execução:** os atalhos citados no vídeo são de uma versão específica da
ferramenta e mudam com o tempo. O princípio (compactar cedo, descartar erro, separar
pergunta rápida) é o que vale guardar.

## Conexões

- [99hud-5-ajustes-para-rodar-opus-5-o-dia-inteiro.md](99hud-5-ajustes-para-rodar-opus-5-o-dia-inteiro.md) — mesma frente: custo de sessão longa.
- [manualdedonos-6-sacadas-claude-code.md](manualdedonos-6-sacadas-claude-code.md) — o CLAUDE.md e o /memory reduzem o contexto que precisa ser reexplicado.
- [thaleslaray-cortar-custos-claude-modelo-hibrido.md](thaleslaray-cortar-custos-claude-modelo-hibrido.md) — cache por auxiliar evita pagar duas vezes pelo mesmo contexto.
