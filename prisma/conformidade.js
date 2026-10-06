// Nomes genéricos e descrições neutras dos manipulados do catálogo de
// exemplo. Proposta de 23/09/2026, A VALIDAR PELO FARMACÊUTICO RESPONSÁVEL
// antes de o site ir ao ar.
//
// Por quê: manipulado não pode ser exposto ao público como produto de
// prateleira (RDC 67/2007, item 5.14; caso PHARMES na RE nº 3.547/2026).
// Então o nome sai da marca de fantasia e passa a ser a composição, e a
// descrição diz o que é, sem promessa de efeito ou resultado.
//
// A chave é o nome ANTIGO. Usado por scripts/aplicar-conformidade.js
// (banco que já existe) e por prisma/seed.js (banco novo).
//
//   ativo: false  -> sai do site. Produto sem composição definida, em
//                    que o próprio nome era a promessa, ou combo.
//   fotoUrl       -> troca a foto de pote com marca no rótulo por uma
//                    ilustração neutra. A foto original continua em
//                    public/uploads/, para o caso de o farmacêutico
//                    classificar o item como industrializado.
//
// 05/10/2026, a pedido do cliente: os 10 produtos que têm foto da linha
// Viver Bem voltam com o nome do pote e a foto (sem preço no site; o
// pedido vai pelo carrinho e o farmacêutico passa o valor no WhatsApp).
// Ficam só com a descrição neutra daqui. Risco registrado com o cliente:
// nome de fantasia de manipulado é o caso da RE nº 3.547/2026.

