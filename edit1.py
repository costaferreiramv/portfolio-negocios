import re
D='/tmp/pn-cond/src/content/imoveis/'
E={
'casa-4-quartos-the-palms':('The Palms','Casa de 4 quartos no Condomínio The Palms',[
 ("Casa de dois pavimentos em condomínio fechado na Zona Sul de Uberlândia — com segurança reforçada e infraestrutura de lazer completa.","Casa de dois pavimentos no Condomínio The Palms, na Zona Sul de Uberlândia, com segurança reforçada e infraestrutura de lazer completa.")]),
'casa-condominio-fechado-ca4342':('Jardins Roma','Casa de 4 suítes com home cine e piscina aquecida no Condomínio Jardins Roma',[
 ("Casa de altíssimo padrão em condomínio fechado na Zona Sul","Casa de altíssimo padrão no Condomínio Jardins Roma, na Zona Sul"),
 ("- Condomínio fechado de alto padrão, com segurança","- Condomínio Jardins Roma, de alto padrão, com segurança")]),
'casa-condominio-fechado-ca5527':('Residencial Village Unique','Sobrado de 3 quartos com lazer completo no Condomínio Residencial Village Unique',[
 ("Sobrado em condomínio fechado, próximo ao Praia Clube, com localização de fácil acesso, três quartos, suíte com sacada e área de lazer completa — conforto, praticidade e segurança para a família.","Sobrado no Condomínio Residencial Village Unique, próximo ao Praia Clube, com localização de fácil acesso, três quartos, suíte com sacada e área de lazer completa: conforto, praticidade e segurança para a família."),
 ("área construída em condomínio fechado","área construída no Condomínio Residencial Village Unique")]),
'casa-condominio-fechado-ca5607':('Jardins Gênova','Casa de 4 vagas com varanda gourmet no Condomínio Jardins Gênova',[
 ("Casa em um dos condomínios mais completos e exclusivos da Zona Sul de Uberlândia,","Casa no Condomínio Jardins Gênova, um dos condomínios mais completos e exclusivos da Zona Sul de Uberlândia,")]),
'casa-condominio-fechado-ca5415':('Royal Park','Casa de 3 suítes com piscina e spa no Condomínio Royal Park',[
 ("Casa em condomínio fechado de alto padrão na Zona Sul","Casa no Condomínio Royal Park, de alto padrão, na Zona Sul"),
 ("- Condomínio fechado, com segurança e exclusividade","- Condomínio Royal Park, com segurança e exclusividade")]),
'casa-condominio-fechado-ca6296':('Cyrela Buritis','Casa de esquina com piscina aquecida e energia fotovoltaica no Condomínio Cyrela Buritis',[
 ("Casa de esquina em um dos condomínios mais prestigiosos da Zona Sul","Casa de esquina no Condomínio Cyrela Buritis, um dos condomínios mais prestigiosos da Zona Sul")]),
'casa-condominio-fechado-ca6353':('Park Sul','Casa térrea com fachada imponente no Condomínio Park Sul',[
 ("em condomínio fechado na Zona Sul de Uberlândia — ao lado do Parque Una,","no Condomínio Park Sul, na Zona Sul de Uberlândia, ao lado do Parque Una,")]),
'casa-condominio-fechado-ca6244':('Splêndido','Casa mobiliada de arquitetura contemporânea com piscina e solarium no Condomínio Splêndido',[
 ("Casa de arquitetura contemporânea em condomínio fechado na Zona Sul","Casa de arquitetura contemporânea no Condomínio Splêndido, na Zona Sul"),
 ("- Condomínio fechado com infraestrutura","- Condomínio Splêndido com infraestrutura")]),
'casa-condominio-fechado-ca6498':('Jardins Barcelona','Sobrado de 4 suítes com piscina aquecida e home cinema no Condomínio Jardins Barcelona',[
 ("Espetacular sobrado em condomínio de altíssimo padrão na Zona Sul","Espetacular sobrado no Condomínio Jardins Barcelona, de altíssimo padrão, na Zona Sul"),
 ("- Condomínio com quadra de tênis","- Condomínio Jardins Barcelona com quadra de tênis")]),
'casa-condominio-fechado-ca6509':('Jardins Gênova','Casa térrea com home office e cozinha gourmet no Condomínio Jardins Gênova',[
 ("Casa térrea em condomínio de altíssimo padrão na Zona Sul","Casa térrea no Condomínio Jardins Gênova, de altíssimo padrão, na Zona Sul")]),
'casa-condominio-fechado-ca6536':('Village Karaíba','Sobrado de alto padrão com 3 suítes no Condomínio Village Karaíba',[
 ("Sobrado de alto padrão em condomínio fechado na Zona Sul","Sobrado de alto padrão no Condomínio Village Karaíba, na Zona Sul"),
 ("dentro do condomínio, com forte","dentro do Condomínio Village Karaíba, com forte")]),
'casa-condominio-fechado-ca6600':('Villa do Sol','Sobrado de 3 suítes com piscina aquecida e área gourmet no Condomínio Villa do Sol',[
 ("Sobrado de altíssimo padrão em um dos condomínios mais tradicionais e valorizados da Zona Sul","Sobrado de altíssimo padrão no Condomínio Villa do Sol, um dos condomínios mais tradicionais e valorizados da Zona Sul")]),
'casa-condominio-fechado-ca6715':('Splêndido','Casa de 3 suítes com piscina e espaço gourmet no Condomínio Splêndido',[
 ("Casa de alto padrão em condomínio fechado nobre e seguro na Zona Sul","Casa de alto padrão no Condomínio Splêndido, nobre e seguro, na Zona Sul"),
 ("## Diferenciais do condomínio","## Diferenciais do Condomínio Splêndido")]),
'casa-condominio-fechado-ca6780':('Jardins Roma','Sobrado de alto padrão com 5 suítes e piscina aquecida no Condomínio Jardins Roma',[
 ("Sobrado amplo de alto padrão em condomínio fechado na Zona Sul","Sobrado amplo de alto padrão no Condomínio Jardins Roma, na Zona Sul"),
 ("- Sobrado de alto padrão em condomínio fechado","- Sobrado de alto padrão no Condomínio Jardins Roma"),
 ("- Condomínio com estrutura de lazer","- Condomínio Jardins Roma com estrutura de lazer")]),
'casa-condominio-fechado-ca6762':('Tamboré','Casa térrea com 3 suítes, piscina e fundo para área verde no Condomínio Tamboré',[
 ("Casa térrea de alto padrão em condomínio fechado na Zona Sul","Casa térrea de alto padrão no Condomínio Tamboré, na Zona Sul"),
 ("áreas mais nobres do condomínio,","áreas mais nobres do Condomínio Tamboré,"),
 ("- Condomínio fechado com estrutura","- Condomínio Tamboré com estrutura")]),
'casa-condominio-fechado-ca6785':('The Palms','Casa de 2 pavimentos com 4 quartos e área gourmet no Condomínio The Palms',[
 ("Casa de dois pavimentos em condomínio fechado, com arquitetura","Casa de dois pavimentos no Condomínio The Palms, com arquitetura"),
 ("de dois pavimentos em condomínio fechado\n","de dois pavimentos no Condomínio The Palms\n")]),
'lote-condominio-fechado-te4399':('Splêndido','Lote de 360 m² no Condomínio Splêndido',[
 ("Lote de 360 m² em um dos condomínios fechados mais valorizados e desejados da Zona Sul","Lote de 360 m² no Condomínio Splêndido, um dos condomínios mais valorizados e desejados da Zona Sul"),
 ("dentro do condomínio\n","dentro do Condomínio Splêndido\n")]),
}
for slug,(nome,tit,reps) in E.items():
    p=D+slug+'.md'; t=open(p,encoding='utf-8').read()
    t,n=re.subn(r'^titulo: .*$','titulo: '+tit,t,count=1,flags=re.M); assert n==1
    if 'condominio: true\n' in t: t=t.replace('condominio: true\n','condominio: true\nnomeCondominio: '+nome+'\n',1)
    else: t=t.replace('eixo: horizontais\n','eixo: horizontais\nnomeCondominio: '+nome+'\n',1)
    for o,nw in reps:
        assert t.count(o)==1,(slug,o)
        t=t.replace(o,nw)
    open(p,'w',encoding='utf-8').write(t)
print('ok')
