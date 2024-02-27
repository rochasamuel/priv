import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade",
};

export default function Privacy() {
  return (
    <div className="w-full flex flex-col gap-8 p-6">
      <div className="text-2xl font-bold mx-auto">Política de Privacidade</div>

      <div className="w-full flex flex-col gap-4">
        <div>
          Nosso objetivo é construir uma relação sólida e duradoura baseada na
          confiança, resguardando nossos usuários da melhor forma possível. Para
          nós é essencial respeitar a sua privacidade!
        </div>
        <div>
          A presente política de privacidade fornece uma visão geral da forma
          com a qual tratamos os seus dados pessoais.
        </div>
        <div>
          Lembre-se: Suas interações são fundamentais para que possamos oferecer
          serviços personalizados.
        </div>
        <div>
          Temos um canal específico para sanar dúvidas/preocupações e atender
          pedidos relacionados aos seus dados pessoais{" "}
          <Link
            className="underline text-secondary"
            href="mailto:contato@privatus.vip"
          >
            contato@privatus.vip
          </Link>
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          O que encontrará na presente política de privacidade?
        </div>
        <ul>
          <li>Quem somos?</li>
          <li>O que são dados pessoais?</li>
          <li>Quais dados coletamos?</li>
          <li>Como recolhemos ou recebemos os seus dados?</li>
          <li>Para que utilizamos?</li>
          <li>Com quem compartilhamos seus dados pessoais?</li>
          <li>Onde armazenamos os seus dados pessoais?</li>
          <li>Os meus dados pessoais estão seguros?</li>
          <li>Há transferência para outros países?</li>
          <li>Os seus direitos</li>
          <li>Contatos</li>
        </ul>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">Quem somos?</div>
        <div>
          Nós da Privatus somos os responsáveis por tomar as principais decisões
          em relação ao tratamento dos seus dados pessoais e cada decisão é
          tomada com a segurança necessária para que você tenha a melhor
          experiência do nosso serviço.
        </div>
      </div>

      <div className="text-2xl font-bold mx-auto">
        O que preciso saber antes de ler essa política?
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">O que são dados pessoais?</div>
        <div>
          “Dado pessoal” significa qualquer informação que possa identificá-lo
          seja diretamente (por exemplo, o seu nome ou apelido) ou indiretamente
          (por exemplo, dados apresentados sob um pseudónimo, tal como um número
          de identificação único).
        </div>
        <div>
          Lembre-se que antes de começar a utilizar qualquer dos nossos serviços
          ou funcionalidades, você deve ler esta Política, bem como os Termos de
          Uso.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Como recolhemos ou recebemos os seus dados?
        </div>
        <div>
          Podemos recolher ou receber os dados enviados através do nosso
          website, formulários ou outros. Às vezes você nos fornece diretamente
          (por exemplo, quando cria uma conta, quando entra em contato conosco
          quando insere dados na plataforma). Às vezes nós recolhemos esses
          dados (por exemplo: utilizando cookies para entender como utiliza o
          nosso website).
        </div>
        <div>
          Dependendo da finalidade para a qual os dados são utilizados, a
          hipótese legal para o tratamento dos seus dados pode ser:
        </div>
        <ul className="list-disc list-inside ml-4">
          <li>
            O seu <strong>consentimento;</strong>
          </li>
          <li>
            O nosso <strong>interesse legítimo</strong>, que pode consistir na:
          </li>
          <li>
            <strong>Melhoria dos nossos produtos e serviços:</strong> mais
            especificamente, o nosso interesse comercial em nos ajudar a
            compreender melhor as suas necessidades e expectativas e, portanto,
            a melhorar os nossos serviços
          </li>
          <li>
            <strong>Prevenção da fraude:</strong> para garantirmos que o
            pagamento foi concluído, sem fraude e sem apropriação indevida.
          </li>
          <li>
            <strong>Proteção das nossas ferramentas:</strong> manter as
            ferramentas usadas por você protegidas e seguras e para garantir que
            estão trabalhando de forma adequada e que estão continuamente a
            melhorar.
          </li>
          <li>
            <strong>Na execução de um contrato:</strong> mais especificamente na
            execução dos serviços que nos solicitou;
          </li>
          <li>
            <strong>Cumprimento das obrigações legais</strong> que envolvem o
            tratamento de dados pessoais.
          </li>
        </ul>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Quais dados pessoais coletamos:
        </div>
        <ul className="list-disc list-inside ml-4">
          <li>Nome Completo</li>
          <li>CPF</li>
          <li>RG</li>
          <li>End. Completo - (Cidade, Estado, CEP etc.)</li>
          <li>E-mail</li>
          <li>Data de nascimento</li>
          <li>Foto de rosto segurando o documento de identificação</li>
          <li>Foto do documento de identificação</li>
          <li>Redes sociais (Instagram, Facebook etc.)</li>
          <li>Telefone</li>
          <li>
            Dados bancários para pagamento (Banco, Agência, Conta corrente e
            chave PIX)
          </li>
          <li>
            Foto, vídeo, áudio e descrições publicadas pelo criador de conteúdo
          </li>
        </ul>

        <div className="opacity-70 italic">
          *Importante destacar que a Privatus resguarda o nome real do usuário,
          não sendo ele disponível ao público. Será visível apenas o nome de
          usuário escolhido para divulgação.
        </div>
        <div>
          <strong>Dados publicados pelo usuário.</strong> Qualquer informação
          que Usuários disponibilizarem em perfis publicamente disponíveis ou no
          Chat é de Sua própria responsabilidade. Você deve cuidadosamente
          considerar os riscos de fazer certas declarações ou publicar
          informações pessoais - especialmente informações como endereço ou
          localização precisa. A Privatus não tem responsabilidade por mensagens
          ou atos de terceiros que ocorram em decorrência da informação que você
          tornou publicamente disponível a terceiro ou que você compartilhou com
          qualquer pessoa ou com outro Usuário.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">Pra que utilizamos?</div>
        <ul className="list-disc list-inside ml-4">
          <li>Recolhemos dados quando eles são necessários para:</li>
          <li>
            Fornecer o serviço que solicitou (por exemplo tornando-se usuário da
            plataforma, liberando seu acesso e publicando seus conteúdos por
            meio dela); ou
          </li>
          <li>
            Respeitar os requisitos legais (por exemplo, emissão de nota
            fiscal).
          </li>
          <li>Criar e atualizar sua conta</li>
          <li>Personalizar sua conta e preferências</li>
          <li>
            Análise de dados e pesquisa para aprimorar produtos e serviços
          </li>
          <li>Comunicações</li>
          <li>Geração de produtos e estatísticas</li>
          <li>Responder às suas questões e interagir com você;</li>
          <li>Enviar comunicações de marketing personalizadas</li>
          <li>Proteger nossa plataforma e protegê-lo contra a fraude;</li>
          <li>Para gerenciar pagamentos feitos online</li>
          <li>Medir a satisfação</li>
        </ul>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Os meus dados pessoais estão seguros?
        </div>

        <div>
          A Privatus adota medidas de segurança, técnicas e administrativas para
          proteger os dados pessoais de acessos não autorizados e de situações
          acidentais ou ilícitas de destruição, perda, alteração, comunicação ou
          qualquer forma de tratamento inadequado ou ilícito.
        </div>
        <div>
          Utilizamos os princípios estipulados por lei, respeitando a sua
          privacidade e protegendo seus dados em nossos processos internos como
          um todo
        </div>
        <div>
          Só tratamos os seus dados mediante alto grau de segurança,
          implementando as melhores práticas em uso na indústria para a proteção
          de dados, tais como utilização de firewall, realização de testes de
          vulnerabilidade, entre outros.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">Local de armazenamento:</div>

        <div>Amazon Web Service</div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Por quanto tempo os dados são armazenados?
        </div>

        <div>
          A Privatus armazena as suas informações durante o período necessário
          para as finalidades apresentadas nesta Política de Privacidade,
          respeitando o período de retenção de dados determinado pela legislação
          aplicável.
        </div>
        <div>
          Caso você solicite a exclusão de sua conta, as suas informações
          pessoais fornecidas à Privatus durante a utilização dos nossos
          serviços serão excluídas, salvo para as finalidades permitidas pela
          legislação de proteção de dados.
        </div>
        <div>
          Em alguns casos, poderemos reter suas informações mesmo que você
          exclua sua conta, tais como nas hipóteses de guarda obrigatória de
          registros previstas em leis aplicáveis, se houver uma questão não
          resolvida relacionada à sua conta (como, por exemplo, uma reclamação
          não resolvida), bem como para o exercício regular de nossos direitos,
          ou ainda caso seja necessário para nossos interesses legítimos, como
          prevenção de fraudes e aprimoramento da segurança dos nossos usuários.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Com quem compartilhamos os seus dados:
        </div>
        <div>
          Poderemos compartilhar dados com terceiros prestadores de serviços
          quando necessário para execução de nossas atividades. Nesse caso, os
          dados serão tratados de forma a proteger a sua privacidade, tendo
          essas empresas o dever contratual de garantir proteção compatível com
          a legislação aplicável e com os termos desta Política de Privacidade.
          Os terceiros poderão ser:
        </div>
        <ul className="list-disc list-inside ml-4">
          <li>
            <strong>Gateway de Pagamento</strong> - ASAAS
          </li>
        </ul>
        <div>
          Essas empresas ou indivíduos têm acesso restrito ao necessário aos
          seus dados pessoais, nos limites da execução das atividades
          solicitadas pela Privatus.
        </div>
        <div>
          A Privatus também poderá compartilhar suas informações com autoridades
          policiais ou judiciais e autoridades públicas competentes.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">
          Há transferência para outros países?
        </div>
        <div>
          Para realizar algumas das atividades envolvidas nos serviços da
          Plataforma, a Privatus poderá fazer transferências internacionais de
          dados para outros países, tais como Estados Unidos no que diz respeito
          ao armazenamento dos seus dados por meio da plataforma de nuvem Amazon
          Web Service.
        </div>
        <div>
          Em qualquer caso de compartilhamento com parceiros ou prestadores de
          serviços localizados em outros países, estabelecemos contratualmente
          que o parceiro deve possuir um padrão de proteção de dados e segurança
          da informação compatível com esta Declaração e com a legislação
          aplicável.
        </div>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">Os seus direitos:</div>
        <ul className="list-disc list-inside ml-4">
          <li>Confirmar se o tratamento existe</li>
          <li>Solicitar acesso aos dados tratados</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
          <li>
            Ter os dados não essenciais anonimizados, bloqueados ou eliminados
          </li>
          <li>Saber com quem a Quebrou compartilha os seus dados</li>
          <li>
            Portabilidade de dados (Apenas quando for regulamentado pela
            Autoridade Nacional de Proteção de Dados)
          </li>
        </ul>
      </div>

      <div className="w-full flex flex-col gap-4">
        <div className="text-xl font-semibold">Contatos</div>
        <div>
          Possui alguma dúvida a respeito de dados pessoais ou quer exercer
          algum direito? Entre em contato:{" "}
          <Link
            className="underline text-secondary"
            href="mailto:contato@privatus.vip"
          >
            contato@privatus.vip
          </Link>
        </div>
      </div>
    </div>
  );
}