module.exports = {
  // --- Dermatologia & Estética ---
  "Creme Facial Ácido Hialurônico": {
    nome: "Creme facial com ácido hialurônico",
    descricao: "Creme facial com ácido hialurônico, manipulado conforme a prescrição.",
  },
  "Sérum Vitamina C 10%": {
    nome: "Sérum com vitamina C",
    descricao: "Sérum facial com vitamina C, na concentração indicada na prescrição.",
  },
  "Gel Redutor de Medidas": {
    nome: "Gel corporal",
    descricao: "Gel de uso corporal, manipulado com os ativos indicados na prescrição.",
  },
  "Glow Cream": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao:
      "Creme facial com ceramida, niacinamida e ácido hialurônico, manipulado conforme a prescrição.",
  },
  "Firm Defense Serum": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao:
      "Sérum facial com ceramidas e Centella asiatica, manipulado conforme a prescrição.",
  },
  "ZincBlock FPS": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao:
      "Fotoprotetor com óxido de zinco e dióxido de titânio, manipulado conforme a prescrição.",
  },
  "Bastão Clareador": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao:
      "Bastão de uso tópico com vitamina C e manteigas vegetais, manipulado conforme a prescrição.",
  },
  "Pó Finalizador FPB 20": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao: "Pó facial com sílica e óxidos minerais, manipulado conforme a prescrição.",
  },
  "Protetor Solar Facial FPS 50": {
    nome: "Protetor solar facial",
    descricao: "Fotoprotetor facial manipulado conforme a prescrição.",
  },
  "Creme Ácido Retinoico": {
    nome: "Creme com ácido retinoico",
    descricao: "Creme com ácido retinoico, na concentração indicada na prescrição.",
  },

  // --- Vitaminas & Suplementos ---
  "Colágeno Verisol® 30 doses": {
    nome: "Colágeno hidrolisado (Verisol®)",
    descricao: "Colágeno hidrolisado em peptídeos, na dose indicada na prescrição.",
  },
  "Vitamina D3": {
    nome: "Vitamina D3",
    descricao: "Vitamina D3 em cápsulas, na dose indicada na prescrição.",
  },
  "Polivitamínico Energia 30 doses": {
    nome: "Polivitamínico",
    descricao: "Vitaminas e minerais em cápsulas, na composição indicada na prescrição.",
  },
  "Fórmula Sono Reparador": {
    nome: "Fórmula com melatonina, triptofano e magnésio",
    descricao:
      "Cápsulas com melatonina, triptofano, magnésio quelado e vitamina B6, manipuladas conforme a prescrição.",
    fotoUrl: "/uploads/capsulas.svg",
  },
  "CitoRepair™ 2.0": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao:
      "Cápsulas com espermidina, resveratrol, precursores de NAD+ e coenzima Q10, manipuladas conforme a prescrição.",
  },
  "Ômega 3 Viver Bem": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao: "Óleo de peixe concentrado em cápsulas, com EPA e DHA, na dose indicada na prescrição.",
  },
  VitaFlex: {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao:
      "Cápsulas com curcumina, colágeno tipo II, ácido hialurônico, magnésio e vitaminas C, D e K, manipuladas conforme a prescrição.",
  },
  "Creatina Gummy": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao: "Creatina monoidratada em gomas, na dose indicada na prescrição.",
  },
  "Caramelo de Creatina": {
    // com foto: fica o nome do pote e a foto original (05/10/2026)
    descricao:
      "Creatina monoidratada em caramelos com farinha de amêndoa, na dose indicada na prescrição.",
  },
  "Composto Emagrecedor": {
    nome: "Fórmula em cápsulas",
    descricao: "Fórmula em cápsulas preparada com os ativos e as doses indicados na prescrição.",
    fotoUrl: "/uploads/capsulas.svg",
    ativo: false,
  },
  "Ômega 3 Concentrado": {
    nome: "Ômega 3 concentrado",
    descricao: "EPA e DHA em cápsulas, na dose indicada na prescrição.",
  },
  "Magnésio Dimalato": {
    nome: "Magnésio dimalato",
    descricao: "Magnésio dimalato em cápsulas, na dose indicada na prescrição.",
  },
  "Creatina Monohidratada": {
    nome: "Creatina monoidratada",
    descricao: "Creatina monoidratada, na dose indicada na prescrição.",
  },
  "Coenzima Q10": {
    nome: "Coenzima Q10",
    descricao: "Coenzima Q10 em cápsulas, na dose indicada na prescrição.",
  },

  // --- Cabelos & Unhas ---
  "Loção Capilar Minoxidil": {
    nome: "Loção capilar com minoxidil",
    descricao: "Loção capilar com minoxidil, na concentração indicada na prescrição.",
  },
  "Cápsulas Cabelos & Unhas Fortes": {
    nome: "Cápsulas com biotina e silício orgânico",
    descricao:
      "Cápsulas com biotina, silício orgânico e outros nutrientes, manipuladas conforme a prescrição.",
  },
  "Shampoo Antiqueda": {
    nome: "Shampoo manipulado",
    descricao: "Shampoo com os ativos indicados na prescrição.",
  },

  // --- Saúde da Mulher ---
  "Composto Feminino Equilíbrio": {
    nome: "Composto feminino",
    descricao: "Composto em cápsulas preparado conforme a prescrição.",
    ativo: false,
  },
  Cranberry: {
    nome: "Cranberry em cápsulas",
    descricao: "Extrato de cranberry em cápsulas, na dose indicada na prescrição.",
  },
  "Colágeno + Ácido Hialurônico": {
    nome: "Colágeno com ácido hialurônico",
    descricao:
      "Colágeno e ácido hialurônico em pó para dissolver, na dose indicada na prescrição.",
  },

  // --- Saúde do Homem ---
  "Composto Masculino Vigor": {
    nome: "Composto masculino",
    descricao: "Composto em cápsulas preparado conforme a prescrição.",
    ativo: false,
  },
  "Saw Palmetto": {
    nome: "Saw palmetto em cápsulas",
    descricao: "Extrato de saw palmetto em cápsulas, na dose indicada na prescrição.",
  },
  "Testoviver Homem 45+": {
    nome: "Fórmula com zinco, maca peruana e tribulus",
    descricao:
      "Cápsulas com zinco, maca peruana e tribulus, manipuladas conforme a prescrição.",
  },

  // --- Homeopatia & Florais ---
  "Floral Tranquilidade 30ml": {
    nome: "Floral manipulado",
    descricao: "Composição floral preparada conforme a prescrição. Uso sublingual.",
  },
  "Homeopatia Personalizada": {
    nome: "Homeopatia personalizada",
    descricao: "Medicamento homeopático preparado conforme a receita do prescritor.",
  },

  // --- Combos: promoção de manipulado não pode, então saem do site ---
  "Combo Pele Radiante": { ativo: false },
  "Combo Cabelos Fortes": { ativo: false },
  "Combo Imunidade em Dia": { ativo: false },
};
